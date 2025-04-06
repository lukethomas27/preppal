export interface MealPreferences {
  dietType: 'vegetarian' | 'vegan' | 'omnivore' | 'pescatarian';
  budget: number;
  timeConstraints: number; // in minutes
  proteinGoal?: 'high' | 'moderate' | 'low';
  restrictions: string[];
}

export interface MealPlan {
  id: string;
  meals: Meal[];
  shoppingList: ShoppingItem[];
  prepTime: number;
  totalCost: number;
}

export interface Meal {
  id: string;
  name: string;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  macros?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface ShoppingItem {
  name: string;
  amount: number;
  unit: string;
  category: string;
}
