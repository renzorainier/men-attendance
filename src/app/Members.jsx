import React, { useState, useEffect } from "react"
import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./firebase.js";

function Members() {
  const uploadTime = new Date().toLocaleString(); // Get the time of upload

  const [selectedNames, setSelectedNames] = useState([]);

  const [memberNames, setMemberNames] = useState([]);

  // Fetch member names from Firebase
  useEffect(() => {
    const fetchMembers = async () => {
      const membersSnapshot = await getDocs(collection(db, "memberRecords")); // Adjust collection name if needed
      const names = membersSnapshot.docs.map((doc) => doc.id);
      setMemberNames(names);
    };

    fetchMembers();
  }, []);

  const handleClick = (name) => {
    const nameIndex = selectedNames.indexOf(name);

    if (nameIndex === -1) {
      setSelectedNames([...selectedNames, name]);
    } else {
      setSelectedNames([
        ...selectedNames.slice(0, nameIndex),
        ...selectedNames.slice(nameIndex + 1),
      ]);
    }
  };

  const sortedMemberNames = props.memberNames.sort();
  const [currentWeekNumber, setCurrentWeekNumber] = useState(getWeekNumber());
  // Get week number
  useEffect(() => {
    // Update the week number periodically (if needed)
    const intervalId = setInterval(() => {
      setCurrentWeekNumber(getWeekNumber());
    }, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  function getWeekNumber() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  // upload to firebase
  const updateFirebase = async () => {
    try {
      const membersSnapshot = await getDocs(collection(db, "memberRecords"));
      const allMemberNames = membersSnapshot.docs.map((doc) => doc.id);

      for (const name of allMemberNames) {
        const docRef = doc(db, "memberRecords", name);
        const timeField = currentWeekNumber + "t";
        const uploadTime = new Date().toLocaleString(); // Get the time of upload

        await updateDoc(docRef, {
          [currentWeekNumber]: selectedNames.includes(name),
          [timeField]: selectedNames.includes(name) ? uploadTime : "", // Set timeField if selected
        });
      }

      setSelectedNames([]);
      console.log("Firebase documents updated successfully!");
    } catch (error) {
      console.error("Error updating Firebase documents: ", error);
    }
  };


  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-2 w-full"> {/* Container for Members */}
        {sortedMemberNames.map((name, index) => (
          <button
            key={index}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl
              ${selectedNames.includes(name) ? "bg-gray-500" : ""}
              text-lg sm:text-xl md:text-2xl`} // Remove any margin classes
            onClick={() => handleClick(name)}
          >
            {name}
          </button>
        ))}
          {/* //temporary display */}
          {selectedNames.length > 0 && (
            <>
              <h3>Selected Names:</h3>
              <ul>
                {selectedNames.map((name, index) => (
                  <li key={index}> {name} </li>
                ))}
              </ul>
            </>
          )}
           <div className="flex gap-2 justify-center">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl"
          onClick={updateFirebase} // Attach the update function
        >
          Button to Upload to Firebase
        </button>
      </div>
      </div>
      <p>Current Week Number: {currentWeekNumber}</p>

    </div>
  );
}

export default Members;

