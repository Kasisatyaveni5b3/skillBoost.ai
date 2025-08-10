import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CollectionProvider } from "./context/CollectionContext"; // ✅ import your context provider
import "./index.css";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CollectionProvider> {/* ✅ Wrap your app here */}
          <App />
        </CollectionProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
