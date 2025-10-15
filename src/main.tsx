import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// If your Homepage file is .jsx, keep the .jsx extension here.
// If it's .tsx, drop the extension.
import Homepage from "./Homepage.jsx";
import InputPg from "./Input-PG";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/input" element={<InputPg />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
