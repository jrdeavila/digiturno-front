import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@/styles/globals.css";
import App from "./App.tsx";
import NotificationContainer from "./components/notification-container.tsx";
import { ShiftProvider } from "./hooks/operator/use-shifts.tsx";
import { AuthenticatedProvider } from "./hooks/use-auth.tsx";
import { MyModuleProvider } from "./hooks/use-my-module.tsx";
import { SectionalProvider } from "./hooks/use-sectional.tsx";
import { Provider } from "./provider.tsx";
import AttendantProvider from "./providers/attendant-provider.tsx";
import AttentionProfileProvider from "./providers/attention-profile-provider.tsx";
import ClientProvider from "./providers/client-provider.tsx";
import ClientTypeProvider from "./providers/client-type-provider.tsx";
import ServiceProvider from "./providers/service-provider.tsx";
import "./pusher.js";

const RootApp = () => {
  return (
    <SectionalProvider>
      <BrowserRouter>
        <Provider>
          <ServiceProvider>
            <ClientTypeProvider>
              <ClientProvider>
                <MyModuleProvider>
                  <AttentionProfileProvider>
                    <ShiftProvider>
                      <AttendantProvider>
                        <AuthenticatedProvider>
                          <App />
                        </AuthenticatedProvider>
                      </AttendantProvider>
                    </ShiftProvider>
                  </AttentionProfileProvider>
                </MyModuleProvider>
              </ClientProvider>
            </ClientTypeProvider>
          </ServiceProvider>
        </Provider>
      </BrowserRouter>
      <NotificationContainer />
    </SectionalProvider>
  );
};
ReactDOM.createRoot(document.getElementById("root")!).render(<RootApp />);
