import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import { Formik } from "formik";
import * as Yup from "yup";

export default function LoginForm() {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("El correo electrónico debe ser valido")
      .required("El correo electrónico es requerido"),
    password: Yup.string().required("La contraseña es requerida"),
  });
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ handleSubmit, getFieldProps, errors }) => (
        <Card className="h-full w-full" id="card-login-form">
          <CardHeader>
            <span className="text-xl font-bold">INICIAR SESIÓN</span>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
              <Input
                {...getFieldProps("email")}
                type="text"
                label="Correo electrónico"
                placeholder="email@ccvalledupar.org.co"
                errorMessage={errors.email}
                isInvalid={!!errors.email}
              />
              <Input
                {...getFieldProps("password")}
                type="password"
                label="Contraseña"
                placeholder="**************"
                errorMessage={errors.password}
                isInvalid={!!errors.password}
              />
            </form>
          </CardBody>
          <CardFooter>
            <Button
              type="submit"
              className="bg-primary text-white w-full"
              isDisabled={!!errors.email || !!errors.password}
            >
              ENTRAR
            </Button>
          </CardFooter>
        </Card>
      )}
    </Formik>
  );
}
