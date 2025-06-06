import { useParams } from "react-router-dom";
import {Heading, Box, Text, Button, Input, Textarea, VStack, HStack} from "@chakra-ui/react";
import { useSnippets } from "../logic/snippetLogic";
import { useState, useEffect } from "react";
import type { JSX } from "react";

const View = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { snippets, editSnippet } = useSnippets();

  const snippet = snippets.find(s => s._id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setContent(snippet.content);
      setCategory(snippet.category || "");
    }
  }, [snippet]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setError("");
    editSnippet({...snippet!, title, content, category});

    setIsEditing(false);
  };

  if (!snippet) {
    return <Text color="red.500">Snippet not found.</Text>;
  }

  return (
    <Box whiteSpace="pre-wrap" w="700px" minH="700px" mx="auto" bg="gray.900" p={6} borderRadius="lg" boxShadow="md" position="relative">
      <HStack justifyContent="space-between" mb={4}>
        <Heading color="white">
          {isEditing ? "Edit Snippet" : snippet.title}
        </Heading>
        <Button size="sm" colorScheme={isEditing ? "gray" : "yellow"} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </HStack>

      {isEditing ? (
        <VStack align="stretch" gap={4}>
          {error && <Text color="red.400">{error}</Text>}
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)}/>
          <Textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} rows={8}/>
          <Input placeholder="Category (optional)" value={category} onChange={e => setCategory(e.target.value)}/>
          <Button colorScheme="blue" onClick={handleSave}>
            Save Changes
          </Button>
        </VStack>
      ) : (
        <>
          <Text mt={4} fontSize="lg">{snippet.content}</Text>
          {snippet.category && (
            <Text mt={2} fontStyle="italic" color="gray.500">
              Category: {snippet.category}
            </Text>
          )}
        </>
      )}
    </Box>
  );
};

export default View;


