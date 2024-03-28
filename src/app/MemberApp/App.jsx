import React from 'react';
import FetchData from './FetchData';
import AttendanceTable from './AttendanceTable';

function App() {
  const { allDocuments, monthWeeks, selectedMonth, setSelectedMonth } = FetchData();

  return (
    <div>
      <AttendanceTable
        allDocuments={allDocuments}
        monthWeeks={monthWeeks}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    </div>
  );
}

export default App;
