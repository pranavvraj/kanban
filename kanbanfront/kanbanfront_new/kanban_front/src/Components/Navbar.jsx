import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";

const Navbar = ({ setAuthToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAuthToken(null); 
    navigate("/login"); 
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#eee" }}>
      <div /> 
      <Button colorScheme="red" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Navbar;
