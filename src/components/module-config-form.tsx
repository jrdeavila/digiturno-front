import useMyModule, { MyModuleProps } from "@/hooks/use-my-module";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { Formik } from "formik";
import * as Yup from "yup";
import IPv4Input from "./ipv4-input";

export default function ModuleConfigForm() {
  const { configureModuleInfo } = useMyModule();
  const validationSchema = Yup.object().shape({
    ip: Yup.string()
      .matches(
        /^(\d{1,3}\.){0,3}\d{0,3}$/,
        "La dirección IP debe tener el formato correcto"
      )
      .required("La dirección IP es requerida"),
  });
  return (
    <Formik
      initialValues={{
        ip: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        configureModuleInfo(new MyModuleProps(values.ip));
      }}
    >
      {({ handleSubmit, getFieldProps, errors }) => (
        <form onSubmit={handleSubmit}>
          <Card id="module-config-form">
            <CardHeader>
              <span className="text-xl font-bold">
                CONFIGURACIÓN DEL MODULO
              </span>
            </CardHeader>
            <CardBody className="flex flex-col gap-y-2">
              <IPv4Input
                {...getFieldProps("ip")}
                label="Dirección IP"
                placeholder="IP"
                type="text"
                isInvalid={!!errors.ip}
                errorMessage={errors.ip}
              />

              <div className="flex-grow"></div>
              <Button
                type="submit"
                className="bg-primary text-white"
                isDisabled={!!errors.ip}
              >
                GUARDAR CONFIGURACIÓN
              </Button>
            </CardBody>
          </Card>
        </form>
      )}
    </Formik>
  );
}
