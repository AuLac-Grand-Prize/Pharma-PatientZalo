import React from "react";
import ReactDOM from "react-dom/client";
import { App as ZMPApp, ZMPRouter, AnimationRoutes } from "zmp-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { AuthGate } from "./components/AuthGate";
import { FontScaleApplier } from "./store/usePreferences";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

const rootEl = document.getElementById("app");
if (!rootEl) throw new Error("#app element not found");

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <FontScaleApplier />
      <ZMPApp>
        <ZMPRouter>
          <AuthGate>
            <AnimationRoutes>
              <App />
            </AnimationRoutes>
          </AuthGate>
        </ZMPRouter>
      </ZMPApp>
    </QueryClientProvider>
  </React.StrictMode>,
);
