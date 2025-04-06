import React, { useState, useEffect } from 'react';
import { MealPlan } from '../types';
import {
  getSavedMealPlans,
  deleteMealPlan,
  exportMealPlanAsPDF,
  exportMealPlanAsCalendar,
} from '../services/mealPlanStorage';

const SavedMealPlans: React.FC = () => {
  const [savedPlans, setSavedPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await getSavedMealPlans();
        setSavedPlans(plans);
      } catch (err) {
        setError('Failed to load saved plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleDelete = async (planId: string) => {
    try {
      await deleteMealPlan(planId);
      setSavedPlans(plans => plans.filter(plan => plan.id !== planId));
    } catch (err) {
      setError('Failed to delete plan');
    }
  };

  const handleExportPDF = (plan: MealPlan) => {
    try {
      exportMealPlanAsPDF(plan);
    } catch (err) {
      setError('Failed to export plan as PDF');
    }
  };

  const handleExportCalendar = (plan: MealPlan) => {
    try {
      exportMealPlanAsCalendar(plan);
    } catch (err) {
      setError('Failed to export plan to calendar');
    }
  };

  if (loading) {
    return <div>Loading saved plans...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (savedPlans.length === 0) {
    return (
      <div className="saved-plans">
        <h3>Saved Meal Plans</h3>
        <p>No saved meal plans yet.</p>
      </div>
    );
  }

  return (
    <div className="saved-plans">
      <h3>Saved Meal Plans</h3>
      <div className="plans-grid">
        {savedPlans.map(plan => (
          <div key={plan.id} className="saved-plan-card">
            <h4>{plan.meals[0].name}</h4>
            <div className="plan-details">
              <p>Total Prep Time: {plan.prepTime} minutes</p>
              <p>Estimated Cost: ${plan.totalCost.toFixed(2)}</p>
              <p>Number of Meals: {plan.meals.length}</p>
            </div>
            <div className="plan-actions">
              <button onClick={() => handleExportPDF(plan)} className="export-button pdf">
                Export PDF
              </button>
              <button onClick={() => handleExportCalendar(plan)} className="export-button calendar">
                Add to Calendar
              </button>
              <button onClick={() => handleDelete(plan.id)} className="delete-button">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedMealPlans;
