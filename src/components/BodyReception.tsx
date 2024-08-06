import { borrar, get, patch, post } from "@/api/http";
import useMyModule from "@/hooks/use-my-module";
import { useClientTypeResource } from "@/providers/client-type-provider";
import { useEffect, useState } from "react";
import { Cliente, Perfil, Turno } from "../models/interfaces";
import "@/styles/receptor.css";

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
  const [conteos, setConteos] = useState<{
    espera: number;
    distraidos: number;
    atendidos: number;
    transferidos: number;
  }>({ espera: 0, distraidos: 0, atendidos: 0, transferidos: 0 });

  // ==========================================================================================
  const { myModule } = useMyModule();
  const { clientTypes } = useClientTypeResource();
  // ==========================================================================================

  useEffect(() => {
    get<{ data: Cliente[] }>("clients", {
      headers: {
        "X-Module-Ip": myModule?.ipAddress,
      },
    }).then((res) => setClientes(res.data));
    get<{ data: Perfil[] }>("attention_profiles", {
      headers: {
        "X-Module-Ip": myModule?.ipAddress,
      }
    }).then((res) =>
      setPerfiles(res.data)
    );
  }, []);

  useEffect(() => {
    if (!myModule) return;
    get<{ data: Turno[] }>(`/rooms/${myModule?.room.id}/shifts`, {
      headers: {
        "X-Module-Ip": myModule?.ipAddress
      }
    }).then((res) => {
      setTurnos(res.data);
    });

    get<{ data: Turno[] }>(`/rooms/${myModule.room.id}/shifts/distracted`, {
      headers: {
        "X-Module-Ip": myModule.ipAddress,
      },
    }).then(
      (res) => {
        setTurnos((prev) => [...prev, ...res.data]);
      }
    );
  }, [myModule]);

  useEffect(() => {
    if (cedula.length == 0) {
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

  useEffect(() => {
    let contEspera = 0;
    let contDistraidos = 0;
    let contAtendidos = 0;
    let contTransferidos = 0;
    turnos.map((turno) => {
      if (turno.state == "pending") contEspera += 1;
      else if (turno.state == "distracted") contDistraidos += 1;
      else if (turno.state == "qualified") contAtendidos += 1;
      else if (turno.state == "transferred") contTransferidos += 1;
    });
    setConteos({
      espera: contEspera,
      distraidos: contDistraidos,
      atendidos: contAtendidos,
      transferidos: contTransferidos,
    });
  }, [turnos]);

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
        },
          {
            headers: {
              "X-Module-Ip": myModule.ipAddress,
            }
          },
        ).then((res) => {
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
    }, {
      headers: {
        "X-Module-Ip": myModule?.ipAddress,
      },
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
    }, {
      headers: {
        "X-Module-Ip": myModule?.ipAddress
      }
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
    borrar(`shifts/${id}`, {
      headers: {
        "X-Module-Ip": myModule?.ipAddress
      }
    }).then(() => {
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

  function diccionario(ingles: string): string {
    const traductor: { [key: string]: string } = {
      pending: "En espera",
      distracted: "Distraido",
      transferred: "Transferido",
      "in-process": "En Espera",
    };
    return traductor[ingles];
  }

  return (
    <div className="container margenbody">
      <div className="row">
        <div className="col-8 cuadroReceptor">
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
              className="btn w-100"
              style={{
                backgroundColor: "#00204D",
                color: "white",
                fontWeight: "bold",
              }}
              disabled={disabledBtnTurn}
              onClick={crearTurno}
            >
              ASIGNAR TURNO
            </button>
          </div>
        </div>
        <div className="col-3 cuadroReceptor h-50">
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
                  style={{
                    backgroundColor: "#00204D",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  disabled={disabled}
                  onClick={crearOActualizarCliente}
                >
                  {mensaje == "Cliente Encontrado"
                    ? "EDITAR CLIENTE"
                    : "CREAR CLIENTE"}
                </button>
                <button
                  type="button"
                  className="btn w-100"
                  style={{
                    backgroundColor: "rgb(248 113 113)",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  onClick={limpiar}
                >
                  LIMPIAR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row w-100">
        <h2>Turnos</h2>
        <table className="table table-bordered text-center table-striped">
          <thead>
            <tr style={{ backgroundColor: "lightcyan", fontWeight: "bold" }}>
              <td>#</td>
              <td># DOCUMENTO</td>
              <td>NOMBRE USUARIO</td>
              <td>PERFIL DE ATENCIÓN</td>
              <td>ESTADO</td>
              <td>TIPO DE USUARIO</td>
              <td>OPCIONES</td>
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
                <td>{turno.client.dni}</td>
                <td>{turno.client.name}</td>
                <td>{turno.attention_profile}</td>
                <td>{diccionario(turno.state)}</td>
                <td>{turno.client.client_type}</td>
                <td className="d-flex align-items-center justify-content-center">
                  <span title="Eliminar">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#992B15"
                      cursor="pointer"
                      className="icono"
                      onClick={() => eliminar(turno.id)}
                    >
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                    </svg>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row w-50 cuadroReceptor" style={{ margin: "30px 25%" }}>
        <div className="col-3 text-center">
          <h2>{conteos.espera}</h2>
          <h6>En espera</h6>
        </div>
        <div className="col-3 text-center">
          <h2>{conteos.distraidos}</h2>
          <h6>Distraidos</h6>
        </div>
        <div className="col-3 text-center">
          <h2>{conteos.atendidos}</h2>
          <h6>Atendidos</h6>
        </div>
        <div className="col-3 text-center">
          <h2>{conteos.transferidos}</h2>
          <h6>Transferidos</h6>
        </div>
      </div>
    </div>
  );
}
