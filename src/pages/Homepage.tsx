import { Heading, Text } from "@chakra-ui/react";
import type { JSX } from "react";

const Homepage = () : JSX.Element => {
  return (
    <>
    <Heading color="gray.150" size="6xl" textAlign="center" >SNIPPETHUB</Heading>
    <Text color="gray.150" fontSize="2xl" p={10}> Welcome to SnippetHub, a place where you can save important things. </Text>
    </>
  )
}

export default Homepage;