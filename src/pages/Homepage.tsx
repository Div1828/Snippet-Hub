import { useState } from "react";
import {
  Heading,
  Text,
  Input,
  Box,
  Flex,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { useSnippets } from "../logic/snippetLogic";
import { LuSearch } from "react-icons/lu";
import SnippetList from "../components/SnippetList";
import { useAuth } from "../logic/authContext";

const Homepage: React.FC = () => {
  const { snippets } = useSnippets();
  const { user, logout } = useAuth();

  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  const filteredSnippets = snippets
    .filter((snippet) =>
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((snippet) => (user ? true : snippet.isPublic));

  // Toggle handler for view mode
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "card" ? "list" : "card"));
  };

  return (
    <>
      <Heading size="2xl" color="yellow.400">
        👋 Welcome to SnippetHub
      </Heading>
      <Text fontSize="lg" color="gray.300" maxW="600px">
        Store, search, and organize your code snippets easily.
      </Text>

      <Box position="absolute" top="4" right="4" zIndex="10">
        <Flex
          align="center"
          bg="gray.800"
          borderRadius="xl"
          px={3}
          py={2}
          boxShadow="0 0 8px rgba(14, 13, 13, 0.3)"
          maxW="350px"
        >
          <Input
            type="text"
            placeholder="Search your snippets..."
            border="none"
            bg="transparent"
            color="white"
            _placeholder={{ color: "gray.500" }}
            px={3}
            py={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            flex="1"
            _focus={{ outline: "none" }}
          />
          <IconButton
            onClick={() => setSearchQuery(inputValue)}
            aria-label="Search"
            variant="ghost"
            color="gray.400"
            _hover={{ color: "white" }}
          >
            <LuSearch />
          </IconButton>
        </Flex>
      </Box>

      <Heading mb={6} color="White" size="3xl" textAlign="center">
        Your Snippets
      </Heading>

    
      <Box mb={4} textAlign="center">
        <Button onClick={toggleViewMode} colorScheme="blue">
          Switch to {viewMode === "card" ? "List" : "Card"} View
        </Button>
      </Box>

      {filteredSnippets.length === 0 ? (
        <Heading size="md" color="gray.300" textAlign="center">
          No snippets found.
        </Heading>
      ) : (
        <SnippetList snippets={filteredSnippets} viewMode={viewMode} />
      )}

      <Box position="fixed" bottom="4" right="4" zIndex="20">
        <Button
          background="gray.800"
          color="white"
          colorScheme="red"
          onClick={logout}
        >
          Logout {user ? `(${user})` : ""}
        </Button>
      </Box>
    </>
  );
};

export default Homepage;
