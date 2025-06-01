import { Box, Heading, Button, VStack, Text } from "@chakra-ui/react";
import { useSnippets } from "../logic/snippetLogic";
import { useState } from "react";
import SnippetCard from "../components/SnippetCard";

const Categories = () => {
  const { snippets } = useSnippets();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

const categories = Array.from(
  new Set(
    snippets
      .map((s) => s.category)
      .filter((cat): cat is string => typeof cat === "string" && cat.length > 0)
  )
);

  const filtered = selectedCategory
    ? snippets.filter((s) => s.category === selectedCategory)
    : [];

  return (
    <Box maxW="3xl" mx="auto" mt={8}>
      <Heading mb={4}>Categories</Heading>
      <VStack align="start" gap={3} mb={6}>
        {categories.length === 0 && <Text>No categories found.</Text>}
        {categories.map((cat) => (
          <Button key={cat} onClick={() => setSelectedCategory(cat)} colorScheme={selectedCategory === cat ? "blue" : "gray"} size="sm">
            {cat}
          </Button>
        ))}
        {selectedCategory && (
          <Button onClick={() => setSelectedCategory(null)} size="sm">
            Clear Filter
          </Button>
        )}
      </VStack>

      {selectedCategory && (
        <>
          <Heading size="md" mb={4}>
            Snippets in "{selectedCategory}"
          </Heading>
          <VStack gap={4} align="stretch">
            {filtered.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </VStack>
        </>
      )}
    </Box>
  );
};

export default Categories;
