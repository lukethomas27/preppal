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

interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cooking_time: number;
  difficulty: string;
  servings: number;
  source?: string;
  modifications?: string[];
  nutritional_info?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

serve(async (req) => {
  // --- CORS Handling ---
  const origin = req.headers.get('origin') || '';
  const isAllowedOrigin = allowedOrigins.includes(origin);
  const corsHeaders = getCorsHeaders(isAllowedOrigin ? origin : allowedOrigins[0]);

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // --- Request Body Processing ---
  let requestData;
  try {
    requestData = await req.json();
  } catch (e) {
    console.error("Failed to parse request body:", e);
    return new Response(JSON.stringify({ error: "Invalid request body. Expected JSON." }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const { recipe, modificationRequest } = requestData || {};

  if (!recipe || !modificationRequest) {
    return new Response(
      JSON.stringify({ error: "Recipe and modification request are required" }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // --- OpenAI Initialization ---
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error("Missing OPENAI_API_KEY environment variable.")
    }
    const openai = new OpenAI({ apiKey });

    const prompt = `You are a professional chef and recipe modifier. The user wants to modify the following recipe:

Title: ${recipe.title}
Description: ${recipe.description}
Ingredients: ${recipe.ingredients.join(", ")}
Instructions: ${recipe.instructions.join(" | ")}
Cooking Time: ${recipe.cooking_time} minutes
Difficulty: ${recipe.difficulty}
Servings: ${recipe.servings}
${recipe.nutritional_info ? `Nutritional Info: ${JSON.stringify(recipe.nutritional_info)}` : ""}

The user wants to make the following change: "${modificationRequest}"

Please modify the recipe according to the user's request. Return the modified recipe in the following JSON format:
{
  "title": "string",
  "description": "string",
  "ingredients": ["string"],
  "instructions": ["string"],
  "cooking_time": number,
  "difficulty": "string",
  "servings": number,
  "source": "string (original source if available)",
  "modifications": ["string (list of changes made)"],
  "nutritional_info": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  }
}

Make sure to:
1. Keep the same basic structure of the recipe
2. Clearly document what changes were made in the modifications array
3. Update nutritional information if the changes affect it
4. Maintain the same format for ingredients and instructions
5. Return ONLY the JSON object, no additional text`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
    });

    const modifiedRecipe = JSON.parse(completion.choices[0].message.content);

    return new Response(
      JSON.stringify({ recipe: modifiedRecipe }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to modify recipe" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 