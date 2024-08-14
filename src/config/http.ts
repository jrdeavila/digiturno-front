import axios from "axios";

// export const host = "digiturnov2.ccvalledupar.org.co";
const host = "localhost"

const httpClient = axios.create({
  baseURL: `http://${host}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  },
  timeout: 5000,
});

export default httpClient;
