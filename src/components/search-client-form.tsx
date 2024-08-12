import { useClientResource } from "@/providers/client-provider";
import { useClientTypeResource } from "@/providers/client-type-provider";
import { useCreateShift } from "@/providers/create-shift-provider";
import { Input, Select, SelectItem } from "@nextui-org/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Formik, useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

const SearchClientForm = () => {
  const { clients } = useClientResource();
  const { setClient, client } = useCreateShift();
  const { clientTypes } = useClientTypeResource();





  // ==================================================================================================================

  const validationScheme = Yup.object().shape({
    dni: Yup.string().required("La cédula es requerida"),
    name: Yup.string().required("El nombre es requerido"),
    client_type_id: Yup.number().required("El tipo de cliente es requerido"),
  });

  // ==================================================================================================================

  const handleSearchClient = (dni: string, onFound: (values: {
    dni: string,
    name: string,
    client_type_id: number
  }) => void) => {
    const client = clients.find((client) => client.dni === dni);
    if (client) {
      setClient(client);
      onFound({
        dni: client.dni,
        name: client.name,
        client_type_id: clientTypes.find((clientType) => clientType.slug == client.clientType)?.id || 0,
      });
    } else {
      return;
    }

  }

  // ==================================================================================================================

  const {
    handleChange, values, errors, handleSubmit, setValues
  } = useFormik({
    initialValues: {
      dni: "",
      name: "",
      client_type_id: 1,
    },
    validationSchema: validationScheme,
    validate: (values) => {
      setClient({
        dni: values.dni,
        name: values.name,
        clientType: clientTypes.find((clientType) => clientType.id === values.client_type_id)?.slug || "standard",
        isDeleted: false,
        id: 0,
        moduleName: "",
      })
      return {};
    },
    onSubmit: (values) => {
      setClient({
        dni: values.dni,
        name: values.name,
        clientType: clientTypes.find((clientType) => clientType.id === values.client_type_id)?.slug || "standard",
        isDeleted: false,
        id: 0,
        moduleName: "",
      })
    }
  })

  // ==================================================================================================================

  useEffect(() => {
    if (!client) {
      setValues({
        dni: "",
        name: "",
        client_type_id: 1,
      })
    }

  }, [client])

  // ==================================================================================================================


  return (

    <form className="flex flex-row gap-x-3 w-full">
      <div className="flex flex-col p-4 gap-y-2 w-full h-full">
        <div className="flex flex-row gap-x-3">
          <Input name="cc" placeholder="Cédula del cliente" label="Cédula" value={values.dni} onChange={(e) => {
            handleChange("dni")(e);
            handleSearchClient(e.target.value, (values) => {
              setValues(values);
            })

          }}
            errorMessage={errors.dni}
            isInvalid={!!errors.dni}
          />
          <Input name="name" placeholder="Nombre del cliente" label="Nombre" value={values.name} onChange={handleChange("name")}

            errorMessage={errors.name}
            isInvalid={!!errors.name}
          />
        </div>

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

      </div>

    </form>






  )
}

export default SearchClientForm;