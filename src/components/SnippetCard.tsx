import { Box, IconButton, Text, VStack, HStack, Button, Badge } from "@chakra-ui/react";
import { useSnippets } from "../logic/snippetLogic";
import { FaThumbtack, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { Snippet } from "../logic/snippetLogic";

interface Props {
  snippet: Snippet;
}

const SnippetCard = ({ snippet }: Props) => {
  const { togglePinSnippet, deleteSnippet, togglePublicSnippet } = useSnippets();

  return (
    <Box
      whiteSpace="pre-wrap"
      w="400px"
      h="400px"
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      position="relative"
      bg="gray.900"
      shadow="md"
      _hover={{
        transform: "scale(1.03)",
        boxShadow: "lg",
      }}
    >
      
      <IconButton
        aria-label="Pin snippet"
        pointerEvents="auto"
        size="sm"
        variant={snippet.pinned ? "solid" : "ghost"}
        bg={snippet.pinned ? "blue.600" : "transparent"}
        color={snippet.pinned ? "white" : "gray.300"}
        position="absolute"
        top={2}
        right={2}
        _hover={{
          background: "blue.600",
          color: "white",
        }}
        onClick={() => togglePinSnippet(snippet._id)}
      >
        <FaThumbtack />
      </IconButton>

      <VStack align="start" gap={1} mb={12}>
        <Text fontWeight="bold">{snippet.title}</Text>

        {snippet.category && (
          <Text fontSize="xs" color="gray.400" fontStyle="italic">
            Category: {snippet.category}
          </Text>
        )}

        {snippet.collaborators && snippet.collaborators.length > 0 && (
          <Text fontStyle="italic" fontSize="xs" color="gray.400">
            Collaborators: {snippet.collaborators.join(", ")}
          </Text>
        )}

        <Text
          fontSize="sm"
          whiteSpace="pre-wrap"
          overflow="hidden"
          textOverflow="ellipsis"
          maxHeight="18em"
        >
          {snippet.content}
        </Text>
      </VStack>

      
      <Box position="absolute" bottom={4} left={4} right={4}>
        <HStack justifyContent="space-between">
          <Link to={`/view/${snippet._id}`}>
            <Button
              size="sm"
              colorScheme="green"
              variant="ghost"
              _hover={{
                background: "green.600",
                color: "white",
              }}
            >
              View
            </Button>
          </Link>

          
          <Badge
            as="button"
            onClick={() => togglePublicSnippet(snippet._id)}
            px={5}
            py={2}
            fontSize="md"
            borderRadius="lg"
            background={snippet.isPublic ? "green.600" : "red"}
            _active={{ 
              transform: "scale(0.85)",  
              opacity: 0.7,               
            }}
            transition="transform 0.3s ease, opacity 0.1s ease"
            _hover={{
              cursor: "pointer",
              opacity: 0.85,
            }}
          >
            {snippet.isPublic ? "Public" : "Private"}
          </Badge>

          <IconButton
            aria-label="Delete snippet"
            pointerEvents="auto"
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => deleteSnippet(snippet._id)}
            _hover={{
              background: "red.600",
              color: "white",
            }}
          >
            <FaTrash />
          </IconButton>
        </HStack>
      </Box>
    </Box>
  );
};

export default SnippetCard;
