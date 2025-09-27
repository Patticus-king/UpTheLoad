import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import Homepage from './Homepage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InputPg from "./Input-PG";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/input" element={<InputPg />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);