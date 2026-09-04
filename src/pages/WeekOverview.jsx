import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkoutContext } from '../context/WorkoutContext';
import AddCategoryModal from '../components/modals/AddCategoryModal';
import ImportWeekModal from '../components/modals/ImportWeekModal';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeekOverview() {
  const navigate = useNavigate();
  const { state, dispatch, getWeekKey, formatDateRange, getWeekRange } = useContext(WorkoutContext);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const currentWeekKey = state.currentWeekKey;
  const weekData = state.weeks[currentWeekKey] || { days: {} };

  const handlePreviousWeek = () => {
    const d = new Date(currentWeekKey);
    d.setDate(d.getDate() - 7);
    const newWeekKey = getWeekKey(d);
    dispatch({ type: 'SET_CURRENT_WEEK', payload: newWeekKey });
  };

  const handleNextWeek = () => {
    const d = new Date(currentWeekKey);
    d.setDate(d.getDate() + 7);
    const newWeekKey = getWeekKey(d);
    dispatch({ type: 'SET_CURRENT_WEEK', payload: newWeekKey });
  };

  const handleToday = () => {
    const today = new Date();
    const weekKey = getWeekKey(today);
    dispatch({ type: 'SET_CURRENT_WEEK', payload: weekKey });
  };

  const isRestDay = (dayName) => {
    const dayData = weekData.days[dayName];
    return dayData?.categories?.length === 1 && dayData.categories[0] === 'Rest';
  };

  const handleDayClick = (dayName) => {
    if (!isRestDay(dayName)) {
      navigate(`/week/${currentWeekKey}/day/${dayName}`);
    }
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#b87333' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousWeek}
            className="text-2xl font-bold"
            style={{ color: '#d4af37' }}
          >
            ←
          </button>
          <div className="text-center flex-1">
            <h1 className="text-lg font-bold" style={{ color: '#d4af37' }}>
              WEEK OF {formatDateRange(currentWeekKey).toUpperCase()}
            </h1>
          </div>
          <button
            onClick={handleNextWeek}
            className="text-2xl font-bold"
            style={{ color: '#d4af37' }}
          >
            →
          </button>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleToday}
            className="px-3 py-1 rounded text-sm font-semibold"
            style={{ backgroundColor: '#d4af37', color: '#0f0f0f' }}
          >
            Today
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-1 rounded text-sm font-semibold"
            style={{ backgroundColor: '#d4af37', color: '#0f0f0f' }}
          >
            Import Week ▼
          </button>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {DAYS.map((dayName) => {
          const dayData = weekData.days[dayName];
          const categories = dayData?.categories || [];
          const isRest = isRestDay(dayName);

          return (
            <div key={dayName}>
              <div
                onClick={() => handleDayClick(dayName)}
                className={`p-3 rounded cursor-pointer ${isRest ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ 
                  backgroundColor: isRest ? '#8b6f47' : '#555555',
                  color: '#e8e8e8'
                }}
              >
                <h2 className="text-lg font-semibold">{dayName}</h2>
              </div>
              <div className="p-3 space-x-2 flex flex-wrap items-center" style={{ backgroundColor: '#8b6f47' }}>
                {categories.length === 0 ? (
                  <button
                    onClick={() => setSelectedDay(dayName)}
                    className="text-2xl font-bold"
                    style={{ color: '#d4af37' }}
                  >
                    ➕
                  </button>
                ) : (
                  <>
                    {categories.map((cat) => (
                      <span key={cat} style={{ color: '#d4af37' }} className="font-semibold">
                        {cat}
                      </span>
                    ))}
                    <button
                      onClick={() => setSelectedDay(dayName)}
                      className="text-2xl font-bold ml-2"
                      style={{ color: '#d4af37' }}
                    >
                      ➕
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {selectedDay && (
        <AddCategoryModal
          dayName={selectedDay}
          weekKey={currentWeekKey}
          onClose={() => setSelectedDay(null)}
        />
      )}
      {showImportModal && (
        <ImportWeekModal
          currentWeekKey={currentWeekKey}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
}
