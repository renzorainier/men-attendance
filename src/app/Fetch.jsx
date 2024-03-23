import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

function Fetch() {
  const [allDocuments, setAllDocuments] = useState([]);
  const [monthWeeks, setMonthWeeks] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Initial value: current month

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const documentsRef = collection(db, "memberRecords");
        const querySnapshot = await getDocs(documentsRef);

        setAllDocuments(querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
        console.log(data);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchAllDocuments();
  }, []);

  useEffect(() => {
    if (allDocuments.length > 0) {
      const currentDate = new Date(); // Get the current date
      const currentYear = currentDate.getFullYear();

      const monthStart = new Date(currentYear, selectedMonth, 1);
      const monthEnd = new Date(currentYear, selectedMonth + 1, 0);

      const monthWeeks = createEmptyWeeks(monthStart, monthEnd);
      populateWeeksWithAttendance(monthWeeks, allDocuments, currentYear);

      console.log("Fetched Documents:", allDocuments); // You likely don't need this line here anymore
      console.log("Processed Month Weeks:", monthWeeks); // Or this one

      setMonthWeeks(monthWeeks);
    }
  }, [allDocuments, selectedMonth]); // Include selectedMonth in the dependencies

  // Helper Functions
  function createEmptyWeeks(monthStart, monthEnd) {
    const weeks = [];
    let weekStart = new Date(monthStart.getTime());

    console.log(weekStart)

    while (weekStart.getMonth() === monthStart.getMonth()) {
      weeks.push({
        startDate: new Date(weekStart.getTime()),
        endDate: new Date(weekStart.getTime()).setDate(weekStart.getDate() + 6),
        weekNumber: getWeekNumber(weekStart),
        members: []
      });

      weekStart.setDate(weekStart.getDate() + 7);
    }

    return weeks;
  }

  function getWeekNumber(date) {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const daysSinceOneJan = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((date.getDay() + 1 + daysSinceOneJan) / 7);
  }

  function populateWeeksWithAttendance(weeks, documents, year) {
    documents.forEach(doc => {
      const memberName = doc.id;
      const attendanceData = doc; // Access attendance data directly

      for (const weekNumber in attendanceData) {
        if (attendanceData[weekNumber] === true) {
          const weekIndex = weeks.findIndex(week => week.weekNumber === parseInt(weekNumber));

          if (weekIndex !== -1) {
            weeks[weekIndex].members.push({ id: memberName, name: memberName });
          }
        }
      }
    });
  }


  function getSundayOfWeek(weekStartDate) {
    const sunday = new Date(weekStartDate.getTime());
    sunday.setDate(sunday.getDate() - sunday.getDay()); // Get the Sunday of the week
    return sunday;
  }
  return (
    <div className="container mx-auto p-8">
    <div className="mb-4"> {/* Container for the month selector */}
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
          {Array.from({length: 12}, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

   {monthWeeks.map((week, index) => (
        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl shadow-lg p-6 mb-6" key={index}>
          <div className="flex items-center">

            <h3 className="text-2xl font-bold text-white mr-4">
              {getSundayOfWeek(week.startDate).getDate()}
            </h3>
            <span className="bg-gray-200 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
              {week.weekNumber}
            </span>
          </div>
          <ul className="list-disc list-inside text-white mt-4">
            {week.members.map(member => (
              <li className="font-medium mb-2" key={member.id}>{member.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );


}

export default Fetch;
