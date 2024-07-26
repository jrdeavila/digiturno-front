import axios from "axios";

// const host = "192.168.0.202";
const host = "192.168.1.9";
// const host = "localhost";

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
