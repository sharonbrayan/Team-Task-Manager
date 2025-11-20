// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";           // your top-level component
import "./index.css";                 // your app-level css (you'll create)
import "bootstrap/dist/css/bootstrap.min.css";    // bootstrap css
import "bootstrap-icons/font/bootstrap-icons.css"; // bootstrap icons
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // bootstrap JS (includes Popper) - needed for modals, dropdowns

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
