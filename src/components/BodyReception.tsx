import { useEffect, useState } from "react";
import { Cliente, Modulo, Perfil, Turno } from "../models/interfaces";
import { get, post, patch, borrar } from "@/api/http";
import useMyModule from "@/hooks/use-my-module";
import { useClientTypeResource } from "@/providers/client-type-provider";

export default function BodyReception() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [cedula, setCedula] = useState<string>("");
  const [nombre, setNombre] = useState<string>("");
  const [tipoCliente, setTipoCliente] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [disabledBtnTurn, setDisabledBtnTurn] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");
  const [radioId, setRadioId] = useState<number>(-1);
  const [clienteSelected, setClienteSelected] = useState<Cliente | null>(null);
  const [id, setId] = useState<number>(-1);
  const [turnos, setTurnos] = useState<Turno[]>([]);

  // ==========================================================================================
  const { myModule } = useMyModule();
  const { clientTypes } = useClientTypeResource();
  // ==========================================================================================

  useEffect(() => {
    get<{ data: Cliente[] }>("clients").then((res) => setClientes(res.data));
    get<{ data: Perfil[] }>("attention_profiles").then((res) =>
      setPerfiles(res.data)
    );
  }, []);

  useEffect(() => {
    if (!myModule) return;
    get<{ data: Turno[] }>(`/rooms/${myModule?.room.id}/shifts`).then((res) => {
      setTurnos(res.data);
    });

    get<{ data: Turno[] }>(`/rooms/${myModule.room.id}/shifts/distracted`).then(
      (res) => {
        setTurnos((prev) => [...prev, ...res.data]);
      }
    );
  }, [myModule]);

  useEffect(() => {
    if (cedula.length < 8 || cedula.length > 10) {
      setMensaje("La cédula debe tener entre 8 y 10 números");
      setNombre("");
      setTipoCliente("");
      setDisabled(true);
    } else {
      const clienteFinded = clientes.find((c) => c.dni == cedula);
      if (clienteFinded) {
        setId(clienteFinded.id);
        setNombre(clienteFinded.name);
        setTipoCliente(clienteFinded.client_type);
        setMensaje("Cliente Encontrado");
        setDisabled(false);
        setClienteSelected(clienteFinded);
      } else {
        setMensaje("Cliente No Encontrado, escriba sus datos");
        setDisabled(false);
        setNombre("");
        setTipoCliente("");
      }
    }
  }, [cedula]);

  useEffect(() => {
    if (nombre == "" || radioId == -1) setDisabledBtnTurn(true);
    else setDisabledBtnTurn(false);
  }, [radioId, nombre]);

  function crearOActualizarCliente() {
    if (cedula == "" || nombre == "" || tipoCliente == "") {
      alert("Faltan campos por registrar");
    } else {
      if (mensaje == "Cliente Encontrado") editarCliente();
      else crearCliente();
    }
  }

  function cliente2clienteId(tipoCliente: string) {
    console.log(tipoCliente);
    let tipoClienteId: number;
    if (tipoCliente == "Estandar") tipoClienteId = 3;
    else if (tipoCliente == "Preferencial") tipoClienteId = 2;
    else if (tipoCliente == "Tramitador") tipoClienteId = 1;
    else tipoClienteId = -1;
    return tipoClienteId;
  }
  function saveTurno(turno: Turno) {
    if (turno.client.client_type == "Preferencial") {
      const preferencials = turnos.filter(
        (t) => t.client.client_type == "Preferencial"
      );
      const normals = turnos.filter(
        (t) => t.client.client_type !== "Preferencial"
      );
      setTurnos([...preferencials, turno, ...normals]);
    } else {
      setTurnos([...turnos, turno]);
    }
  }

  function crearTurno() {
    if (!clienteSelected || !radioId) {
      alert("Faltan campos por registrar");
    } else {
      myModule &&
        post<{ data: Turno }>("shifts/with-attention-profile", {
          room_id: myModule.room.id,
          attention_profile_id: radioId,
          client: {
            id: clienteSelected.id,
            name: clienteSelected.name,
            dni: clienteSelected.dni,
            is_delete: clienteSelected.is_deleted,
            client_type_id: cliente2clienteId(tipoCliente),
          },
        }).then((res) => {
          alert(
            `Turno de ${res.data.client.name} creado con éxito para el perfil ${res.data.attention_profile}`
          );
          saveTurno(res.data);
          limpiar();
        });
    }
  }

  function crearCliente() {
    post<{ data: Cliente }>("clients", {
      name: nombre,
      dni: cedula,
      client_type_id: getClientTypeId(tipoCliente),
      is_deleted: false,
    })
      .then((value) => {
        // Agregar el nuevo módulo a la lista de módulo registradas
        setClientes([value.data, ...clientes]);
        setClienteSelected(value.data);
      })
      .then(() => {
        alert("Cliente guardado");
        setMensaje("Cliente Encontrado");
      });
  }

  function getClientTypeId(name: string): number {
    if (name == "Estandar") return 3;
    else if (name == "Preferencial") return 2;
    else if (name == "Tramitador") return 1;
    else return -1;
  }

  function editarCliente() {
    patch<{ data: Cliente }>(`clients/${id}`, {
      name: nombre,
      dni: cedula,
      client_type_id: getClientTypeId(tipoCliente),
      is_deleted: false,
    }).then(() => {
      const clientinternal = clientes;
      const nuevosClientes: Cliente[] = [];
      clientinternal.map((cliente) => {
        if (cliente.id == id) {
          const clienteActualizado: Cliente = {
            id: cliente.id,
            name: nombre,
            dni: cedula,
            client_type: tipoCliente,
            is_deleted: false,
          };
          nuevosClientes.push(clienteActualizado);
        } else {
          nuevosClientes.push(cliente);
        }
      });
      setClientes(nuevosClientes);
      alert("Cliente actualizado");
    });
  }

  function eliminar(id: number) {
    borrar(`shifts/${id}`).then(() => {
      const turnosActuales = turnos;
      const nuevosTurnos: Turno[] = [];
      turnosActuales.map((turno) => {
        if (turno.id != id) {
          nuevosTurnos.push(turno);
        }
      });
      setTurnos(nuevosTurnos);
      alert("Turno eliminado");
      limpiar();
    });
  }

  function limpiar() {
    setCedula("");
    setNombre("");
    setTipoCliente("");
    setRadioId(-1);
  }

  return (
    <div className="container margenbody">
      <div className="row mt-5">
        <h2>Reservar Turno</h2>
        <p className="fs-5">
          Bienvenido a nuestro sistema de reserva de turnos. Por favor
          seleccione el tipo de perfil que desea reservar
        </p>
      </div>
      <div className="row">
        <div className="col-8 cuadroPerfiles">
          <div className="row d-flex align-items-center justify-content-evenly">
            <div className="col">
              <h4>Perfiles disponibles</h4>
              <p className="fs-6">Seleccione el perfil que desea reservar</p>
            </div>
            <div className="col">
              <div className="form-floating">
                <input
                  type="text"
                  name="buscarPerfil"
                  id="buscarPerfil"
                  placeholder="Buscar perfil"
                  className="buscarPerfil form-control"
                />
                <label htmlFor="buscarPerfil" className="fs-6">
                  Perfil
                </label>
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col">
              <ul>
                {perfiles.map((perfil) => (
                  <li key={perfil.id} className="listaPerfil w-100">
                    <input
                      type="radio"
                      className="btn-check"
                      name="perfiles"
                      id={perfil.id.toString()}
                      value={perfil.id}
                      checked={radioId == -1 ? false : true}
                      onChange={(e) => setRadioId(parseInt(e.target.value))}
                    />
                    <label
                      className={
                        radioId == perfil.id
                          ? "btn w-100 perfilSelected"
                          : "btn w-100"
                      }
                      htmlFor={perfil.id.toString()}
                    >
                      {perfil.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              disabled={disabledBtnTurn}
              onClick={crearTurno}
            >
              Asignar Turno
            </button>
          </div>
        </div>
        <div className="col-3 cuadroPerfiles h-50">
          <div className="row d-flex align-items-center justify-content-evenly">
            <div className="col">
              <h4>Buscar cliente</h4>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  name="buscarCliente"
                  id="buscarCliente"
                  placeholder="Buscar Cliente"
                  className="buscarPerfil form-control"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                />
                <label htmlFor="buscarCliente" className="fs-6">
                  Cédula
                </label>
                <p className="mensaje">{mensaje}</p>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  name="nombreCliente"
                  id="nombreCliente"
                  placeholder="Nombre del cliente"
                  className="buscarPerfil form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={disabled}
                />
                <label htmlFor="nombreCliente" className="fs-6">
                  Nombre
                </label>
              </div>

              <div className="mb-3">
                <select
                  name="tipoCliente"
                  id="tipoCliente"
                  className="form-select w-100"
                  value={tipoCliente}
                  onChange={(e) => {
                    console.log(e.target.value);
                    return setTipoCliente(e.target.value);
                  }}
                >
                  <option value="No Seleccionado">Seleccione una opción</option>
                  {clientTypes.map((clientType) => (
                    <option value={clientType.name} key={clientType.id}>
                      {clientType.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-primary w-100 mb-2"
                  disabled={disabled}
                  onClick={crearOActualizarCliente}
                >
                  {mensaje == "Cliente Encontrado"
                    ? "Editar Cliente"
                    : "Crear Cliente"}
                </button>
                <button
                  type="button"
                  className="btn btn-warning w-100"
                  onClick={limpiar}
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row w-100">
        <h2>Turnos</h2>
        <table className="table table-bordered text-center">
          <thead>
            <tr>
              <td>#</td>
              <td>Nombre usuario</td>
              <td>Perfil</td>
              <td>Sala</td>
              <td>Estado</td>
              <td>Opciones</td>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno, index) => (
              <tr
                key={turno.id}
                style={
                  turno.state == "distracted"
                    ? { backgroundColor: "#ff000090" }
                    : { backgroundColor: "#00ff0090" }
                }
              >
                <td>{index + 1}</td>
                <td>{turno.client.name}</td>
                <td>{turno.attention_profile}</td>
                <td>{turno.room}</td>
                <td>{turno.state}</td>
                <td>
                  <button onClick={() => eliminar(turno.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
