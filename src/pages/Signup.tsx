import { useState } from "react";
import { Text, Box, Button, Input, Heading, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../logic/auth";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError(null); 
    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }
    try {
      await registerUser({ username, password });
      navigate("/login");
    } catch (err: any) {
      setError(err);
    }
  };

  return (
    <Box background="black" maxW="md" mx="auto" mt={10} p={6} boxShadow="md" borderRadius="md">
      <Heading mb={6}>Sign Up</Heading>
      <VStack gap={4}>
        <Input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        {error && (
          <Text color="red.400" fontSize="sm" fontWeight="semibold">
            {error}
          </Text>
        )}
        <Button colorScheme="teal" onClick={handleSignup}>
          Register
        </Button>
        <Text>Already have an account?</Text>
        <Button colorScheme="blue" onClick={() => navigate("/login")}>
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Signup;
