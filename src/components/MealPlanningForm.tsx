import React, { useState } from 'react';
import { MealPreferences, MealPlan } from '../types';
import { generateMealPlan } from '../services/mealPlanService';
import { saveMealPlan } from '../services/mealPlanStorage';
import MealCard from './MealCard';
import ShoppingList from './ShoppingList';
import SavedMealPlans from './SavedMealPlans';

const MealPlanningForm: React.FC = () => {
  const [preferences, setPreferences] = useState<MealPreferences>({
    dietType: 'omnivore',
    budget: 100,
    timeConstraints: 120,
    proteinGoal: 'moderate',
    restrictions: [],
  });

  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSavedPlans, setShowSavedPlans] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const plan = await generateMealPlan(preferences);
      setGeneratedPlan(plan);
    } catch (err) {
      setError('Failed to generate meal plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (generatedPlan) {
      try {
        await saveMealPlan(generatedPlan);
        setShowSavedPlans(true);
      } catch (err) {
        setError('Failed to save meal plan');
      }
    }
  };

  return (
    <div className="meal-planning-container">
      <form onSubmit={handleSubmit} className="meal-planning-form">
        <div className="form-group">
          <label htmlFor="dietType">Diet Type</label>
          <select
            id="dietType"
            value={preferences.dietType}
            onChange={(e) => setPreferences({ ...preferences, dietType: e.target.value as any })}
          >
            <option value="omnivore">Omnivore</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="pescatarian">Pescatarian</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="budget">Weekly Budget ($)</label>
          <input
            type="number"
            id="budget"
            value={preferences.budget}
            onChange={(e) => setPreferences({ ...preferences, budget: Number(e.target.value) })}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="timeConstraints">Available Prep Time (minutes)</label>
          <input
            type="number"
            id="timeConstraints"
            value={preferences.timeConstraints}
            onChange={(e) => setPreferences({ ...preferences, timeConstraints: Number(e.target.value) })}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="proteinGoal">Protein Goal</label>
          <select
            id="proteinGoal"
            value={preferences.proteinGoal}
            onChange={(e) => setPreferences({ ...preferences, proteinGoal: e.target.value as any })}
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="generate-plan-button"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Meal Plan'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {generatedPlan && (
        <div className="generated-plan">
          <div className="plan-summary">
            <h3>Your Meal Plan</h3>
            <p>Total Prep Time: {generatedPlan.prepTime} minutes</p>
            <p>Estimated Cost: ${generatedPlan.totalCost.toFixed(2)}</p>
            <button 
              onClick={handleSavePlan}
              className="save-plan-button"
            >
              Save Plan
            </button>
          </div>

          <div className="meals-container">
            <h3>Meals</h3>
            <div className="meals-grid">
              {generatedPlan.meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          </div>

          <div className="shopping-list-container">
            <ShoppingList items={generatedPlan.shoppingList} />
          </div>
        </div>
      )}

      <button 
        onClick={() => setShowSavedPlans(!showSavedPlans)}
        className="toggle-saved-plans-button"
      >
        {showSavedPlans ? 'Hide Saved Plans' : 'Show Saved Plans'}
      </button>

      {showSavedPlans && <SavedMealPlans />}
    </div>
  );
};

export default MealPlanningForm; 