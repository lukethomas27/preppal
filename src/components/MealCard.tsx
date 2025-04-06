import React, { useState } from 'react';
import { Meal } from '../types';
import CookingTimer from './CookingTimer';

interface MealCardProps {
  meal: Meal;
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const [showTimer, setShowTimer] = useState(false);

  const timerSteps = meal.instructions.map((instruction, index) => {
    // This is a simple estimation - in a real app, you might want to parse the instructions
    // to get more accurate timing or allow users to set their own timings
    const estimatedTime = 5; // minutes per step
    return {
      instruction,
      duration: estimatedTime * 60, // convert to seconds
    };
  });

  return (
    <div className="meal-card">
      <h3>{meal.name}</h3>
      <div className="meal-details">
        <div className="meal-servings">
          <span className="label">Servings:</span>
          <span className="value">{meal.servings}</span>
        </div>
        {meal.macros && (
          <div className="meal-macros">
            <div className="macro-item">
              <span className="label">Calories:</span>
              <span className="value">{meal.macros.calories}</span>
            </div>
            <div className="macro-item">
              <span className="label">Protein:</span>
              <span className="value">{meal.macros.protein}g</span>
            </div>
            <div className="macro-item">
              <span className="label">Carbs:</span>
              <span className="value">{meal.macros.carbs}g</span>
            </div>
            <div className="macro-item">
              <span className="label">Fat:</span>
              <span className="value">{meal.macros.fat}g</span>
            </div>
          </div>
        )}
      </div>

      <div className="ingredients-section">
        <h4>Ingredients</h4>
        <ul className="ingredients-list">
          {meal.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.amount} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="instructions-section">
        <div className="instructions-header">
          <h4>Instructions</h4>
          <button onClick={() => setShowTimer(!showTimer)} className="timer-toggle-button">
            {showTimer ? 'Hide Timer' : 'Show Timer'}
          </button>
        </div>

        {showTimer ? (
          <CookingTimer
            steps={timerSteps}
            onComplete={() => {
              // You could add a completion handler here
              console.log('Cooking complete!');
            }}
          />
        ) : (
          <ol className="instructions-list">
            {meal.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default MealCard;
