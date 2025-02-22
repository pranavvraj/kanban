import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";
import Navbar from "./Components/Navbar";

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("access_token"));

  // Sync token with localStorage updates
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("access_token", authToken);
    } else {
      localStorage.removeItem("access_token");
    }
  }, [authToken]);

  return (
    <BrowserRouter>
      {authToken && <Navbar setAuthToken={setAuthToken} />}
      <Routes>
        <Route path="/login" element={!authToken ? <Login setAuthToken={setAuthToken} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!authToken ? <Register setAuthToken={setAuthToken} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={authToken ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={authToken ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
