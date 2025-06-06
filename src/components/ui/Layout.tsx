import type { ReactNode } from "react";
import { Box, Flex, VStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar"; 

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex height="100vh">
      <Flex direction="column" width="220px" bg="gray.800" color="white" p={4} justify="space-between">
        <VStack align="flex-start" gap={4}>
          <Text fontSize="3xl" fontWeight="bold" color="green.500" transition="all 0.3s" _hover={{color: "green.400", textShadow: "0 0 8px rgba(0, 128, 0, 0.3)",}}>
            SnippetHub
          </Text>
          <Box>
            <Text  display="inline-block" transition="transform 0.1s" _active={{ transform: "scale(0.95)" }}>
              <Link to="/homepage">🏠 Home</Link>
            </Text>
          </Box>
          <Box>
            <Text  display="inline-block" transition="transform 0.1s" _active={{ transform: "scale(0.95)" }}>
              <Link to="/categories">📁 Categories</Link>
            </Text>
          </Box>
          <Box>
            <Text  display="inline-block" transition="transform 0.1s" _active={{ transform: "scale(0.95)" }}>
              <Link to="/AddSnip">➕ Add Snippet</Link>
            </Text>
          </Box>
        </VStack>
        <Sidebar />
      </Flex>

      <Box flex="1" p={6} bg="gray.700" overflowY="auto">
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
