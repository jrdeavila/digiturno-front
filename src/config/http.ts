import axios from "axios";

const host = "digiturnov2.ccvalledupar.org.co";

const httpClient = axios.create({
  baseURL: `https://${host}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  },
});

export default httpClient;
