import React, { useContext, useState } from 'react';
import { WorkoutContext } from '../../context/WorkoutContext';

export default function ImportWeekModal({ currentWeekKey, onClose }) {
  const { state, dispatch, formatDateRange } = useContext(WorkoutContext);
  const [step, setStep] = useState('choice');
  const [selectedWeek, setSelectedWeek] = useState('previous');

  const allWeeks = Object.keys(state.weeks)
    .filter(wk => wk !== currentWeekKey)
    .sort((a, b) => new Date(b) - new Date(a));

  const handleImportPrevious = () => {
    if (allWeeks.length > 0) {
      dispatch({
        type: 'IMPORT_WEEK',
        payload: {
          fromWeekKey: allWeeks[0],
          toWeekKey: currentWeekKey,
        },
      });
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  const handleImportSelected = () => {
    if (selectedWeek !== 'previous') {
      dispatch({
        type: 'IMPORT_WEEK',
        payload: {
          fromWeekKey: selectedWeek,
          toWeekKey: currentWeekKey,
        },
      });
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="rounded-lg p-6 w-80"
        style={{ backgroundColor: '#b87333' }}
      >
        {step === 'choice' && (
          <>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#d4af37' }}>
              Import from which week?
            </h2>

            <div className="space-y-3 mb-4">
              <button
                onClick={() => {
                  handleImportPrevious();
                }}
                className="w-full p-3 rounded text-left"
                style={{ backgroundColor: '#555555', color: '#e8e8e8' }}
              >
                {allWeeks.length > 0 && (
                  <>
                    <p className="font-semibold">Previous week</p>
                    <p className="text-sm" style={{ color: '#888888' }}>
                      {formatDateRange(allWeeks[0])}
                    </p>
                  </>
                )}
              </button>
              <button
                onClick={() => setStep('weekPicker')}
                className="w-full p-3 rounded text-left"
                style={{ backgroundColor: '#555555', color: '#e8e8e8' }}
              >
                <p className="font-semibold">Pick a different week</p>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 rounded font-semibold"
              style={{ backgroundColor: '#555555', color: '#d4af37', border: '1px solid #d4af37' }}
            >
              Cancel
            </button>
          </>
        )}

        {step === 'weekPicker' && (
          <>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#d4af37' }}>
              Select week to import from
            </h2>

            <div className="mb-4 max-h-64 overflow-y-auto space-y-2">
              {allWeeks.map((week) => (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className="w-full p-2 rounded text-left text-sm"
                  style={{
                    backgroundColor: selectedWeek === week ? '#d4af37' : '#555555',
                    color: selectedWeek === week ? '#0f0f0f' : '#e8e8e8',
                  }}
                >
                  {formatDateRange(week)}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleImportSelected}
                disabled={selectedWeek === 'previous'}
                className="flex-1 py-2 rounded font-semibold"
                style={{ backgroundColor: '#d4af37', color: '#0f0f0f' }}
              >
                Import
              </button>
              <button
                onClick={() => setStep('choice')}
                className="flex-1 py-2 rounded font-semibold"
                style={{ backgroundColor: '#555555', color: '#d4af37', border: '1px solid #d4af37' }}
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
