import Echo from "laravel-echo";

export default function useEcho(): Echo {
  return new Echo({
    broadcaster: "reverb",
    key: "jr010ypjfa02d1plefjc",
    wsHost: "localhost",
    wsPort: 8080,
    wssPort: 8080,
    forceTLS: false,
    enabledTransports: ["ws", "wss"],
  });
}
