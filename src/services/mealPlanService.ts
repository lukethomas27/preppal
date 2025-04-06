import { MealPlan, MealPreferences, Meal, ShoppingItem } from '../types';

const generateMockMealPlan = (preferences: MealPreferences): MealPlan => {
  // This is a mock implementation - in a real app, this would call an AI service
  const meals: Meal[] = [
    {
      id: '1',
      name: 'Chicken and Vegetable Stir Fry',
      servings: 4,
      ingredients: [
        { name: 'chicken breast', amount: 500, unit: 'g' },
        { name: 'mixed vegetables', amount: 400, unit: 'g' },
        { name: 'soy sauce', amount: 60, unit: 'ml' },
        { name: 'rice', amount: 400, unit: 'g' },
      ],
      instructions: [
        'Cook rice according to package instructions',
        'Cut chicken into bite-sized pieces',
        'Stir-fry vegetables until tender',
        'Add chicken and cook until done',
        'Add soy sauce and serve over rice',
      ],
      macros: {
        calories: 450,
        protein: 35,
        carbs: 45,
        fat: 12,
      },
    },
    {
      id: '2',
      name: 'Quinoa Salad Bowl',
      servings: 4,
      ingredients: [
        { name: 'quinoa', amount: 200, unit: 'g' },
        { name: 'cherry tomatoes', amount: 200, unit: 'g' },
        { name: 'cucumber', amount: 1, unit: 'whole' },
        { name: 'feta cheese', amount: 100, unit: 'g' },
      ],
      instructions: [
        'Cook quinoa according to package instructions',
        'Chop vegetables and mix with quinoa',
        'Crumble feta cheese on top',
        'Add dressing and serve',
      ],
      macros: {
        calories: 380,
        protein: 15,
        carbs: 55,
        fat: 12,
      },
    },
  ];

  const shoppingList: ShoppingItem[] = [
    { name: 'chicken breast', amount: 500, unit: 'g', category: 'meat' },
    { name: 'mixed vegetables', amount: 400, unit: 'g', category: 'produce' },
    { name: 'soy sauce', amount: 60, unit: 'ml', category: 'condiments' },
    { name: 'rice', amount: 400, unit: 'g', category: 'grains' },
    { name: 'quinoa', amount: 200, unit: 'g', category: 'grains' },
    { name: 'cherry tomatoes', amount: 200, unit: 'g', category: 'produce' },
    { name: 'cucumber', amount: 1, unit: 'whole', category: 'produce' },
    { name: 'feta cheese', amount: 100, unit: 'g', category: 'dairy' },
  ];

  return {
    id: Date.now().toString(),
    meals,
    shoppingList,
    prepTime: 90, // minutes
    totalCost: preferences.budget * 0.8, // Mock cost calculation
  };
};

export const generateMealPlan = async (preferences: MealPreferences): Promise<MealPlan> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return generateMockMealPlan(preferences);
};
