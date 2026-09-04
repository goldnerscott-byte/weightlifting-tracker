import React, { useContext } from 'react';
import { WorkoutContext } from '../../context/WorkoutContext';

export default function AddCategoryModal({ dayName, weekKey, onClose }) {
  const { dispatch, state, CATEGORIES } = useContext(WorkoutContext);
  const weekData = state.weeks[weekKey];
  const dayData = weekData?.days[dayName];
  const selectedCategories = new Set(dayData?.categories || []);

  const handleSelectCategory = (category) => {
    if (!selectedCategories.has(category)) {
      dispatch({
        type: 'ADD_CATEGORY',
        payload: { weekKey, dayName, category },
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="rounded-lg p-6 w-80 max-h-96 overflow-y-auto"
        style={{ backgroundColor: '#b87333' }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: '#d4af37' }}>
          Add Category
        </h2>

        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleSelectCategory(category)}
              disabled={selectedCategories.has(category)}
              className="w-full p-3 rounded text-left"
              style={{
                backgroundColor: selectedCategories.has(category) ? '#8b6f47' : '#555555',
                color: selectedCategories.has(category) ? '#888888' : '#e8e8e8',
                opacity: selectedCategories.has(category) ? 0.5 : 1,
              }}
            >
              {selectedCategories.has(category) ? '✓ ' : '○ '}
              {category}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 rounded font-semibold"
          style={{ backgroundColor: '#d4af37', color: '#0f0f0f' }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
