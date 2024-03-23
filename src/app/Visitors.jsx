import React, { useState, useEffect } from "react";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./firebase.js"; // Assuming you have your Firebase setup

function Visitors() {
  // State Variables
  const [visitors, setVisitors] = useState([]); // Array for all fetched visitors
  const [recentVisitors, setRecentVisitors] = useState([]); // Array for recent visitors
  const [olderVisitors, setOlderVisitors] = useState([]); // Array for older visitors
  const [newVisitorName, setNewVisitorName] = useState(""); // Input field for new visitor
  const [currentWeekNumber, setCurrentWeekNumber] = useState(getWeekNumber());

  // Fetch existing visitors when the component loads
  useEffect(() => {
    const fetchVisitors = async () => {
      const visitorsSnapshot = await getDocs(collection(db, "visitors"));
      const visitorList = visitorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Filter recent and older visitors
      const recentWeeksThreshold = currentWeekNumber - 4;
      const recentVisitors = visitorList.filter((visitor) => {
        const highestWeek = Math.max(...Object.keys(visitor).filter(key => !isNaN(key)));
        return highestWeek >= recentWeeksThreshold;
      });
      const olderVisitors = visitorList.filter((visitor) => {
        const highestWeek = Math.max(...Object.keys(visitor).filter(key => !isNaN(key)));
        return highestWeek < recentWeeksThreshold;
      });

      setVisitors(visitorList);
      setRecentVisitors(recentVisitors);
      setOlderVisitors(olderVisitors);
    };

    fetchVisitors();
  }, [currentWeekNumber]);

  // Handle changes to the new visitor input field
  const handleInputChange = (event) => {
    setNewVisitorName(event.target.value);
  };

  // Add a new visitor to Firestore
  const addVisitor = async () => {
    if (newVisitorName.trim() !== "") {
      try {
        const docRef = await setDoc(doc(db, "visitors", newVisitorName), {
          name: newVisitorName,
          [currentWeekNumber]: true,
        });

        setVisitors([...visitors, { id: docRef.id, name: newVisitorName }]);
        setNewVisitorName("");
        console.log("Visitor added with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding visitor: ", error);
      }
    }
  };

  // Week Number Calculation
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWeekNumber(getWeekNumber());
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  function getWeekNumber() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  // Rendering
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold bg-gray-100 p-5 rounded-md shadow-lg mb-4">
        Visitors:
      </h2>

       {/* Recent Visitors Section */}
      <div className="flex flex-col gap-2 w-full">
        <h3>Recent Visitors:</h3> {/* Heading */}
        <ul>
          {recentVisitors.map((visitor) => (
            <li key={visitor.id}>{visitor.name}</li>
          ))}
        </ul>
      </div>

      {/* Older Visitors Section */}
      <div className="flex flex-col gap-2 w-full mt-4"> {/* Spacing */}
        <h3>Older Visitors:</h3> {/* Heading */}
        <ul>
          {olderVisitors.map((visitor) => (
            <li key={visitor.id}>{visitor.name}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 justify-center mt-4"> {/* Spacing */}
        <input
          type="text"
          value={newVisitorName}
          onChange={handleInputChange}
          placeholder="Enter visitor name"
          className="border border-gray-400 rounded p-2"
        />
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={addVisitor}
        >
          Add Visitor
        </button>
      </div>
    </div>
  );
}

export default Visitors;
