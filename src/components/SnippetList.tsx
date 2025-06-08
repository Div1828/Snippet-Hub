import { SimpleGrid, VStack } from "@chakra-ui/react";
import SnippetCard from "./SnippetCard";
import type { Snippet } from "../logic/snippetLogic";

interface Props {
  snippets: Snippet[];
  viewMode: "card" | "list";
}

const SnippetList = ({ snippets, viewMode }: Props) => {
  if (viewMode === "list") {
    
    return (
      <VStack gap={4} align="stretch" w="100%">
        {snippets.map((snippet) => (
          <SnippetCard key={snippet._id} snippet={snippet} viewMode="list" />
        ))}
      </VStack>
    );
  }

  
  return (
    <SimpleGrid columns={[1, 2, 3]} gap={6}>
      {snippets.map((snippet) => (
        <SnippetCard key={snippet._id} snippet={snippet} viewMode="card" />
      ))}
    </SimpleGrid>
  );
};

export default SnippetList;
