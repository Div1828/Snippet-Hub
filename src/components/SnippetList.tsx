import { SimpleGrid } from "@chakra-ui/react";
import SnippetCard from "./SnippetCard";
import type { Snippet } from "../logic/snippetLogic";

interface Props {
  snippets: Snippet[];
}

const SnippetList = ({ snippets }: Props) => {
  return (
    <SimpleGrid columns={[1, 2, 3]} gap={6}>
      {snippets.map(snippet => (
        <SnippetCard key={snippet._id} snippet={snippet} />
      ))}
    </SimpleGrid>
  );
};

export default SnippetList;
