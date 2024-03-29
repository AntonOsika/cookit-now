import React, { useState } from "react";
import { Box, Heading, Input, Button, Text, Image, Stack, SimpleGrid, Link } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const APP_ID = import.meta.env.VITE_APP_ID;
const APP_KEY = import.meta.env.VITE_APP_KEY;

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSearch = async () => {
    const response = await fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${searchTerm}`);
    const data = await response.json();
    setRecipes(
      data.hints.map((hint) => ({
        foodId: hint.food.foodId,
        measureURI: hint.measures[0].uri,
        label: hint.food.label,
        image: hint.food.image,
      })),
    );
  };

  const getRecipeDetails = async (recipe) => {
    const response = await fetch(`https://api.edamam.com/api/food-database/v2/nutrients?app_id=${APP_ID}&app_key=${APP_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ingredients: [
          {
            quantity: 1,
            measureURI: recipe.measureURI,
            foodId: recipe.foodId,
          },
        ],
      }),
    });

    const details = await response.json();
    setSelectedRecipe(details);
  };

  return (
    <Box p={8}>
      <Heading as="h1" size="2xl" mb={8} textAlign="center">
        Recipe Finder
      </Heading>
      <Stack direction="row" spacing={4} mb={8} justify="center">
        <Input placeholder="Enter ingredients (e.g., chicken, broccoli, carrots)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Button leftIcon={<FaSearch />} colorScheme="blue" onClick={handleSearch}>
          Search
        </Button>
      </Stack>
      {selectedRecipe ? (
        <Box>
          <Heading as="h2" size="xl" mb={4}>
            {selectedRecipe.ingredients[0].parsed[0].food}
          </Heading>
          <Text>
            <b>Calories:</b> {selectedRecipe.calories.toFixed(0)}
          </Text>
          <Text>
            <b>Carbs:</b> {selectedRecipe.totalNutrients.CHOCDF.quantity.toFixed(0)}
            {selectedRecipe.totalNutrients.CHOCDF.unit}
          </Text>
          <Text>
            <b>Fat:</b> {selectedRecipe.totalNutrients.FAT.quantity.toFixed(0)}
            {selectedRecipe.totalNutrients.FAT.unit}
          </Text>
          <Text>
            <b>Protein:</b> {selectedRecipe.totalNutrients.PROCNT.quantity.toFixed(0)}
            {selectedRecipe.totalNutrients.PROCNT.unit}
          </Text>
          <Link href={selectedRecipe.ingredients[0].parsed[0].measure.uri} isExternal mt={4}>
            <Button colorScheme="blue">View Full Recipe</Button>
          </Link>
        </Box>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={8}>
          {recipes.map((recipe) => (
            <Box key={recipe.foodId} borderWidth={1} borderRadius="lg" p={4}>
              <Image src={recipe.image} alt={recipe.label} borderRadius="lg" mb={4} />
              <Heading as="h2" size="md" mb={2}>
                {recipe.label}
              </Heading>
              <Button colorScheme="blue" onClick={() => getRecipeDetails(recipe)}>
                View Details
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      )}
      {recipes.length === 0 && searchTerm && (
        <Text textAlign="center" mt={8}>
          No recipes found for "{searchTerm}". Please try a different search term.
        </Text>
      )}
    </Box>
  );
};

export default Index;
