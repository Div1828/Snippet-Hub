import { Box, Heading, VStack, Text } from "@chakra-ui/react";
import { useSnippets } from "../../logic/snippetLogic";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { snippets } = useSnippets();
  const pinnedSnippets = Array.isArray(snippets) ? snippets.filter(snippet => snippet.pinned) : [];

  return (
  <Box w="200px" bg="gray.800"  h="100vh">
    <Heading color="yellow.500" size="xl" mb={4} mt={4} transition="all 0.3s" _hover={{color: "yellow.300", textShadow: "0 0 8px rgba(139, 117, 0, 0.4)",}}>📌 Pinned Snippets</Heading>
    <VStack align="start" gap={2}>
      {pinnedSnippets.length === 0 && (
        <Text fontSize="sm" color="gray.500">No pinned snippets</Text>
      )}
      {pinnedSnippets.map(snippet => (
        <Link 
          key={snippet._id} 
          to={`/view/${snippet._id}`} 
          style={{ 
            textDecoration: "none",
            color: "inherit", 
            width: "100%" 
          }}
        >
          <Text 
            fontSize="sm" 
            _hover={{ color: "yellow.500", cursor: "pointer" }}
            truncate
          >
            {snippet.title}
          </Text>
        </Link>
      ))}
    </VStack>
  </Box>
);
};

export default Sidebar;
