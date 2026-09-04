import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import WeekOverview from './pages/WeekOverview';
import DayDetail from './pages/DayDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: '#b87333' }}>
        <Routes>
          <Route path="/" element={<WeekOverview />} />
          <Route path="/week/:weekKey/day/:dayName" element={<DayDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
