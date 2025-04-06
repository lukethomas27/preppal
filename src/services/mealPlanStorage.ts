import { MealPlan } from '../types';
import { supabase } from '../lib/supabase';

// Save meal plan to localStorage
export const saveMealPlan = async (mealPlan: MealPlan): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from('meal_plans').insert([{ ...mealPlan, user_id: user?.id }]);

  if (error) throw error;
};

// Get all saved meal plans
export const getSavedMealPlans = async (): Promise<MealPlan[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase.from('meal_plans').select('*').eq('user_id', user?.id);

  if (error) throw error;
  return data || [];
};

// Delete a saved meal plan
export const deleteMealPlan = async (planId: string): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from('meal_plans')
    .delete()
    .eq('id', planId)
    .eq('user_id', user?.id);

  if (error) throw error;
};

// Export meal plan as PDF
export const exportMealPlanAsPDF = (mealPlan: MealPlan): void => {
  // Create a new window with the meal plan content
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const content = `
    <html>
      <head>
        <title>${mealPlan.meals[0].name} - Meal Plan</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #2c3e50; }
          .meal { margin-bottom: 30px; }
          .ingredients { margin-left: 20px; }
          .instructions { margin-left: 20px; }
          .shopping-list { margin-top: 30px; }
          .category { margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <h1>${mealPlan.meals[0].name} - Meal Plan</h1>
        
        ${mealPlan.meals
          .map(
            meal => `
          <div class="meal">
            <h2>${meal.name}</h2>
            <p>Servings: ${meal.servings}</p>
            
            <h3>Ingredients:</h3>
            <ul class="ingredients">
              ${meal.ingredients
                .map(ing => `<li>${ing.amount} ${ing.unit} ${ing.name}</li>`)
                .join('')}
            </ul>
            
            <h3>Instructions:</h3>
            <ol class="instructions">
              ${meal.instructions.map(inst => `<li>${inst}</li>`).join('')}
            </ol>
          </div>
        `
          )
          .join('')}
        
        <div class="shopping-list">
          <h2>Shopping List</h2>
          ${Object.entries(
            mealPlan.shoppingList.reduce(
              (acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
              },
              {} as Record<string, typeof mealPlan.shoppingList>
            )
          )
            .map(
              ([category, items]) => `
            <div class="category">
              <h3>${category}</h3>
              <ul>
                ${items.map(item => `<li>${item.amount} ${item.unit} ${item.name}</li>`).join('')}
              </ul>
            </div>
          `
            )
            .join('')}
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.print();
};

// Export meal plan as calendar event
export const exportMealPlanAsCalendar = (mealPlan: MealPlan): void => {
  const calendarEvents = mealPlan.meals.map(meal => {
    const event = {
      title: meal.name,
      description: `Ingredients:\n${meal.ingredients
        .map(ing => `${ing.amount} ${ing.unit} ${ing.name}`)
        .join('\n')}\n\nInstructions:\n${meal.instructions.join('\n')}`,
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour duration
    };

    // Create ICS file content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `DTSTART:${event.startTime.toISOString().replace(/[-:]/g, '')}`,
      `DTEND:${event.endTime.toISOString().replace(/[-:]/g, '')}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');

    // Create and download the file
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${meal.name}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
};
