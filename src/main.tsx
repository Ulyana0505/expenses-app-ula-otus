import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import FallbackPage from "./pages/FallbackPage";
import { AuthProvider } from "./auth";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} fallbackElement={<FallbackPage />} />
    </AuthProvider>
  </React.StrictMode>
);
