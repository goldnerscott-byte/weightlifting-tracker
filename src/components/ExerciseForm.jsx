import React, { useContext, useState } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';

export default function ExerciseForm({ category, onSave, onCancel }) {
  const { STANDARD_EXERCISES } = useContext(WorkoutContext);
  const [exerciseName, setExerciseName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (value) => {
    setExerciseName(value);

    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const categoryExercises = STANDARD_EXERCISES[category] || [];
    const filtered = categoryExercises
      .filter(ex => ex.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 3);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    setExerciseName(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = () => {
    if (exerciseName.trim()) {
      onSave(exerciseName);
      setExerciseName('');
    }
  };

  return (
    <div className="p-3 rounded mb-4" style={{ backgroundColor: '#555555', color: '#e8e8e8' }}>
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Exercise name"
          value={exerciseName}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => exerciseName.trim() && setShowSuggestions(true)}
          className="w-full px-3 py-2 rounded text-sm"
          style={{ backgroundColor: '#8b6f47', color: '#e8e8e8' }}
          maxLength={50}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded shadow-lg z-10"
            style={{ backgroundColor: '#8b6f47' }}
          >
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 text-sm hover:opacity-80"
                style={{ color: '#e8e8e8' }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="text-sm mb-2">Set 1:</div>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            inputMode="numeric"
            step="0.5"
            placeholder="Weight"
            className="w-16 px-2 py-1 rounded text-center text-sm"
            style={{ backgroundColor: '#8b6f47', color: '#e8e8e8' }}
            disabled
          />
          <span style={{ color: '#d4af37' }}>lbs</span>
          <span>×</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Reps"
            className="w-12 px-2 py-1 rounded text-center text-sm"
            style={{ backgroundColor: '#8b6f47', color: '#e8e8e8' }}
            disabled
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 py-2 rounded font-semibold text-sm"
          style={{ backgroundColor: '#d4af37', color: '#0f0f0f' }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded font-semibold text-sm"
          style={{ backgroundColor: '#8b6f47', color: '#d4af37', border: '1px solid #d4af37' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
