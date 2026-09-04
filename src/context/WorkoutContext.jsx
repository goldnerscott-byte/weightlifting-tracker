import React, { createContext, useReducer, useEffect } from 'react';

export const WorkoutContext = createContext();

const CATEGORIES = ['Back', 'Biceps', 'Calves', 'Chest', 'Core', 'Glutes', 'Hamstrings', 'Quads', 'Shoulders', 'Triceps'];

const STANDARD_EXERCISES = {
  'Back': ['Barbell Rows', 'Dumbbell Rows', 'Pull-ups', 'Lat Pulldown', 'Deadlifts', 'T-Bar Rows'],
  'Biceps': ['Barbell Curls', 'Dumbbell Curls', 'Cable Curls', 'Hammer Curls', 'Preacher Curls'],
  'Calves': ['Calf Raises', 'Seated Calf Raises', 'Donkey Calf Raises'],
  'Chest': ['Bench Press', 'Incline Dumbbell Press', 'Dumbbell Press', 'Push-ups', 'Cable Flyes', 'Decline Bench Press'],
  'Core': ['Ab Wheel', 'Cable Crunches', 'Hanging Leg Raises', 'Planks', 'Decline Crunches'],
  'Glutes': ['Hip Thrusts', 'Bulgarian Split Squats', 'Leg Press', 'Glute Kickbacks'],
  'Hamstrings': ['Leg Curls', 'Romanian Deadlifts', 'Nordic Curls', 'Hamstring Machine'],
  'Quads': ['Squats', 'Leg Press', 'Leg Extensions', 'Hack Squats', 'Bulgarian Split Squats'],
  'Shoulders': ['Military Press', 'Dumbbell Press', 'Lateral Raises', 'Plate Raises', 'Shoulder Machine'],
  'Triceps': ['Rope Pushdown', 'Tricep Dips', 'Overhead Extensions', 'Skull Crushers', 'Close Grip Bench']
};

const initialState = {
  weeks: {},
  currentWeekKey: null,
};

function getWeekKey(date) {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  const firstDay = new Date(d.setDate(d.getDate() - dayOfWeek));
  return firstDay.toISOString().split('T')[0];
}

function getWeekRange(weekKey) {
  const firstDay = new Date(weekKey);
  const lastDay = new Date(firstDay);
  lastDay.setDate(lastDay.getDate() + 6);
  return { firstDay, lastDay };
}

function formatDateRange(weekKey) {
  const { firstDay, lastDay } = getWeekRange(weekKey);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const f = `${months[firstDay.getMonth()]} ${firstDay.getDate()}`;
  const l = `${months[lastDay.getMonth()]} ${lastDay.getDate()}`;
  return `${f} - ${l}`;
}

function dayOfWeekName(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(date).getDay()];
}

function workoutReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_WEEK':
      return {
        ...state,
        currentWeekKey: action.payload,
      };

    case 'ADD_CATEGORY':
      const { weekKey, dayName, category } = action.payload;
      const weekData = state.weeks[weekKey] || { days: {} };
      const dayData = weekData.days[dayName] || { categories: [], exercises: {} };
      
      if (!dayData.categories.includes(category)) {
        return {
          ...state,
          weeks: {
            ...state.weeks,
            [weekKey]: {
              days: {
                ...weekData.days,
                [dayName]: {
                  ...dayData,
                  categories: [...dayData.categories, category],
                },
              },
            },
          },
        };
      }
      return state;

    case 'REMOVE_CATEGORY':
      const { weekKey: wk, dayName: dn, category: cat } = action.payload;
      const wd = state.weeks[wk];
      if (!wd) return state;
      
      const dd = wd.days[dn];
      if (!dd) return state;

      const newExercises = { ...dd.exercises };
      Object.keys(newExercises).forEach(exId => {
        if (newExercises[exId].category === cat) {
          delete newExercises[exId];
        }
      });

      return {
        ...state,
        weeks: {
          ...state.weeks,
          [wk]: {
            days: {
              ...wd.days,
              [dn]: {
                ...dd,
                categories: dd.categories.filter(c => c !== cat),
                exercises: newExercises,
              },
            },
          },
        },
      };

    case 'ADD_EXERCISE':
      const { weekKey: wk2, dayName: dn2, category: cat2, exerciseName } = action.payload;
      const wd2 = state.weeks[wk2] || { days: {} };
      const dd2 = wd2.days[dn2] || { categories: [], exercises: {} };
      
      const exId = `ex_${Date.now()}`;
      const newExercises2 = {
        ...dd2.exercises,
        [exId]: {
          id: exId,
          name: exerciseName,
          category: cat2,
          sets: [{ id: `set_${Date.now()}`, weight: '', reps: '', unit: 'lbs' }],
        },
      };

      return {
        ...state,
        weeks: {
          ...state.weeks,
          [wk2]: {
            days: {
              ...wd2.days,
              [dn2]: {
                ...dd2,
                exercises: newExercises2,
              },
            },
          },
        },
      };

    case 'ADD_SET':
      const { weekKey: wk3, dayName: dn3, exerciseId: exId3 } = action.payload;
      const wd3 = state.weeks[wk3]?.days[dn3];
      if (!wd3 || !wd3.exercises[exId3]) return state;

      const ex3 = wd3.exercises[exId3];
      const newSets = [
        ...ex3.sets,
        { id: `set_${Date.now()}`, weight: '', reps: '', unit: ex3.sets[0]?.unit || 'lbs' },
      ];

      return {
        ...state,
        weeks: {
          ...state.weeks,
          [wk3]: {
            ...state.weeks[wk3],
            days: {
              ...state.weeks[wk3].days,
              [dn3]: {
                ...wd3,
                exercises: {
                  ...wd3.exercises,
                  [exId3]: {
                    ...ex3,
                    sets: newSets,
                  },
                },
              },
            },
          },
        },
      };

    case 'UPDATE_SET':
      const { weekKey: wk4, dayName: dn4, exerciseId: exId4, setId: sId, field, value } = action.payload;
      const wd4 = state.weeks[wk4]?.days[dn4];
      if (!wd4 || !wd4.exercises[exId4]) return state;

      const ex4 = wd4.exercises[exId4];
      const newSets4 = ex4.sets.map(s =>
        s.id === sId ? { ...s, [field]: value } : s
      );

      return {
        ...state,
        weeks: {
          ...state.weeks,
          [wk4]: {
            ...state.weeks[wk4],
            days: {
              ...state.weeks[wk4].days,
              [dn4]: {
                ...wd4,
                exercises: {
                  ...wd4.exercises,
                  [exId4]: {
                    ...ex4,
                    sets: newSets4,
                  },
                },
              },
            },
          },
        },
      };

    case 'DELETE_EXERCISE':
      const { weekKey: wk5, dayName: dn5, exerciseId: exId5 } = action.payload;
      const wd5 = state.weeks[wk5]?.days[dn5];
      if (!wd5) return state;

      const newExercises5 = { ...wd5.exercises };
      delete newExercises5[exId5];

      return {
        ...state,
        weeks: {
          ...state.weeks,
          [wk5]: {
            ...state.weeks[wk5],
            days: {
              ...state.weeks[wk5].days,
              [dn5]: {
                ...wd5,
                exercises: newExercises5,
              },
            },
          },
        },
      };

    case 'MOVE_EXERCISE':
      const { weekKey: wk6, dayName: dn6, exerciseId: exId6, newCategory } = action.payload;
      const wd6 = state.weeks[wk6]?.days[dn6];
      if (!wd6 || !wd6.exercises[exId6]) return state;

      return {
        ...state,
        weeks: {
          ...state.weeks,
          [wk6]: {
            ...state.weeks[wk6],
            days: {
              ...state.weeks[wk6].days,
              [dn6]: {
                ...wd6,
                exercises: {
                  ...wd6.exercises,
                  [exId6]: {
                    ...wd6.exercises[exId6],
                    category: newCategory,
                  },
                },
              },
            },
          },
        },
      };

    case 'IMPORT_DAY':
      const { fromWeekKey, fromDayName, toWeekKey, toDayName, categories: categoriesToImport } = action.payload;
      const sourceDay = state.weeks[fromWeekKey]?.days[fromDayName];
      if (!sourceDay) return state;

      const targetWeekData = state.weeks[toWeekKey] || { days: {} };
      const targetDayData = targetWeekData.days[toDayName] || { categories: [], exercises: {} };

      const exercisesToImport = Object.values(sourceDay.exercises).filter(ex =>
        categoriesToImport.includes(ex.category)
      );

      const importedExercises = {};
      exercisesToImport.forEach(ex => {
        const newExId = `ex_${Date.now()}_${Math.random()}`;
        importedExercises[newExId] = {
          ...ex,
          id: newExId,
          sets: ex.sets.map((s, idx) => ({
            ...s,
            id: `set_${Date.now()}_${idx}`,
          })),
        };
      });

      return {
        ...state,
        weeks: {
          ...state.weeks,
          [toWeekKey]: {
            days: {
              ...targetWeekData.days,
              [toDayName]: {
                ...targetDayData,
                exercises: importedExercises,
              },
            },
          },
        },
      };

    case 'IMPORT_WEEK':
      const { fromWeekKey: fwk, toWeekKey: twk } = action.payload;
      const sourceWeek = state.weeks[fwk];
      if (!sourceWeek) return state;

      const targetWeek = state.weeks[twk] || { days: {} };
      const daysToImport = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

      const newDays = { ...targetWeek.days };
      daysToImport.forEach(dayName => {
        const sourceDay = sourceWeek.days[dayName];
        if (sourceDay && Object.keys(sourceDay.exercises).length > 0) {
          const importedExercises = {};
          Object.values(sourceDay.exercises).forEach(ex => {
            const newExId = `ex_${Date.now()}_${Math.random()}`;
            importedExercises[newExId] = {
              ...ex,
              id: newExId,
              sets: ex.sets.map((s, idx) => ({
                ...s,
                id: `set_${Date.now()}_${idx}`,
              })),
            };
          });

          newDays[dayName] = {
            categories: sourceDay.categories,
            exercises: importedExercises,
          };
        }
      });

      return {
        ...state,
        weeks: {
          ...state.weeks,
          [twk]: {
            days: newDays,
          },
        },
      };

    case 'LOAD_FROM_STORAGE':
      return action.payload;

    default:
      return state;
  }
}

export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState, (initial) => {
    const stored = localStorage.getItem('workoutData');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return initial;
      }
    }
    return initial;
  });

  useEffect(() => {
    if (!state.currentWeekKey) {
      const today = new Date();
      const weekKey = getWeekKey(today);
      dispatch({ type: 'SET_CURRENT_WEEK', payload: weekKey });
    }
  }, [state.currentWeekKey]);

  useEffect(() => {
    localStorage.setItem('workoutData', JSON.stringify(state));
  }, [state]);

  const value = {
    state,
    dispatch,
    getWeekKey,
    getWeekRange,
    formatDateRange,
    dayOfWeekName,
    CATEGORIES,
    STANDARD_EXERCISES,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}
