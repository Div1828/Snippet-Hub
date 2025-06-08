// view.tsx

import { useParams } from "react-router-dom";
import {
  Heading,
  Box,
  Text,
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useSnippets } from "../logic/snippetLogic";
import { useState, useEffect } from "react";
import type { JSX } from "react";
import socket from "../socket";
import { useAuth } from "../logic/authContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const View = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { snippets, editSnippet } = useSnippets();
  const username: string = useAuth().user ?? "";

  const snippet = snippets.find((s) => s._id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [collaboratorsInput, setCollaboratorsInput] = useState("");
  const [error, setError] = useState("");
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  const canEdit =
    snippet &&
    (username === snippet.ownerUsername ||
      snippet.collaborators?.includes(username));

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setContent(snippet.content);
      setCategory(snippet.category || "");
      setCollaboratorsInput(snippet.collaborators?.join(", ") || "");
    }
  }, [snippet]);

  useEffect(() => {
    if (!id || !username) return;

    socket.emit("joinSnippet", id, username);

    socket.on("snippetUpdated", (newContent: string) => {
      if (!isEditing) {
        setContent(newContent);
      }
    });

    socket.on("presenceUpdate", (users: string[]) => {
      setActiveUsers(users.filter((user) => user !== username));
    });

    return () => {
      socket.emit("leaveSnippet", id, username);
      socket.off("snippetUpdated");
      socket.off("presenceUpdate");
    };
  }, [id, username, isEditing]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    socket.emit("editSnippet", { snippetId: id, content: e.target.value });
  };

  const validateCollaborators = async (usernames: string[]) => {
    if (usernames.length === 0) return true;

    try {
      const validations = usernames.map(async (username) => {
        const res = await fetch(
          `${API_BASE}/users/exists?username=${encodeURIComponent(username)}`
        );
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

  const handleSave = async () => {
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

    setError("");
    editSnippet({ ...snippet!, title, content, category, collaborators });
    setIsEditing(false);
  };

  if (!snippet) {
    return <Text color="red.500">Snippet not found.</Text>;
  }

  return (
    <Box
      whiteSpace="pre-wrap"
      w="700px"
      minH="700px"
      mx="auto"
      bg="gray.900"
      p={6}
      borderRadius="lg"
      boxShadow="md"
      position="relative"
    >
      <HStack justifyContent="space-between" mb={4}>
        <Heading color="white">
          {isEditing ? "Edit Snippet" : snippet.title}
        </Heading>
        {canEdit && (
          <Button
            size="sm"
            colorScheme={isEditing ? "gray" : "yellow"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        )}
      </HStack>

      {activeUsers.length > 0 && (
        <Wrap mb={4}>
          {activeUsers.map((u) => (
            <WrapItem key={u}>
              <Box
                px={3}
                py={1}
                bg="green.600"
                color="white"
                borderRadius="full"
                fontSize="sm"
              >
                {u} editing...
              </Box>
            </WrapItem>
          ))}
        </Wrap>
      )}

      {isEditing ? (
        <VStack align="stretch" gap={4}>
          {error && <Text color="red.400">{error}</Text>}

          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            placeholder="Content"
            value={content}
            onChange={handleContentChange}
            rows={8}
          />

          <Input
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Input
            placeholder="Collaborators (comma-separated usernames)"
            value={collaboratorsInput}
            onChange={(e) => setCollaboratorsInput(e.target.value)}
          />

          <Button colorScheme="blue" onClick={handleSave}>
            Save Changes
          </Button>
        </VStack>
      ) : (
        <>
          <Text mt={4} fontSize="lg">
            {content}
          </Text>
          {snippet.category && (
            <Text mt={2} fontStyle="italic" color="gray.400">
              Category: {snippet.category}
            </Text>
          )}
          {snippet.ownerUsername && (
            <Text mt={2} fontStyle="italic" color="gray.400">
              Owner: {snippet.ownerUsername}
            </Text>
          )}
          {snippet.collaborators && snippet.collaborators.length > 0 && (
            <Text mt={2} fontStyle="italic" color="gray.400">
              Collaborators: {snippet.collaborators.join(", ")}
            </Text>
          )}
        </>
      )}
    </Box>
  );
};

export default View;
