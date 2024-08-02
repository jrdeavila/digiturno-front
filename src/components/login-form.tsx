import useAuth from "@/hooks/use-auth";
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
  const { login } = useAuth();
  // =======================================================
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("El correo electrónico debe ser valido")
      .required("El correo electrónico es requerido"),
    password: Yup.string().required("La contraseña es requerida"),
  });
  // =======================================================
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        login(values.email, values.password);
      }}
    >
      {({ handleSubmit, getFieldProps, errors }) => (
        <form onSubmit={handleSubmit} style={{
          width: "100%",
          maxWidth: "400px",
          margin: "auto",
        }}>
          <Card>
            <CardHeader>
              <span className="text-xl font-bold">INICIAR SESIÓN</span>
            </CardHeader>
            <CardBody className="flex flex-col gap-y-3">
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
        </form>
      )}
    </Formik>
  );
}
