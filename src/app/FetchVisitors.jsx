import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function FetchVisitors({ selectedMonth, setSelectedMonth }) {
  const [allDocuments, setAllDocuments] = useState([]);
  const [monthWeeks, setMonthWeeks] = useState([]);


  function getFirstSundayOfMonth(date) {
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const offset = firstOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
    return new Date(firstOfMonth.setDate(1 - offset));
  }

  useEffect(() => {
    const FetchVisitorsAllDocuments = async () => {
      try {
        const documentsRef = collection(db, "visitors");
        const querySnapshot = await getDocs(documentsRef);

        setAllDocuments(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (error) {
        console.error("Error FetchVisitorsing data from Firestore:", error);
      }
    };

    FetchVisitorsAllDocuments();
  }, []);

  useEffect(() => {
    if (allDocuments.length > 0) {
      const currentDate = new Date(); // Get the current date
      const currentYear = currentDate.getFullYear();

      const monthStart = new Date(currentYear, selectedMonth, 1);
      const monthEnd = new Date(currentYear, selectedMonth + 1, 0);

      const monthWeeks = createEmptyWeeks(monthStart, monthEnd);
      populateWeeksWithAttendance(monthWeeks, allDocuments, currentYear);

      setMonthWeeks(monthWeeks);
    }
  }, [allDocuments, selectedMonth]);

  // Helper Functions
  function createEmptyWeeks(monthStart, monthEnd) {
    const weeks = [];
    let weekStart = getFirstSundayOfMonth(monthStart);

    while (weekStart <= monthEnd) {
      if (
        weekStart.getDay() === 0 &&
        weekStart.getMonth() === monthStart.getMonth()
      ) {
        const weekEnd = new Date(weekStart.getTime());
        weekEnd.setDate(weekStart.getDate() + 6);

        weeks.push({
          startDate: new Date(weekStart.getTime()),
          endDate: weekEnd,
          weekNumber: getWeekNumber(weekStart),
          members: [],
        });
      }

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
    documents.forEach((doc) => {
      const memberName = doc.id;
      const attendanceData = doc; // Access attendance data directly

      for (const weekNumber in attendanceData) {
        if (attendanceData[weekNumber] === true) {
          const weekIndex = weeks.findIndex(
            (week) => week.weekNumber === parseInt(weekNumber)
          );

          if (weekIndex !== -1) {
            weeks[weekIndex].members.push(memberName);
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



  const renderTable = () => {
    return (
      <div className="mt-8 overflow-x-auto shadow-lg rounded-lg">
        <table className="table-auto w-full min-w-max border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-4 text-left text-gray-800">Visitors</th>
              {monthWeeks.map((week) => (
                <th key={week.weekNumber} className="px-6 py-4 text-center text-gray-800">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold mt-1">
                      {getSundayOfWeek(week.startDate).getDate()}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allDocuments
              .filter((member) =>
                monthWeeks.some((week) => week.members.includes(member.id))
              )
              .map((member, index) => (
                <tr key={member.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="border px-6 py-3 font-medium">{member.id}</td>
                  {monthWeeks.map((week) => (
                    <td
                      key={week.weekNumber}
                      className={`border px-6 py-3 text-center ${week.members.includes(member.id) ? 'bg-green-500 text-white' : ''}`}
                    >
                      {member.attendance?.[week.weekNumber] && (
                        <span className="text-lg">✓</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };


  return (
    <div className="container mx-auto pt-5">
      {renderTable()}
    </div>
  );
}

export default FetchVisitors;
