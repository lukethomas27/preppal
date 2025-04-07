import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import OpenAI from "https://esm.sh/openai@4.0.0";

// Get the origin from the request headers
const getCorsHeaders = (origin: string) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
});

// List of allowed origins
const allowedOrigins = [
  'https://www.mealpreppal.ca',
  'http://localhost:3000',
  'https://localhost:3000'
];

// Function to parse recipe text into structured format
const parseRecipe = (text: string) => {
  const lines = text.split('\n');
  const recipe: any = {
    title: '',
    ingredients: [],
    instructions: [],
    prepTime: 'Not specified',
    cookTime: 'Not specified',
    servings: 'Not specified',
    difficulty: 'Not specified',
    notes: []
  };

  let currentSection = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    if (trimmedLine.toLowerCase().includes('recipe name:')) {
      recipe.title = trimmedLine.split(':')[1].trim();
    } else if (trimmedLine.toLowerCase().includes('ingredients:')) {
      currentSection = 'ingredients';
    } else if (trimmedLine.toLowerCase().includes('instructions:')) {
      currentSection = 'instructions';
    } else if (trimmedLine.toLowerCase().includes('estimated cooking time:')) {
      recipe.cookTime = trimmedLine.split(':')[1].trim();
    } else if (trimmedLine.toLowerCase().includes('difficulty level:')) {
      recipe.difficulty = trimmedLine.split(':')[1].trim();
    } else if (trimmedLine.toLowerCase().includes('special notes:')) {
      currentSection = 'notes';
    } else if (currentSection === 'ingredients' && trimmedLine.startsWith('-')) {
      recipe.ingredients.push(trimmedLine.substring(1).trim());
    } else if (currentSection === 'instructions' && trimmedLine.match(/^[a-z]\./)) {
      recipe.instructions.push(trimmedLine.substring(2).trim());
    } else if (currentSection === 'notes' && trimmedLine.startsWith('-')) {
      recipe.notes.push(trimmedLine.substring(1).trim());
    }
  }

  return recipe;
};

serve(async (req) => {
  // Get the origin from the request
  const origin = req.headers.get('origin') || '';
  
  // Check if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin);
  
  // Use the origin if it's allowed, otherwise use the first allowed origin
  const corsHeaders = getCorsHeaders(isAllowedOrigin ? origin : allowedOrigins[0]);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { mood, dietaryPreferences, ingredients, cookingTime, difficultyLevel } = await req.json();

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Create the prompt for recipe generation
    const prompt = `Generate a recipe based on the following preferences:
    - Mood: ${mood || 'Not specified'}
    - Dietary Preferences: ${dietaryPreferences || 'None specified'}
    - Available Ingredients: ${ingredients || 'Not specified'}
    - Cooking Time: ${cookingTime || 'Not specified'} minutes
    - Difficulty Level: ${difficultyLevel || 'Not specified'}

    Please provide a detailed recipe in the following format:

    Recipe Name: [Recipe Name]

    Ingredients:
    - [Ingredient 1]
    - [Ingredient 2]
    ...

    Instructions:
    a. [Step 1]
    b. [Step 2]
    ...

    Estimated Cooking Time: [Time]

    Difficulty Level: [Level]

    Special Notes:
    - [Note 1]
    - [Note 2]
    ...`;

    // Generate recipe using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional chef and recipe generator. Create detailed, easy-to-follow recipes. Always format the recipe exactly as specified in the prompt."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const recipeText = completion.choices[0].message?.content;

    if (!recipeText) {
      throw new Error('Failed to generate recipe');
    }

    // Parse the recipe text into a structured format
    const recipe = parseRecipe(recipeText);

    return new Response(JSON.stringify({ recipe }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error:', error);
    
    // Handle OpenAI quota errors specifically
    if (error.response?.status === 429) {
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI quota exceeded. Please try again later or contact support.' 
        }), 
        { 
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while generating the recipe' 
      }), 
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}); 