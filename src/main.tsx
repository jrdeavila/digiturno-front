import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@/styles/globals.css";
import App from "./App.tsx";
import NotificationContainer from "./components/notification-container.tsx";
import { Provider } from "./provider.tsx";
import AttentionProfileProvider from "./providers/attention-profile-provider.tsx";
import ClientProvider from "./providers/client-provider.tsx";
import ClientTypeProvider from "./providers/client-type-provider.tsx";
import ServiceProvider from "./providers/service-provider.tsx";
import { SectionalProvider } from "./hooks/use-sectional.tsx";
import { LoadingProvider } from "./hooks/use-loading.tsx";
import { ShiftProvider } from "./hooks/operator/use-shifts.tsx";
import "./pusher.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <LoadingProvider>
    <SectionalProvider>
      <BrowserRouter>
        <Provider>
          <ServiceProvider>
            <AttentionProfileProvider>
              <ClientTypeProvider>
                <ClientProvider>
                  <ShiftProvider>
                    <App />
                  </ShiftProvider>
                </ClientProvider>
              </ClientTypeProvider>
            </AttentionProfileProvider>
          </ServiceProvider>
        </Provider>
      </BrowserRouter>
      <NotificationContainer />
    </SectionalProvider>
  </LoadingProvider>
);
