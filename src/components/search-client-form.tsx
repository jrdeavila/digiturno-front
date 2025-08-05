import { useClientResource } from "@/providers/client-provider";
import { useClientTypeResource } from "@/providers/client-type-provider";
import { useCreateShift } from "@/providers/create-shift-provider";
import { Input, Select, SelectItem } from "@nextui-org/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

const SearchClientForm: React.FC<{
  enabledType?: boolean;
}> = ({
  enabledType,
}) => {
    const { clients, findClient } = useClientResource();
    const { setClient, client } = useCreateShift();
    const { clientTypes } = useClientTypeResource();
    const [forceSearching, setForceSearching] = useState(false);

    // ==================================================================================================================

    const validationScheme = Yup.object().shape({
      dni: Yup.string().required("La cédula es requerida"),
      name: Yup.string().required("El nombre es requerido"),
      client_type_id: Yup.number().required("El tipo de cliente es requerido"),
    });

    // ==================================================================================================================

    const initialValues: {
      dni: string;
      name: string;
      client_type_id: number;
    } = {
      dni: client?.dni || "",
      name: client?.name || "",
      client_type_id: clientTypes.find(
        (clientType) => clientType.slug === client?.clientType
      )?.id || 0,
    };

    const { handleChange, values, errors, setFieldValue, resetForm } =
      useFormik({
        initialValues: initialValues,
        validationSchema: validationScheme,
        validate: (values) => {
          setClient({
            dni: values.dni,
            name: values.name,
            clientType:
              clientTypes.find(
                (clientType) => clientType.id === values.client_type_id
              )?.slug || "standard",
            isDeleted: false,
            id: 0,
            moduleName: "",
          });
          return {};
        },
        onSubmit: (values) => {
          setClient({
            dni: values.dni,
            name: values.name,
            clientType:
              clientTypes.find(
                (clientType) => clientType.id === values.client_type_id
              )?.slug || "standard",
            isDeleted: false,
            id: 0,
            moduleName: "",
          });
        },
      });

    // ==================================================================================================================

    const handleSearchClient = (
      dni: string,
    ) => {
      const client = clients.find((client) => client.dni === dni);

      if (client) {
        const clientTypeId = clientTypes.find((clientType) => clientType.slug == client.clientType)
          ?.id || 0;
        setFieldValue("client_type_id", clientTypeId);
        setFieldValue("name", client.name);
      } else {
        return;
      }
    };

    const forceSearchClient = (
      dni: string,
    ) => {
      setForceSearching(true);
      findClient(dni).then((client) => {
        if (client) {
          setClient(client);
          setFieldValue("client_type_id", clientTypes.find((clientType) => clientType.slug == client.clientType)?.id || 0);
          setFieldValue("name", client.name);

        }
        setForceSearching(false);
      }).catch(() => {
        setForceSearching(false);
      });

    }

    // ==================================================================================================================

    useEffect(() => {
      if (!client) {
        resetForm();
      }
    }, [client, resetForm]);

    // ==================================================================================================================

    return (
      <form className="flex flex-row gap-x-3 w-full">
        <div className="flex flex-col p-4 gap-y-2 w-full h-full">
          <div className="flex flex-row gap-x-3">
            <Input
              name="cc"
              placeholder="Cédula del cliente"
              label="Cédula"
              value={values.dni}
              type="tel"
              onChange={(e) => {
                handleChange("dni")(e);
                handleSearchClient(e.target.value);
              }}
              errorMessage={errors.dni}
              isInvalid={!!errors.dni}
            />
            <Input
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.toUpperCase();
              }}
              name="name"
              placeholder="Nombre del cliente"
              label="Nombre"
              value={values.name}
              onChange={handleChange("name")}
              errorMessage={errors.name}
              isInvalid={!!errors.name}
            />
          </div>

          {
            enabledType && (
              <Select
                className="block"
                label="Tipo de atención"
                name="clientTypeId"
                value={values.client_type_id.toString()}
                selectedKeys={values.client_type_id.toString()}
                onChange={(e) => {
                  if (e.target.value === "") {
                    return;
                  }
                  setFieldValue("client_type_id", parseInt(e.target.value));
                }}
              >
                {clientTypes.map((clientType) => (
                  <SelectItem key={clientType.id} value={clientType.id}>
                    {clientType.name}
                  </SelectItem>
                ))}
              </Select>
            )
          }

          {
            (forceSearching ? (
              <div className="mt-2 text-center py-2">
                Buscando...
              </div>
            ) :

              (<div className="flex flex-row gap-x-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    return forceSearchClient(values.dni)
                  }}
                  className="w-full bg-primary text-white rounded-lg py-2 cursor-pointer"
                >
                  Buscar cliente
                </button>
                <button onClick={(e) => {
                  e.preventDefault();
                  resetForm();
                }} className="w-full bg-red-600 text-white rounded-lg py-2 cursor-pointer">
                  Limpiar
                </button>
              </div>))
          }
        </div>
      </form>
    );
  };

export default SearchClientForm;
