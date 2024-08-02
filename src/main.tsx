import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@/styles/globals.css";
import App from "./App.tsx";
import NotificationContainer from "./components/notification-container.tsx";
import { ShiftProvider } from "./hooks/operator/use-shifts.tsx";
import { LoadingProvider } from "./hooks/use-loading.tsx";
import { SectionalProvider } from "./hooks/use-sectional.tsx";
import { Provider } from "./provider.tsx";
import AttentionProfileProvider from "./providers/attention-profile-provider.tsx";
import ClientProvider from "./providers/client-provider.tsx";
import ClientTypeProvider from "./providers/client-type-provider.tsx";
import ServiceProvider from "./providers/service-provider.tsx";
import "./pusher.js";
import { MyModuleProvider } from "./hooks/use-my-module.tsx";
import { AuthenticatedProvider } from "./hooks/use-auth.tsx";
import { useEffect } from "react";
import useEcho from "./hooks/operator/use-echo.ts";



const RootApp = () => {
  const echo = useEcho();
  useEffect(() => {
    echo.connect();

    return () => {
      echo.disconnect();
    };
  }, [])
  return (
    <LoadingProvider>
      <SectionalProvider>
        <BrowserRouter>
          <Provider>
            <ServiceProvider>
              <AttentionProfileProvider>
                <ClientTypeProvider>
                  <ClientProvider>
                    <MyModuleProvider>
                      <ShiftProvider>
                        <AuthenticatedProvider>
                          <App />
                        </AuthenticatedProvider>
                      </ShiftProvider>
                    </MyModuleProvider>
                  </ClientProvider>
                </ClientTypeProvider>
              </AttentionProfileProvider>
            </ServiceProvider>
          </Provider>
        </BrowserRouter>
        <NotificationContainer />
      </SectionalProvider>
    </LoadingProvider>

  )
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <RootApp />
);