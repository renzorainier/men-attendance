import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

function FetchVisitors({
  selectedMonth,
  vMonthWeeks,
  vSetMonthWeeks,
}) {
  const [allDocuments, setAllDocuments] = useState([]);
  const [noRecords, setNoRecords] = useState(false); // State to track if there are no records for the month

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

        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllDocuments(documents);

        // Check if there are no records for the selected month
        const recordsExist = documents.some((doc) =>
          Object.keys(doc).some(
            (weekNumber) => parseInt(weekNumber) >= selectedMonth * 4
          )
        );

        setNoRecords(!recordsExist);
      } catch (error) {
        console.error("Error Fetching data from Firestore:", error);
      }
    };

    FetchVisitorsAllDocuments();
  }, [selectedMonth]);

  useEffect(() => {
    if (allDocuments.length > 0) {
      const currentDate = new Date(); // Get the current date
      const currentYear = currentDate.getFullYear();

      const monthStart = new Date(currentYear, selectedMonth, 1);
      const monthEnd = new Date(currentYear, selectedMonth + 1, 0);

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

      const newVMonthWeeks = createEmptyWeeks(monthStart, monthEnd);
      populateWeeksWithAttendance(newVMonthWeeks, allDocuments, currentYear);

      vSetMonthWeeks(newVMonthWeeks);
    }
  }, [allDocuments, selectedMonth, vSetMonthWeeks]);

  // Helper Functions

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
    const membersWithAttendance = allDocuments.filter((member) =>
      vMonthWeeks.some((week) =>  week.members.includes(member.id))
    );

    if (noRecords) {
      return (
        <div className="mt-1 overflow-x-auto shadow-lg border rounded-lg p-5">
          No visitor records for this month
        </div>
      );
    }

    return (
      <div id="table" className="p-5 bg-white font-bold rounded-lg">
        <div className="overflow-x-auto  rounded-lg bg-white">
          <table className="table-auto  w-full text-center">
            <thead>
              <tr className="bg-[#61A3BA] ">
                <th
                  className="px-6 py-4 text-center text-2xl text-white "
                  style={{ width: "100px" }}>
                  Visitors
                </th>
                {vMonthWeeks.map((week) => (
                  <th
                    key={week.weekNumber}
                    className="px-6 py-4 text-center text-gray-800">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl text-white font-bold">
                        {getSundayOfWeek(week.startDate)
                          .getDate()
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {membersWithAttendance.map((member, index) => (
                <tr key={member.id}>
                  <td className="px-3 py-3 text-center">{member.id}</td>
                  {vMonthWeeks.map((week) => (
                    <td key={member.id}>
                      <div
                        key={week.weekNumber}
                        className={`px-6 py-4 m-1 rounded-lg text-center ${
                          week.members.includes(member.id)
                            ? "bg-[#61A3BA]"
                            : "bg-gray-200"
                        }`}></div>
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
      </div>
    );
  };

  return <div>{renderTable()}</div>;
}

export default FetchVisitors;
