import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: any) => void;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ onRecipeGenerated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    mood: '',
    dietaryPreferences: '',
    ingredients: '',
    cookingTime: '',
    difficulty: 'any'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error('Failed to get session: ' + sessionError.message);
      }
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      console.log('Session:', session);
      console.log('Function URL:', `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/generate-recipe`);
      console.log('Auth Token:', session.access_token);

      const response = await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/generate-recipe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY || '',
            'x-client-info': 'preppal-web'
          },
          body: JSON.stringify(formData),
          credentials: 'include'
        }
      );

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to generate recipe');
      }

      const recipe = await response.json();
      onRecipeGenerated(recipe);
    } catch (err) {
      console.error('Detailed error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Generate a Recipe</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-field">
          <label htmlFor="mood" className="label">
            How are you feeling today?
          </label>
          <input
            type="text"
            id="mood"
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            placeholder="e.g., energetic, cozy, adventurous"
            className="input"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="dietaryPreferences" className="label">
            Dietary Preferences
          </label>
          <input
            type="text"
            id="dietaryPreferences"
            name="dietaryPreferences"
            value={formData.dietaryPreferences}
            onChange={handleChange}
            placeholder="e.g., vegetarian, gluten-free, low-carb"
            className="input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="ingredients" className="label">
            Available Ingredients (optional)
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="List ingredients you have on hand"
            className="input h-24"
          />
        </div>

        <div className="form-field">
          <label htmlFor="cookingTime" className="label">
            Available Cooking Time
          </label>
          <select
            id="cookingTime"
            name="cookingTime"
            value={formData.cookingTime}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select time</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="difficulty" className="label">
            Difficulty Level
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="input"
          >
            <option value="any">Any</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          type="submit"
          className={`w-full btn btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Generating Recipe...' : 'Generate Recipe'}
        </button>
      </form>
    </div>
  );
};

export default RecipeGenerator; 