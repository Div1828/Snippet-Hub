import type { ReactNode } from "react";
import { Box, Flex, VStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex height="100vh">
      <VStack
        width="220px"
        bg="gray.800"
        color="white"
        align="flex-start"
        p={4}
      >
        <Text fontSize="3xl" fontWeight="bold" color="green.400" >SnippetHub</Text>
        <Box>
          <Link to="/">🏠 Home</Link>
        </Box>
        
        <Box>
          <Link to="/categories">📁 Categories</Link>
        </Box>

        <Box>
          <Link to="/addsnip">➕ Add Snippet</Link>
        </Box>
      </VStack>


      <Box flex="1" p={6} bg="green.500" overflowY="auto">
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
