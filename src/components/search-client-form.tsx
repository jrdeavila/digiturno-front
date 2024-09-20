import { useClientResource } from "@/providers/client-provider";
import { useClientTypeResource } from "@/providers/client-type-provider";
import { useCreateShift } from "@/providers/create-shift-provider";
import { Input, Select, SelectItem } from "@nextui-org/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";

const SearchClientForm: React.FC<{
  enabledType?: boolean;
}> = ({
  enabledType,
}) => {
    const { clients, findClient } = useClientResource();
    const { setClient, client } = useCreateShift();
    const { clientTypes } = useClientTypeResource();

    // ==================================================================================================================

    const validationScheme = Yup.object().shape({
      dni: Yup.string().required("La cédula es requerida"),
      name: Yup.string().required("El nombre es requerido"),
      client_type_id: Yup.number().required("El tipo de cliente es requerido"),
    });

    // ==================================================================================================================

    const { handleChange, values, errors, handleSubmit, setValues, resetForm } =
      useFormik({
        initialValues: {
          dni: "",
          name: "",
          client_type_id: 3,
        },
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
      onFound: (values: {
        dni: string;
        name: string;
        client_type_id: number;
      }) => void
    ) => {
      const client = clients.find((client) => client.dni === dni);
      if (client) {
        setClient(client);
        onFound({
          dni: client.dni,
          name: client.name,
          client_type_id:
            clientTypes.find((clientType) => clientType.slug == client.clientType)
              ?.id || 0,
        });
        setValues({
          dni: client.dni,
          name: client.name,
          client_type_id:
            clientTypes.find((clientType) => clientType.slug == client.clientType)
              ?.id || 1,
        });
      } else {
        return;
      }
    };

    const forceSearchClient = (
      dni: string,
      onFound: (values: {
        dni: string;
        name: string;
        client_type_id: number;
      }) => void
    ) => {
      findClient(dni).then((client) => {
        if (client) {
          setClient(client);
          onFound({
            dni: client.dni,
            name: client.name,
            client_type_id:
              clientTypes.find((clientType) => clientType.slug == client.clientType)
                ?.id || 0,
          });
          setValues({
            dni: client.dni,
            name: client.name,
            client_type_id:
              clientTypes.find((clientType) => clientType.slug == client.clientType)
                ?.id || 1,
          });
        } else {
          return;
        }
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
              onChange={(e) => {
                handleChange("dni")(e);
                handleSearchClient(e.target.value, (values) => {
                  setValues(values);
                });
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
                  handleChange("client_type_id")(e);
                  handleSubmit();
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
            !values.name &&
            values.dni &&

            (<button
              onClick={(e) => {
                e.preventDefault();
                return forceSearchClient(values.dni, (values) => {
                  setValues(values);
                });
              }}
              className="w-full bg-primary text-white rounded-lg py-2 cursor-pointer"
            >
              Forzar búsqueda
            </button>)
          }
        </div>
      </form>
    );
  };

export default SearchClientForm;
