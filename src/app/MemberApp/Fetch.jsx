import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

function FetchData() {
  const [allDocuments, setAllDocuments] = useState([]);
  const [monthWeeks, setMonthWeeks] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // ... your helper functions (getFirstSundayOfMonth, createEmptyWeeks, getWeekNumber, populateWeeksWithAttendance, getSundayOfWeek) ...
  function getFirstSundayOfMonth(date) {
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const offset = firstOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
    return new Date(firstOfMonth.setDate(1 - offset));
  }

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

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const documentsRef = collection(db, "memberRecords");
        const querySnapshot = await getDocs(documentsRef);

        setAllDocuments(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchAllDocuments();
  }, []);

  useEffect(() => {
    if (allDocuments.length > 0) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();

      const monthStart = new Date(currentYear, selectedMonth, 1);
      const monthEnd = new Date(currentYear, selectedMonth + 1, 0);

      const monthWeeks = createEmptyWeeks(monthStart, monthEnd);
      populateWeeksWithAttendance(monthWeeks, allDocuments, currentYear);

      setMonthWeeks(monthWeeks);
    }
  }, [allDocuments, selectedMonth]);

  return { allDocuments, monthWeeks, selectedMonth, setSelectedMonth };
}

export default FetchData;
