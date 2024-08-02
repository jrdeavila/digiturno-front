import Echo from "laravel-echo";

declare global {
  interface Window {
    Echo: Echo;
  }
}

class SingletonEcho {
  private static instance: Echo;
  private constructor() { }

  public static getInstance(): Echo {
    if (!SingletonEcho.instance) {
      SingletonEcho.instance = window.Echo;
      console.log("Echo instance created");
    }

    return SingletonEcho.instance;
  }

}

export default function useEcho(): Echo {
  return SingletonEcho.getInstance();
}
