import React, { useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';

export default function ExerciseDisplay({ exercise, weekKey, dayName, onExerciseClick }) {
  const { dispatch } = useContext(WorkoutContext);

  const handleSetChange = (setId, field, value) => {
    dispatch({
      type: 'UPDATE_SET',
      payload: { weekKey, dayName, exerciseId: exercise.id, setId, field, value },
    });
  };

  const handleAddSet = () => {
    dispatch({
      type: 'ADD_SET',
      payload: { weekKey, dayName, exerciseId: exercise.id },
    });
  };

  const handleToggleUnit = (setId, currentUnit) => {
    const newUnit = currentUnit === 'lbs' ? 'kg' : 'lbs';
    handleSetChange(setId, 'unit', newUnit);
  };

  return (
    <div
      className="p-3 rounded"
      style={{ backgroundColor: '#555555', color: '#e8e8e8' }}
    >
      <h3
        className="font-semibold mb-2 cursor-pointer"
        onClick={onExerciseClick}
        style={{ color: '#d4af37' }}
      >
        {exercise.name}
      </h3>

      {exercise.sets?.map((set, idx) => (
        <div key={set.id} className="mb-2 text-sm flex items-center gap-2">
          <span>Set {idx + 1}:</span>
          <input
            type="number"
            inputMode="numeric"
            step="0.5"
            placeholder="0"
            value={set.weight || ''}
            onChange={(e) => handleSetChange(set.id, 'weight', e.target.value)}
            className="w-16 px-2 py-1 rounded text-center text-sm"
            style={{ backgroundColor: '#8b6f47', color: '#e8e8e8' }}
          />
          <button
            onClick={() => handleToggleUnit(set.id, set.unit)}
            className="px-2 py-1 rounded text-xs font-semibold cursor-pointer"
            style={{ backgroundColor: '#d4af37', color: '#0f0f0f' }}
          >
            {set.unit || 'lbs'}
          </button>
          <span>×</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={set.reps || ''}
            onChange={(e) => handleSetChange(set.id, 'reps', e.target.value)}
            className="w-12 px-2 py-1 rounded text-center text-sm"
            style={{ backgroundColor: '#8b6f47', color: '#e8e8e8' }}
          />
          <span>reps</span>
        </div>
      ))}

      <button
        onClick={handleAddSet}
        className="mt-2 text-sm font-semibold"
        style={{ color: '#d4af37' }}
      >
        ➕ add
      </button>
    </div>
  );
}
