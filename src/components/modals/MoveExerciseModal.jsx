import React, { useContext, useState } from 'react';
import { WorkoutContext } from '../../context/WorkoutContext';

export default function MoveExerciseModal({
  exerciseId,
  weekKey,
  dayName,
  currentCategory,
  onClose,
}) {
  const { state, dispatch } = useContext(WorkoutContext);
  const [action, setAction] = useState(null);
  const [newCategory, setNewCategory] = useState(currentCategory);

  const weekData = state.weeks[weekKey];
  const dayData = weekData?.days[dayName];
  const availableCategories = dayData?.categories.filter(cat => cat !== currentCategory) || [];

  const handleDelete = () => {
    if (window.confirm('Delete this exercise?')) {
      dispatch({
        type: 'DELETE_EXERCISE',
        payload: { weekKey, dayName, exerciseId },
      });
      onClose();
    }
  };

  const handleMove = () => {
    if (newCategory && newCategory !== currentCategory) {
      dispatch({
        type: 'MOVE_EXERCISE',
        payload: { weekKey, dayName, exerciseId, newCategory },
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="rounded-lg p-6 w-80"
        style={{ backgroundColor: '#b87333' }}
      >
        {action === null && (
          <>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#d4af37' }}>
              Exercise Options
            </h2>

            <div className="space-y-2">
              <button
                onClick={() => setAction('delete')}
                className="w-full p-3 rounded text-left"
                style={{ backgroundColor: '#555555', color: '#e8e8e8' }}
              >
                🗑️ Delete
              </button>
              {availableCategories.length > 0 && (
                <button
                  onClick={() => setAction('move')}
                  className="w-full p-3 rounded text-left"
                  style={{ backgroundColor: '#555555', color: '#e8e8e8' }}
                >
                  ➜ Move to Category
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full mt-4 py-2 rounded font-semibold"
              style={{ backgroundColor: '#d4af37', color: '#0f0f0f' }}
            >
              Cancel
            </button>
          </>
        )}

        {action === 'delete' && (
          <>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#d4af37' }}>
              Delete Exercise?
            </h2>
            <p className="mb-4" style={{ color: '#e8e8e8' }}>
              This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="flex-1 py-2 rounded font-semibold"
                style={{ backgroundColor: '#d4af37', color: '#0f0f0f' }}
              >
                Delete
              </button>
              <button
                onClick={() => setAction(null)}
                className="flex-1 py-2 rounded font-semibold"
                style={{ backgroundColor: '#555555', color: '#d4af37', border: '1px solid #d4af37' }}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {action === 'move' && (
          <>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#d4af37' }}>
              Move to category:
            </h2>
            <div className="mb-4 space-y-2">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNewCategory(cat)}
                  className="w-full p-2 rounded text-left text-sm"
                  style={{
                    backgroundColor: newCategory === cat ? '#d4af37' : '#555555',
                    color: newCategory === cat ? '#0f0f0f' : '#e8e8e8',
                  }}
                >
                  {newCategory === cat ? '✓ ' : '○ '}
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleMove}
                className="flex-1 py-2 rounded font-semibold"
                style={{ backgroundColor: '#d4af37', color: '#0f0f0f' }}
              >
                Move
              </button>
              <button
                onClick={() => setAction(null)}
                className="flex-1 py-2 rounded font-semibold"
                style={{ backgroundColor: '#555555', color: '#d4af37', border: '1px solid #d4af37' }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
