import axios from "axios";
import { toast } from "react-toastify";
const apiUrl = "https://digiturnov2.ccvalledupar.org.co/api";

const httpClient = axios.create({
  baseURL: apiUrl,
});

httpClient.interceptors.request.use(function (config) {
  config.headers["Content-Type"] = "application/json";
  return config;
});

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

httpClient.interceptors.response.use(
  function (config) {
    return config;
  },
  (error) => {
    if (error.response) {
      showError(error.response.status);
    } else {
      showError(0);
    }
    return Promise.reject(error);
  }
);

export async function get<T>(endpoint: string, config: object): Promise<T> {
  const response = await httpClient.get<T>(endpoint, config);
  return response.data;
}

export async function post<T>(endpoint: string, data: object, config: object): Promise<T> {
  const response = await httpClient.post<T>(endpoint, data, config);
  return response.data;
}

export async function patch<T>(endpoint: string, data: object, config: object): Promise<T> {
  const response = await httpClient.patch(endpoint, data, config);
  return response.data;
}

export async function borrar<T>(endpoint: string, config: object): Promise<T> {
  const response = await httpClient.delete(endpoint, config);
  return response.data;
}
