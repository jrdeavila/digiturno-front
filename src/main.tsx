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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <Provider>
        <ServiceProvider>
          <AttentionProfileProvider>
            <ClientTypeProvider>
              <ClientProvider>
                <App />
              </ClientProvider>
            </ClientTypeProvider>
          </AttentionProfileProvider>
        </ServiceProvider>
      </Provider>
    </BrowserRouter>
    <NotificationContainer />
  </>
);
