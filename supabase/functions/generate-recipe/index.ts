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

// Helper function to extract JSON from a string
function extractJson(str: string): object | null {
  const match = str.match(/\{.*\}/s);
  if (!match) {
    return null;
  }
  try {
    return JSON.parse(match[0]);
  } catch (e) {
    console.error("Failed to parse extracted JSON string:", e);
    return null;
  }
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

  const { 
    mood = "any", 
    dietaryPreferences = "none", 
    ingredients = "any", 
    cookingTime = "any",
    difficultyLevel = "any",
    proteinGoal = "",
    calorieGoal = "",
    totalServings = "2"
  } = requestData || {};

  // --- Input Validation ---
  let validatedCookingTime = cookingTime;
  if (typeof cookingTime !== 'string' || cookingTime.toLowerCase() === 'any' || !/\d+/.test(cookingTime)) {
    validatedCookingTime = "any";
  } 

  let validatedTotalServings = totalServings;
  if (typeof totalServings !== 'string' || !/\d+/.test(totalServings) || parseInt(totalServings) < 1) {
    validatedTotalServings = "2";
  }

  let validatedProteinGoal = proteinGoal;
  if (typeof proteinGoal !== 'string' || (proteinGoal && !/\d+/.test(proteinGoal))) {
    validatedProteinGoal = "";
  }

  let validatedCalorieGoal = calorieGoal;
  if (typeof calorieGoal !== 'string' || (calorieGoal && !/\d+/.test(calorieGoal))) {
    validatedCalorieGoal = "";
  }

  try {
    // --- Rate Limiting Check ---
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') ?? '' },
        },
      }
    );

    // Get the IP address from the request
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    const { data: rateLimitCheck, error: rateLimitError } = await supabaseClient
      .rpc('check_recipe_generation_limit', { ip });

    if (rateLimitError) {
      console.error("Rate limit check error:", rateLimitError);
      throw new Error("Failed to check rate limit");
    }

    if (!rateLimitCheck) {
      return new Response(
        JSON.stringify({ 
          error: "You've reached your weekly limit of 5 recipe generations. Please create an account for unlimited access." 
        }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // --- OpenAI Initialization ---
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error("Missing OPENAI_API_KEY environment variable.")
    }
    const openai = new OpenAI({ apiKey });

    // --- Prompt Construction ---
    let constraints = ``;
    if (validatedCookingTime !== "any") {
      constraints += `Maximum Cooking Time: ${validatedCookingTime} minutes\n`;
    }
    if (validatedProteinGoal) {
      constraints += `Target Protein per Serving: approximately ${validatedProteinGoal}g\n`;
    }
    if (validatedCalorieGoal) {
      constraints += `Target Calories per Serving: approximately ${validatedCalorieGoal} kcal\n`;
    }
    constraints += `Total Servings to Generate: ${validatedTotalServings}\n`;

    const prompt = `You are an expert chef and recipe creator. Your task is to find or create a recipe based on the following user inputs and constraints:

User Inputs:
Mood: ${mood}
Dietary Preferences: ${dietaryPreferences}
Available Ingredients: ${ingredients}
Preferred Difficulty Level: ${difficultyLevel}

Constraints:
${constraints}
First, search the internet for existing recipes that closely match the user inputs and constraints. If you find a suitable recipe, adapt it to meet all requirements precisely. If no suitable recipe is found, create a new one from scratch that meets all criteria.

The generated recipe MUST adhere strictly to the specified constraints, especially cooking time, protein/calorie goals (if provided), and total servings.

Provide the recipe details formatted strictly as a single JSON object with the following structure:
{
  "title": "Recipe Title",
  "description": "Recipe description",
  "ingredients": ["quantity ingredient 1", "quantity ingredient 2", ...], // Include quantities
  "instructions": ["step 1", "step 2", ...],
  "cooking_time": number, // Estimated cooking time in minutes (must be <= Maximum Cooking Time if specified)
  "difficulty": "easy/medium/hard",
  "servings": number, // Must match the 'Total Servings to Generate' constraint
  "source": "URL or 'Original Recipe'",
  "modifications": ["modification 1", "modification 2", ...], // Explain adaptations if source is not 'Original Recipe'
  "nutritional_info": { // Provide estimates per serving
    "calories": number | null, // (must be approx. Target Calories if specified)
    "protein": number | null, // (must be approx. Target Protein if specified)
    "carbs": number | null,
    "fat": number | null
  }
}
Ensure the output is ONLY the JSON object, with no additional text before or after. Ensure all string values within the JSON are properly escaped. Calculate nutritional info based on the specified total servings.`;

    // --- OpenAI API Call ---
    console.log("Sending request to OpenAI with prompt:", prompt);
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a helpful recipe assistant designed to output JSON. Strictly follow the requested JSON format and all constraints mentioned in the user prompt. Output ONLY the JSON object."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 2000
    });
    console.log("Received response from OpenAI.");

    const recipeText = completion.choices[0].message?.content;

    if (!recipeText) {
      console.error("OpenAI response content is empty.");
      throw new Error('Failed to generate recipe content from OpenAI');
    }

    console.log("Raw OpenAI Response Text:", recipeText);

    // --- Parse OpenAI Response ---
    let recipeData;
    try {
      recipeData = JSON.parse(recipeText);
    } catch (directParseError) {
      console.warn("Direct JSON parsing failed. Attempting to extract JSON block.", directParseError);
      recipeData = extractJson(recipeText);
      if (!recipeData) {
        console.error("Failed to parse or extract JSON from OpenAI response:", recipeText);
        throw new Error('Failed to parse recipe data from AI. The format might be incorrect or incomplete.');
      }
      console.log("Successfully extracted JSON after direct parse failed.");
    }

    // --- Validate Parsed Data ---
    if (!recipeData || typeof recipeData !== 'object' || !recipeData.title || !Array.isArray(recipeData.ingredients) || !Array.isArray(recipeData.instructions) || typeof recipeData.servings !== 'number') {
      console.error("Parsed JSON data is missing required fields or has incorrect types:", recipeData);
      throw new Error('Parsed recipe data is incomplete or invalid.');
    }

    console.log("Successfully Parsed Recipe Data:", recipeData);

    // --- Record the attempt ---
    const { error: recordError } = await supabaseClient
      .rpc('record_recipe_generation_attempt', { ip });

    if (recordError) {
      console.error("Failed to record attempt:", recordError);
    }

    // --- Send Success Response ---
    return new Response(JSON.stringify({ recipe: recipeData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Edge Function Execution Error:', error);
    
    let errorMessage = 'An error occurred while generating the recipe';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes("OPENAI_API_KEY")) {
        statusCode = 500;
      } else if (error.message.includes("quota")) {
        errorMessage = 'OpenAI quota exceeded. Please try again later.';
        statusCode = 429;
      } else if (error.message.includes("parse recipe data")) {
        statusCode = 500;
      } else if (error.message.includes("Parsed recipe data is incomplete")) {
        statusCode = 500;
      }
    }
     
    if (error.response?.status === 429) { 
      errorMessage = 'OpenAI quota exceeded. Please try again later.';
      statusCode = 429;
    }

    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}); 