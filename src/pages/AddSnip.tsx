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
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const AddSnip: React.FC = () => {
  const { addSnippet } = useSnippets();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const navigate = useNavigate();

  const finalCategory = category === "Custom" ? customCategory : category;

  const handleSubmit = () => {
    if (!title || !content) return;

    const newSnippet = {id: uuidv4(), title, content, category: finalCategory};

    addSnippet(newSnippet);
    setTitle("");
    setContent("");
    setCategory("");
    setCustomCategory("");
    navigate("/");
  };

  return (
    <Box maxW="xl" mx="auto" mt={8}>
      <Heading mb={4}>Add a New Snippet</Heading>
      <VStack gap={4} align="stretch">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
        <Textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)}/>
        <Select placeholder="Select Category" value={category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}>
          <option value="Code">Code</option>
          <option value="Link">Link</option>
          <option value="Note">Note</option>
          <option value="Custom">Custom</option>
        </Select>

        {category === "Custom" && (
          <Input placeholder="Enter custom category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)}/>
        )}

        <Button onClick={handleSubmit} colorScheme="blue" w="full">
          Save Snippet
        </Button>
      </VStack>
    </Box>
  );
};

export default AddSnip;
