import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./pages/login";
import Home from "./pages/home";
import SignUp from "./pages/signUp";
import ProtectedRoute from "./component/ProtectedRoute";

const CLIENT_ID =
  "983594457640-7mql2a1e2579ocicodjkvnra99gkj4qq.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Login />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  </StrictMode>
);
