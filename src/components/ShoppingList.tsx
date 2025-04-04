import React from 'react';
import { ShoppingItem } from '../types';

interface ShoppingListProps {
  items: ShoppingItem[];
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items }) => {
  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  return (
    <div className="shopping-list">
      <h3>Shopping List</h3>
      {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
        <div key={category} className="shopping-category">
          <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
          <ul className="category-items">
            {categoryItems.map((item, index) => (
              <li key={index} className="shopping-item">
                <span className="item-amount">
                  {item.amount} {item.unit}
                </span>
                <span className="item-name">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ShoppingList; 