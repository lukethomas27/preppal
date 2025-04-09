import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const RecipeTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const testFunction = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      const baseUrl = process.env.REACT_APP_SUPABASE_URL;
      const functionUrl = `${baseUrl}/functions/generate-recipe`;
      
      console.log('Base URL:', baseUrl);
      console.log('Function URL:', functionUrl);
      console.log('Session:', session);
      console.log('Anon Key:', process.env.REACT_APP_SUPABASE_ANON_KEY);

      const testData = {
        mood: 'energetic',
        dietaryPreferences: 'vegetarian',
        ingredients: 'tomatoes, pasta, cheese',
        cookingTime: '30',
        difficulty: 'easy'
      };

      console.log('Request headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY || ''
      });

      const response = await fetch(
        functionUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY || ''
          },
          body: JSON.stringify(testData)
        }
      );

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipe');
      }

      setResponse(data);
    } catch (err) {
      console.error('Detailed error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Recipe Generator</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Environment Variables:</p>
        <pre className="text-xs bg-gray-100 p-2 rounded">
          REACT_APP_SUPABASE_URL: {process.env.REACT_APP_SUPABASE_URL}
        </pre>
      </div>
      <button
        onClick={testFunction}
        className="btn btn-primary mb-4"
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test Function'}
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          Error: {error}
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="font-bold mb-2">Response:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default RecipeTest; 