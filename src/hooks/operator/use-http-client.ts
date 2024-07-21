import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";

// export const host = "192.168.0.202";
export const host = "localhost";

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
  // =====================================================
  const httpClient: AxiosInstance = axios.create({
    baseURL: "http://" + host + "/api",
  });
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
      if (error.response) {
        showError(error.response.status);
      } else {
        showError(0);
      }
      return Promise.reject(error);
    }
  );
  return httpClient;
};
export default useHttpClient;
