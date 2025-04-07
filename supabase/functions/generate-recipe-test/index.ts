// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "std/http/server.ts";
import { createClient } from "supabase-js";
import { OpenAI } from "openai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow all origins for development
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': '*', // Allow all origins for development
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Credentials': 'true'
      },
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 401,
        },
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 401,
        },
      );
    }

    const { mood, dietaryPreferences, ingredients, cookingTime, difficulty } = await req.json();

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const prompt = `Generate a recipe based on the following criteria:
Mood: ${mood}
Dietary Preferences: ${dietaryPreferences || 'none specified'}
Available Ingredients: ${ingredients || 'none specified'}
Cooking Time: ${cookingTime} minutes
Difficulty Level: ${difficulty}

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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
      temperature: 0.7,
    });

    const recipe = JSON.parse(completion.choices[0].message?.content || '{}');

    return new Response(
      JSON.stringify(recipe),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error.message.includes('quota') 
      ? 'OpenAI API quota exceeded. Please check your OpenAI account settings.'
      : error.message;
      
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-recipe' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
