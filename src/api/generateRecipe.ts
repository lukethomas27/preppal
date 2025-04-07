import { OpenAI } from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key. Please add it to your .env file.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RecipeRequest {
  mood: string;
  dietaryPreferences: string;
  ingredients: string;
  cookingTime: string;
  difficulty: string;
}

export async function generateRecipe(request: RecipeRequest) {
  const prompt = `Generate a recipe based on the following criteria:
Mood: ${request.mood}
Dietary Preferences: ${request.dietaryPreferences || 'none specified'}
Available Ingredients: ${request.ingredients || 'none specified'}
Cooking Time: ${request.cookingTime} minutes
Difficulty Level: ${request.difficulty}

Please provide a recipe in the following JSON format:
{
  "title": "Recipe title",
  "description": "Brief description of the recipe",
  "ingredients": ["list", "of", "ingredients"],
  "instructions": ["step", "by", "step", "instructions"],
  "prepTime": "preparation time",
  "cookTime": "cooking time",
  "servings": "number of servings",
  "difficulty": "difficulty level",
  "tags": ["relevant", "tags"]
}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional chef and recipe creator. Create detailed, accurate, and delicious recipes based on user preferences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    const recipe = JSON.parse(completion.choices[0].message.content || '{}');
    return recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw new Error('Failed to generate recipe');
  }
} 