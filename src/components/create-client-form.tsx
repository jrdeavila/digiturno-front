import { useClientResource } from "@/providers/client-provider";
import { useClientTypeResource } from "@/providers/client-type-provider";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

type CreateClientFormValues = {
  firstName: string;
  lastName: string;
  dni: string;
  clientTypeId: number;
};

export const CreateClientForm: React.FC<{
  dni?: string;
  onFinished?: () => void;
}> = ({ onFinished, dni }) => {
  const { clientTypes } = useClientTypeResource();
  const {
    createClient,
    updateClient,
    currentClient,
    setCurrentClient,
    clients,
  } = useClientResource();
  const initialValues: CreateClientFormValues = {
    firstName: "",
    lastName: "",
    dni: dni || "",
    clientTypeId: 0,
  };
  const validationSchema = Yup.object<CreateClientFormValues>().shape({
    firstName: Yup.string().required("El nombre es requerido"),
    lastName: Yup.string().required("El apellido es requerido"),
    dni: Yup.number()
      .required("El documento es requerido"),
    clientTypeId: Yup.number()
      .min(1, "El tipo de cliente es requerido")
      .required("El tipo de cliente es requerido"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    validate: (values) => {
      const errors: Partial<CreateClientFormValues> = {};

      const client = clients.find((client) => client.dni === values.dni);
      if (client && client.id !== currentClient?.id) {
        errors.dni = "El DNI ya se encuentra registrado";
      }
      return errors;
    },
    onSubmit: (values, { resetForm }) => {
      const clientType = clientTypes.find(
        (clientType) => clientType.id == values.clientTypeId
      );

      if (!clientType) {
        return;
      }

      if (currentClient) {
        updateClient(
          {
            id: currentClient.id,
            name: `${values.firstName} ${values.lastName}`,
            dni: values.dni,
            clientType: clientType.name,
            isDeleted: false,
            moduleName: currentClient.moduleName,
          },
          clientType
        );
        setCurrentClient(undefined);
      } else {
        createClient(
          {
            id: 0,
            name: `${values.firstName} ${values.lastName}`,
            dni: values.dni,
            clientType: clientType!.name,
            isDeleted: false,
            moduleName: "",
          },
          clientType!
        );
      }
      resetForm();
      setCurrentClient(undefined);
      onFinished && onFinished();
    },
  });

  useEffect(() => {
    if (currentClient && clientTypes.length > 0) {
      formik.setValues({
        firstName: currentClient.name,
        lastName: "",
        dni: currentClient.dni,
        clientTypeId:
          clientTypes.find(
            (clientType) => clientType.name === currentClient.clientType
          )?.id || 1,
      });
    }
  }, [currentClient, clientTypes]);

  useEffect(() => {
    if (clientTypes.length > 0) {
      formik.setValues({
        ...formik.values,
        clientTypeId: 1,
      });
    }
  }, [clientTypes]);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">CREAR NUEVO CLIENTE</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-y-2">
            <Input
              label="Nombres"
              name="name"
              value={formik.values.firstName}
              onChange={formik.handleChange("firstName")}
              onBlur={formik.handleBlur}
              isInvalid={!!formik.errors.firstName}
              errorMessage={formik.errors.firstName}
            />
            <Input
              label="Apellidos"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange("lastName")}
              onBlur={formik.handleBlur}
              isInvalid={!!formik.errors.lastName}
              errorMessage={formik.errors.lastName}
            />
            <Input
              label="DNI"
              name="dni"
              value={formik.values.dni}
              onChange={formik.handleChange("dni")}
              onBlur={formik.handleBlur}
              errorMessage={formik.errors.dni}
              isInvalid={!!formik.errors.dni}
            />
            <Select
              className="block w-full"
              label="Tipo de Cliente"
              name="clientTypeId"
              value={formik.values.clientTypeId}
              selectedKeys={formik.values.clientTypeId.toString()}
              onChange={formik.handleChange("clientTypeId")}
              onBlur={formik.handleBlur}
              isInvalid={!!formik.errors.clientTypeId}
              errorMessage={formik.errors.clientTypeId}
            >
              {clientTypes.map((clientType) => (
                <SelectItem key={clientType.id} value={clientType.id}>
                  {clientType.name}
                </SelectItem>
              ))}
            </Select>
            <div className="flex flex-row justify-end gap-x-3">
              {
                <Button
                  onClick={() => {
                    formik.resetForm();
                    setCurrentClient(undefined);
                    onFinished && onFinished();
                  }}
                  color="danger"
                  type="button"
                  className="mt-5"
                >
                  <span className="font-bold">CANCELAR</span>
                </Button>
              }
              <Button color="primary" type="submit" className="mt-5">
                <span className="font-bold">
                  {currentClient ? "ACTUALIZAR" : "CREAR CLIENTE"}
                </span>
              </Button>
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
