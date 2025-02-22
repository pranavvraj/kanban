import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Input, Button, Text, Heading, VStack } from "@chakra-ui/react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = ({ setAuthToken }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/kanban/api/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("User registered successfully!");

      if (data.token) {
        localStorage.setItem("access_token", data.token);
        setAuthToken(data.token);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } else {
      alert(data.error || "Registration failed");
    }
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt="10"
      p="6"
      boxShadow="md"
      borderRadius="lg"
      bg="white"
    >
      <Heading size="lg" textAlign="center" mb="4">
        Register
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            focusBorderColor="blue.500"
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            focusBorderColor="blue.500"
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            focusBorderColor="blue.500"
          />
          <Button type="submit" colorScheme="blue" w="full">
            Register
          </Button>
        </VStack>
      </form>

      <Text mt="4" textAlign="center">
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#3182CE", fontWeight: "bold" }}>
          Login
        </Link>
      </Text>
    </Box>
  );
};

export default Register;
