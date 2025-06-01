import { Heading } from "@chakra-ui/react";
import { useSnippets } from "../logic/snippetLogic";
import SnippetList from "../components/SnippetList";

const Homepage: React.FC = () => {
  const { snippets } = useSnippets();

  return (
    <>
      <Heading mb={6} color="gray.100" size="2xl" textAlign="center">
        Your Snippets
      </Heading>

      {snippets.length === 0 ? (
        <Heading size="md" color="gray.300" textAlign="center">
          No snippets added yet.
        </Heading>
      ) : (
        <SnippetList snippets={snippets} />
      )}
    </>
  );
};

export default Homepage;
