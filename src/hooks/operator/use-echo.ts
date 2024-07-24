import Echo from "laravel-echo";
import { host } from "./use-http-client";

export default function useEcho(): Echo {
  return new Echo({
    broadcaster: "reverb",
    key: "jr010ypjfa02d1plefjc",
    wsHost: host,
    wsPort: 8080,
    wssPort: 8080,
    forceTLS: false,
    enabledTransports: ["ws", "wss"],
  });
}
