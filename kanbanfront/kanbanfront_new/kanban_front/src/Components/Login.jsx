import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Input, Button, Text, Heading, VStack } from "@chakra-ui/react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = ({ setAuthToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/kanban/api/token/`,
        { username, password }
      );

      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      setAuthToken(access);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
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
        Login
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            focusBorderColor="blue.500"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            focusBorderColor="blue.500"
          />
          <Button type="submit" colorScheme="blue" w="full">
            Login
          </Button>
        </VStack>
      </form>

      {error && (
        <Text color="red.500" textAlign="center" mt="2">
          {error}
        </Text>
      )}

      <Text mt="4" textAlign="center">
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#3182CE", fontWeight: "bold" }}>
          Register Here
        </Link>
      </Text>
    </Box>
  );
};

export default Login;
