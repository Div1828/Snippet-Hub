import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  VStack,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/select";
import { useSnippets } from "../logic/snippetLogic";
import { useNavigate } from "react-router-dom";

const AddSnip: React.FC = () => {
  const { addSnippet } = useSnippets();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const navigate = useNavigate();

  const finalCategory = category === "Custom" ? customCategory : category;

  const handleSubmit = async () => {
    if (!title || !content) return;

    const newSnippet = {
      title,
      content,
      category: finalCategory,
    };

    await addSnippet(newSnippet); 
    setTitle("");
    setContent("");
    setCategory("");
    setCustomCategory("");
    navigate("/homepage");
  };

  return (
    <Box background="black" maxW="md" mx="auto" mt={10} p={6} boxShadow="md" borderRadius="md">
      <Heading mb={4}>Add a New Snippet</Heading>
      <VStack gap={4} align="stretch">
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
        <Select
          placeholder="Select Category"
          value={category}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setCategory(e.target.value)
          }
        >
          <option value="Code">Code</option>
          <option value="Link">Link</option>
          <option value="Note">Note</option>
          <option value="Custom">Custom</option>
        </Select>

        {category === "Custom" && (
          <Input
            placeholder="Enter custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        )}

        <Button onClick={handleSubmit} colorScheme="blue" w="full">
          Save Snippet
        </Button>
      </VStack>
    </Box>
  );
};

export default AddSnip;
