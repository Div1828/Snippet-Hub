import { useState } from "react";
import { Box, Button, Input, Heading, VStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../logic/authContext";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }
    try {
      await login( username, password);
      navigate("/homepage");
    } catch (err: any) {
      setError(err);
    }
  };

  return (
    <Box background="black" maxW="md" mx="auto" mt={10} p={6} boxShadow="md" borderRadius="md">
      <Heading mb={6}>Log In</Heading>
      <VStack gap={4}>
        <Input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        {error && (
          <Text color="red.400" fontSize="sm" fontWeight="semibold">
            {error}
          </Text>
        )}
        <Button colorScheme="teal" onClick={handleLogin}>
          Login
        </Button>
        <Text>Don't have an account?</Text>
        <Button colorScheme="blue" onClick={() => navigate("/signup")}>
          Signup
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
