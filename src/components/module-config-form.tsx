import useMyModule, { MyModuleProps } from "@/hooks/use-my-module";
import useSectional from "@/hooks/use-sectional";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Formik } from "formik";
import IPv4Input from "./ipv4-input";
import * as Yup from "yup";

export default function ModuleConfigForm() {
  const { sectionals, roomsBySectional, filterRooms, moduleTypes } =
    useSectional();
  const { configureModuleInfo } = useMyModule();
  const validationSchema = Yup.object().shape({
    ip: Yup.string()
      .matches(
        /^(\d{1,3}\.){0,3}\d{0,3}$/,
        "La dirección IP debe tener el formato correcto"
      )
      .required("La dirección IP es requerida"),
    sectional_id: Yup.number()
      .min(1, "La seccional es requerida")
      .required("La seccional es requerida"),
    room_id: Yup.number()
      .min(1, "La sala es requerida")
      .required("La sala es requerida"),
    module_type_id: Yup.number()
      .min(1, "El tipo de módulo es requerido")
      .required("El tipo de módulo es requerido"),
  });
  return (
    <Formik
      initialValues={{
        ip: "",
        sectional_id: -1,
        room_id: -1,
        module_type_id: -1,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        configureModuleInfo(
          new MyModuleProps(
            values.ip,
            values.sectional_id,
            values.room_id,
            values.module_type_id
          )
        );
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
              <Select
                {...getFieldProps("sectional_id")}
                label="Seccional"
                placeholder="Seccional"
                isInvalid={!!errors.sectional_id}
                errorMessage={errors.sectional_id}
              >
                {sectionals.map((sectional) => (
                  <SelectItem
                    onClick={() => filterRooms(sectional.id)}
                    key={sectional.id}
                    value={sectional.id}
                  >
                    {sectional.name}
                  </SelectItem>
                ))}
              </Select>
              <Select
                {...getFieldProps("room_id")}
                label="Sala"
                placeholder="Sala"
                isInvalid={!!errors.room_id}
                errorMessage={errors.room_id}
              >
                {roomsBySectional.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </Select>
              <Select
                {...getFieldProps("module_type_id")}
                label="Tipo de módulo"
                placeholder="Tipo de módulo"
                isInvalid={!!errors.module_type_id}
                errorMessage={errors.module_type_id}
              >
                {moduleTypes.map((moduleType) => (
                  <SelectItem
                    key={moduleType.id}
                    value={moduleType.id}
                    textValue={moduleType.name}
                  >
                    {
                      <div className="flex items-center gap-x-2">
                        <FontAwesomeIcon icon={moduleType.icon} />
                        {moduleType.name}
                      </div>
                    }
                  </SelectItem>
                ))}
              </Select>
              <div className="flex-grow"></div>
              <Button
                type="submit"
                className="bg-primary text-white"
                isDisabled={
                  !!errors.ip ||
                  !!errors.sectional_id ||
                  !!errors.room_id ||
                  !!errors.module_type_id
                }
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
