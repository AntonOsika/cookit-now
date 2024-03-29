import React, { useState } from "react";
import { Box, Heading, Input, Button, Text, Image, Stack, SimpleGrid, Link } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);

  const handleSearch = async () => {
    const response = await fetch(`https://api.edamam.com/search?q=${searchTerm}&app_id=YOUR_APP_ID&app_key=YOUR_APP_KEY`);
    const data = await response.json();
    setRecipes(data.hits);
  };

  return (
    <Box p={8}>
      <Heading as="h1" size="2xl" mb={8} textAlign="center">
        Recipe Finder
      </Heading>
      <Stack direction="row" spacing={4} mb={8} justify="center">
        <Input placeholder="Enter ingredients (e.g., chicken, broccoli)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Button leftIcon={<FaSearch />} colorScheme="blue" onClick={handleSearch}>
          Search
        </Button>
      </Stack>
      <SimpleGrid columns={[1, 2, 3]} spacing={8}>
        {recipes.map((recipe) => (
          <Box key={recipe.recipe.uri} borderWidth={1} borderRadius="lg" p={4}>
            <Image src={recipe.recipe.image} alt={recipe.recipe.label} borderRadius="lg" mb={4} />
            <Heading as="h2" size="md" mb={2}>
              {recipe.recipe.label}
            </Heading>
            <Text mb={4}>{`${recipe.recipe.calories.toFixed(0)} calories`}</Text>
            <Link href={recipe.recipe.url} isExternal>
              <Button colorScheme="blue">View Recipe</Button>
            </Link>
          </Box>
        ))}
      </SimpleGrid>
      {recipes.length === 0 && searchTerm && (
        <Text textAlign="center" mt={8}>
          No recipes found for "{searchTerm}". Please try a different search term.
        </Text>
      )}
    </Box>
  );
};

export default Index;
