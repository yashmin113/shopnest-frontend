import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AutheProvider } from "./context/AutheContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const appTree = (
  <Provider store={store}>
    <AutheProvider>
      <ToastProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </ToastProvider>
    </AutheProvider>
  </Provider>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        {appTree}
      </GoogleOAuthProvider>
    ) : (
      appTree
    )}
  </StrictMode>
);
