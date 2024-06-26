import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import FetchVisitors from "./FetchVisitors.jsx";
import Chart from "./Chart.jsx";
import MemberList from "./MemberList.jsx";

function Fetch() {
  const [allDocuments, setAllDocuments] = useState([]);
  const [monthWeeks, setMonthWeeks] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Initial value: current month

  function getFirstSundayOfMonth(date) {
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const offset = firstOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
    return new Date(firstOfMonth.setDate(1 - offset));
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


  // Helper Functions


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

      const monthWeeks = createEmptyWeeks(monthStart, monthEnd);
      populateWeeksWithAttendance(monthWeeks, allDocuments, currentYear);

      setMonthWeeks(monthWeeks);


    }
  }, [allDocuments, selectedMonth]);


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

  // Render function for displaying table

  const renderMenu = () => {
    return (
      <div className="pt-5 ">
      <div className="mb-4 flex justify-start">
        <Menu
          as="div"
          className="relative inline-block justify-center text-center"
        >
          <div>
            <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
              <h2 className="text-4xl font-bold">
                {new Date(0, selectedMonth).toLocaleString("default", {
                  month: "long",
                })}
              </h2>
              <ChevronDownIcon
                className="-mr-1 ml-2 h-10 w-10"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute mt-2 origin-top divide-y divide-gray-100 rounded-lg bg-gradient-to-b from-gray-100 to-white shadow-xl ring-1 ring-black/5 focus:outline-none flex flex-col items-center">
              {Array.from({ length: 12 }, (_, i) => (
                <Menu.Item key={i}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      }  flex flex-col items-center group flex w-full items-center rounded-lg px-4 py-4 text-2xl font-semibold hover:bg-blue-100-100 transition-colors duration-200 `}
                      onClick={() => setSelectedMonth(i)}
                    >
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>

    );
  };

  return (
    <div>
      {renderMenu()}
      <MemberList
        allDocuments={allDocuments}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    </div>
  );
}

export default Fetch;
