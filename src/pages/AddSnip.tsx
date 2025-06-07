import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useSnippets } from "../logic/snippetLogic";
import { useNavigate } from "react-router-dom";

const AddSnip: React.FC = () => {
  const { addSnippet } = useSnippets();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [collaboratorsInput, setCollaboratorsInput] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const finalCategory = category === "Custom" ? customCategory : category;

  const validateCollaborators = async (usernames: string[]) => {
    if (usernames.length === 0) return true;

    try {
      
      const validations = usernames.map(async (username) => {
        const res = await fetch(`http://localhost:5000/users/exists?username=${encodeURIComponent(username)}`);
        if (!res.ok) throw new Error(`Error validating username: ${username}`);
        const data = await res.json();
        return { username, exists: data.exists };
      });

      
      const results = await Promise.all(validations);

      
      const invalids = results.filter((r) => !r.exists).map((r) => r.username);

      if (invalids.length > 0) {
        setError(`Invalid collaborator usernames: ${invalids.join(", ")}`);
        return false;
      }

      return true;
    } catch (err) {
      setError("Network error during collaborator validation.");
      return false;
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    const collaborators = collaboratorsInput
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);

    const isValid = await validateCollaborators(collaborators);
    if (!isValid) return;

    const newSnippet = {
      title,
      content,
      category: finalCategory,
      collaborators,
      isPublic,
    };

    await addSnippet(newSnippet);

    
    setTitle("");
    setContent("");
    setCategory("");
    setCustomCategory("");
    setCollaboratorsInput("");
    setIsPublic(false);

    navigate("/homepage");
  };

  return (
    <Box background="black" maxW="md" mx="auto" mt={10} p={6} boxShadow="md" borderRadius="md">
      <Heading mb={4} color="white">Add a New Snippet</Heading>
      <VStack gap={4} align="stretch">
        {error && <Text color="red.400">{error}</Text>}

        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Text color="white">Choose a Category:</Text>
        <HStack gap={2}>
          {["Code", "Link", "Note", "Custom"].map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={category === cat ? "solid" : "outline"}
              colorScheme="teal"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </HStack>

        {category === "Custom" && (
          <Input
            placeholder="Enter custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        )}

        <Input
          placeholder="Add collaborators (comma-separated usernames)"
          value={collaboratorsInput}
          onChange={(e) => setCollaboratorsInput(e.target.value)}
        />

        <Button
          colorScheme={isPublic ? "green" : "gray"}
          onClick={() => setIsPublic(!isPublic)}
        >
          {isPublic ? "Public" : "Private"}
        </Button>

        <Button onClick={handleSubmit} colorScheme="blue" w="full">
          Save Snippet
        </Button>
      </VStack>
    </Box>
  );
};

export default AddSnip;
