import httpClient from "@/config/http";
import { toast } from "react-toastify";

export default function useHttpClient() {
  const onStatusCodeError = (status: number) => {
    switch (status) {
      case 401:
        toast.error("No estas autorizado");
        break;
      case 403:
        toast.error("No tienes permisos");
        break;
      case 404:
        toast.error("No se encontró la página");
        break;
      case 500:
        toast.error("Error interno del servidor");
        break;
      case 422:
        toast.error("Error de validación");
        break;
      default:
        toast.error("Error desconocido");
        break;
    }
  };

  httpClient.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  httpClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        onStatusCodeError(error.response.status);
      }
      return Promise.reject(error);
    }
  );
  return httpClient;
}
