import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import RecipeDisplay from './RecipeDisplay';
import { motion, AnimatePresence } from 'framer-motion';

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: any) => void;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ onRecipeGenerated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);
  const [formData, setFormData] = useState({
    mood: '',
    dietaryPreferences: '',
    ingredients: '',
    cookingTime: '',
    difficultyLevel: '',
    proteinGoal: '',
    calorieGoal: '',
    totalServings: '2'
  });
  const [activeStep, setActiveStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const steps = [
    { id: 'mood', label: 'How are you feeling?' },
    { id: 'dietaryPreferences', label: 'Dietary Preferences' },
    { id: 'ingredients', label: 'Available Ingredients' },
    { id: 'cookingTime', label: 'Max Cooking Time' },
    { id: 'difficultyLevel', label: 'Difficulty Level' },
    { id: 'proteinGoal', label: 'Protein Goal (g/serving)' },
    { id: 'calorieGoal', label: 'Calorie Goal (kcal/serving)' },
    { id: 'totalServings', label: 'Total Servings' }
  ];

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSaveRecipe = async () => {
    if (!user || !generatedRecipe) return;

    try {
      // Ensure ingredients and instructions are arrays
      const ingredients = Array.isArray(generatedRecipe.ingredients) 
        ? generatedRecipe.ingredients 
        : [generatedRecipe.ingredients];
      
      const instructions = Array.isArray(generatedRecipe.instructions) 
        ? generatedRecipe.instructions 
        : [generatedRecipe.instructions];

      // Log the recipe data for debugging
      console.log('Saving recipe:', {
        title: generatedRecipe.title,
        description: generatedRecipe.description,
        ingredients,
        instructions,
        cooking_time: generatedRecipe.cooking_time,
        difficulty: generatedRecipe.difficulty,
        servings: generatedRecipe.servings,
        source: generatedRecipe.source,
        modifications: generatedRecipe.modifications
      });

      const { error } = await supabase
        .from('saved_recipes')
        .insert([
          {
            user_id: user.id,
            title: generatedRecipe.title,
            description: generatedRecipe.description,
            ingredients: ingredients,
            instructions: instructions,
            cooking_time: generatedRecipe.cooking_time,
            difficulty: generatedRecipe.difficulty,
            servings: generatedRecipe.servings,
            source: generatedRecipe.source,
            modifications: generatedRecipe.modifications
          }
        ]);

      if (error) throw error;
      setShowSuccess(true);
    } catch (err) {
      console.error('Error saving recipe:', err);
      setError('Failed to save recipe. Please try again.');
    }
  };

  const handleNewRecipe = () => {
    setGeneratedRecipe(null);
    setShowForm(true);
    setFormData({
      mood: '',
      dietaryPreferences: '',
      ingredients: '',
      cookingTime: '',
      difficultyLevel: '',
      proteinGoal: '',
      calorieGoal: '',
      totalServings: '2'
    });
    setActiveStep(0);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: formData
      });

      if (error) {
        if (error.message.includes('weekly limit')) {
          setError('You\'ve reached your weekly limit of 5 recipe generations. Please create an account for unlimited access.');
        } else {
          setError(error.message);
        }
        return;
      }

      if (data?.recipe) {
        setGeneratedRecipe(data.recipe);
        setShowForm(false);
        if (onRecipeGenerated) {
          onRecipeGenerated(data.recipe);
        }
      } else {
        setError('Failed to generate recipe. Please try again.');
      }
    } catch (err) {
      console.error('Error generating recipe:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeModified = (modifiedRecipe: any) => {
    setGeneratedRecipe(modifiedRecipe);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        {!showForm && generatedRecipe ? (
          <motion.div
            key="recipe"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <h2 className="text-3xl font-bold text-gray-900">Your Custom Recipe</h2>
              <div className="space-x-4">
                <button
                  onClick={handleSaveRecipe}
                  className="btn btn-primary"
                  disabled={showSuccess}
                >
                  Save Recipe
                </button>
                <button
                  onClick={handleNewRecipe}
                  className="btn btn-secondary"
                >
                  Generate New Recipe
                </button>
              </div>
            </div>
            <RecipeDisplay 
              recipe={generatedRecipe} 
              onRecipeModified={handleRecipeModified}
            />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Recipe</h2>
              <p className="text-xl text-gray-600">Let's create something delicious together</p>
            </div>

            {!user && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  You can generate up to 5 recipes without an account.
                  <a href="/signup" className="text-blue-600 hover:text-blue-800 font-semibold ml-1">
                    Create an account
                  </a> for unlimited access!
                </p>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="mb-8">
              <div className="flex justify-between mb-4">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-1 rounded-full mx-1 ${
                      index <= activeStep ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <div className="text-center text-sm font-medium text-gray-600">
                Step {activeStep + 1} of {steps.length}: {steps[activeStep].label}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                {activeStep === 0 && (
                  <div className="space-y-4">
                    <label htmlFor="mood" className="block text-lg font-medium text-gray-700">
                      {steps[activeStep].label}
                    </label>
                    <input
                      id="mood"
                      type="text"
                      name="mood"
                      value={formData.mood}
                      onChange={handleInputChange}
                      placeholder="e.g., energetic, cozy, adventurous"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="space-y-4">
                    <label htmlFor="dietaryPreferences" className="block text-lg font-medium text-gray-700">
                      {steps[activeStep].label}
                    </label>
                    <input
                      id="dietaryPreferences"
                      type="text"
                      name="dietaryPreferences"
                      value={formData.dietaryPreferences}
                      onChange={handleInputChange}
                      placeholder="e.g., vegetarian, gluten-free, low-carb, none"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-4">
                    <label htmlFor="ingredients" className="block text-lg font-medium text-gray-700">
                      {steps[activeStep].label}
                    </label>
                    <textarea
                      id="ingredients"
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleInputChange}
                      placeholder="List ingredients you have or want to use (e.g., chicken breast, broccoli, rice)"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent h-32"
                      disabled={loading}
                    />
                    <p className="text-sm text-gray-500">Separate ingredients with commas or new lines.</p>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-4">
                    <label htmlFor="cookingTime" className="block text-lg font-medium text-gray-700">
                      {steps[activeStep].label}
                    </label>
                    <select
                      id="cookingTime"
                      name="cookingTime"
                      value={formData.cookingTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                      disabled={loading}
                    >
                      <option value="">Select max time</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours or more</option>
                    </select>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="space-y-4">
                    <label htmlFor="difficultyLevel" className="block text-lg font-medium text-gray-700">
                      {steps[activeStep].label}
                    </label>
                    <select
                      id="difficultyLevel"
                      name="difficultyLevel"
                      value={formData.difficultyLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="any">Any</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                )}

                {activeStep === 5 && (
                  <div className="space-y-4">
                    <label htmlFor="proteinGoal" className="block text-lg font-medium text-gray-700">
                      {steps[activeStep].label} (Optional)
                    </label>
                    <input
                      id="proteinGoal"
                      type="number"
                      name="proteinGoal"
                      value={formData.proteinGoal}
                      onChange={handleInputChange}
                      placeholder="e.g., 30"
                      min="0"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={loading}
                    />
                    <p className="text-sm text-gray-500">Enter your target protein in grams per serving.</p>
                  </div>
                )}

                {activeStep === 6 && (
                  <div className="space-y-4">
                    <label htmlFor="calorieGoal" className="block text-lg font-medium text-gray-700">
                      {steps[activeStep].label} (Optional)
                    </label>
                    <input
                      id="calorieGoal"
                      type="number"
                      name="calorieGoal"
                      value={formData.calorieGoal}
                      onChange={handleInputChange}
                      placeholder="e.g., 500"
                      min="0"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={loading}
                    />
                    <p className="text-sm text-gray-500">Enter your target calories per serving.</p>
                  </div>
                )}

                {activeStep === 7 && (
                  <div className="space-y-4">
                    <label htmlFor="totalServings" className="block text-lg font-medium text-gray-700">
                      {steps[activeStep].label}
                    </label>
                    <input
                      id="totalServings"
                      type="number"
                      name="totalServings"
                      value={formData.totalServings}
                      onChange={handleInputChange}
                      placeholder="e.g., 4"
                      min="1"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={loading}
                    />
                    <p className="text-sm text-gray-500">How many servings should the recipe make?</p>
                  </div>
                )}
              </motion.div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className={`btn btn-secondary ${activeStep === 0 ? 'invisible' : ''}`}
                  disabled={loading || activeStep === 0}
                >
                  Back
                </button>
                {activeStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`btn btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Finding Recipe...
                      </div>
                    ) : (
                      'Find Recipe'
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          Recipe saved successfully!
        </motion.div>
      )}
    </div>
  );
};

export default RecipeGenerator; 