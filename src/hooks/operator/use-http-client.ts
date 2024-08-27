import httpClient from "@/config/http";
import { toast } from "react-toastify";

// export const host = "192.168.1.9";
// export const host = "localhost";

const useHttpClient = () => {
  const showError = (statusCode: number) => {
    const messages: {
      [key: number]: string;
    } = {
      401: "No autorizado",
      403: "Prohibido",
      404: "No encontrado",
      500: "Error interno del servidor",
      422: "Error de validación",
      405: "Acción no permitida",
      0: "No se puede conectar al servidor",
    };
    toast.error(messages[statusCode] || "Ha ocurrido un error inesperado", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showMessageError = (errors: any, statusCode: number) => {
    const errorMessageMapping: any = {
      client_has_pending_shift: "El cliente tiene un turno pendiente",
      email_not_found: "Correo no encontrado",
      email_invalid: "Correo inválido",
      email_required: "Correo requerido",
      password_required: "Contraseña requerida",
      password_invalid: "Contraseña inválida",
      invalid_credentials: "Contraseña o correo incorrectos",
      expired_token: "La sesión ha expirado",
      no_available_module: "No hay módulos disponibles",
      "module-already-in-progress": "El módulo ya esta siendo atendido",
      shift_in_progress_cannot_be_deleted: "El turno ya esta siendo atendido",
      attendant_already_busy: "El funcionario tiene un turno en progreso",
    };
    if (
      statusCode !== 422 &&
      statusCode !== 403 &&
      statusCode !== 401 &&
      statusCode !== 400
    ) {
      showError(statusCode);
      return;
    }
    if (statusCode === 403 || statusCode === 401 || statusCode === 400) {
      toast.error(
        errorMessageMapping[errors.message] ||
          `${statusCode}: Error desconocido`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return;
    }
    const messages = Object.values(errors)
      .map((values: any) =>
        values.map(
          (e: any) => errorMessageMapping[e] || "422: Error desconocido"
        )
      )
      .join(", ");
    toast.error(messages, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  httpClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      toast.dismiss();
      showMessageError(error.response.data, error.response.status);
      return Promise.reject(error);
    }
  );
  return httpClient;
};
export default useHttpClient;
