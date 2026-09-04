import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WorkoutContext } from '../context/WorkoutContext';
import ExerciseForm from '../components/ExerciseForm';
import ExerciseDisplay from '../components/ExerciseDisplay';
import AddCategoryModal from '../components/modals/AddCategoryModal';
import MoveExerciseModal from '../components/modals/MoveExerciseModal';

export default function DayDetail() {
  const navigate = useNavigate();
  const { weekKey, dayName } = useParams();
  const { state, dispatch } = useContext(WorkoutContext);
  
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [addingExerciseCategory, setAddingExerciseCategory] = useState(null);

  const weekData = state.weeks[weekKey] || { days: {} };
  const dayData = weekData.days[dayName] || { categories: [], exercises: {} };
  const categories = dayData.categories || [];
  const exercises = dayData.exercises || {};

  const handleDeleteCategory = (category) => {
    if (window.confirm(`Delete ${category}? All exercises in this category will be deleted.`)) {
      dispatch({
        type: 'REMOVE_CATEGORY',
        payload: { weekKey, dayName, category },
      });
    }
  };

  const handleAddExercise = (category, exerciseName) => {
    dispatch({
      type: 'ADD_EXERCISE',
      payload: { weekKey, dayName, category, exerciseName },
    });
    setAddingExerciseCategory(null);
  };

  const getLastCategoryWorkout = (category) => {
    let latestWeek = null;
    let latestDay = null;
    let latestWeekKey = null;

    const allWeeks = Object.entries(state.weeks).sort(([a], [b]) => new Date(b) - new Date(a));

    for (const [wk, wd] of allWeeks) {
      if (wk === weekKey) continue;

      for (const [day, dd] of Object.entries(wd.days)) {
        if (dd.exercises && Object.values(dd.exercises).some(ex => ex.category === category)) {
          latestWeek = wk;
          latestDay = day;
          latestWeekKey = wk;
          break;
        }
      }

      if (latestWeek) break;
    }

    return latestWeek ? { week: latestWeek, day: latestDay, weekKey: latestWeekKey } : null;
  };

  const handleImport = (category) => {
    const lastWorkout = getLastCategoryWorkout(category);
    if (lastWorkout) {
      dispatch({
        type: 'IMPORT_DAY',
        payload: {
          fromWeekKey: lastWorkout.weekKey,
          fromDayName: lastWorkout.day,
          toWeekKey: weekKey,
          toDayName: dayName,
          categories: [category],
        },
      });
    }
  };

  const exercisesByCategory = {};
  categories.forEach(cat => {
    exercisesByCategory[cat] = Object.values(exercises).filter(ex => ex.category === cat);
  });

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#b87333' }}>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-2xl font-bold mb-2"
          style={{ color: '#d4af37' }}
        >
          ←
        </button>
        <h1 className="text-xl font-bold" style={{ color: '#d4af37' }}>
          {dayName.toUpperCase()} {new Date(weekKey).getDate()}
        </h1>
      </div>

      {/* Import suggestions */}
      {categories.map(cat => {
        const lastWorkout = getLastCategoryWorkout(cat);
        if (lastWorkout) {
          return (
            <div
              key={cat}
              className="mb-4 p-3 rounded"
              style={{ backgroundColor: '#8b6f47', color: '#e8e8e8' }}
            >
              <p className="text-sm mb-2">
                💡 Last {cat}: {lastWorkout.day}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleImport(cat)}
                  className="px-3 py-1 rounded text-sm font-semibold"
                  style={{ backgroundColor: '#d4af37', color: '#0f0f0f' }}
                >
                  Import
                </button>
              </div>
            </div>
          );
        }
        return null;
      })}

      {/* Categories and Exercises */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold" style={{ color: '#d4af37' }}>
                {category}
              </h2>
              <button
                onClick={() => handleDeleteCategory(category)}
                className="text-sm"
                style={{ color: '#d4af37' }}
              >
                ✕
              </button>
            </div>

            {/* Exercises in category */}
            {exercisesByCategory[category]?.map((exercise) => (
              <div key={exercise.id} className="mb-4">
                <ExerciseDisplay
                  exercise={exercise}
                  weekKey={weekKey}
                  dayName={dayName}
                  onExerciseClick={() => {
                    setSelectedExerciseId(exercise.id);
                    setShowMoveModal(true);
                  }}
                />
              </div>
            ))}

            {/* Add Exercise Button */}
            {addingExerciseCategory === category ? (
              <ExerciseForm
                category={category}
                onSave={(exerciseName) => handleAddExercise(category, exerciseName)}
                onCancel={() => setAddingExerciseCategory(null)}
              />
            ) : (
              <button
                onClick={() => setAddingExerciseCategory(category)}
                className="w-full py-2 rounded font-semibold mb-4"
                style={{ backgroundColor: '#8b6f47', color: '#d4af37' }}
              >
                🏋️ Add Exercise
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Category Button */}
      <button
        onClick={() => setShowAddCategoryModal(true)}
        className="mt-6 py-2 rounded font-semibold text-sm"
        style={{ backgroundColor: '#8b6f47', color: '#d4af37' }}
      >
        ➕ Add Category
      </button>

      {/* Modals */}
      {showAddCategoryModal && (
        <AddCategoryModal
          dayName={dayName}
          weekKey={weekKey}
          onClose={() => setShowAddCategoryModal(false)}
        />
      )}
      {showMoveModal && selectedExerciseId && (
        <MoveExerciseModal
          exerciseId={selectedExerciseId}
          weekKey={weekKey}
          dayName={dayName}
          currentCategory={exercises[selectedExerciseId]?.category}
          onClose={() => {
            setShowMoveModal(false);
            setSelectedExerciseId(null);
          }}
        />
      )}
    </div>
  );
}
