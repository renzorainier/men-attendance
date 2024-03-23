import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./firebase.js";

function Members() {
  const uploadTime = new Date().toLocaleString();

  const [selectedNames, setSelectedNames] = useState([]);
  const [memberNames, setMemberNames] = useState([]);
  const [currentWeekNumber, setCurrentWeekNumber] = useState(getWeekNumber());

  // Fetch member names on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      const membersSnapshot = await getDocs(collection(db, "memberRecords")); // Adjust collection name if needed
      const names = membersSnapshot.docs.map((doc) => doc.id);
      setMemberNames(names);
    };

    fetchMembers();
  }, []);

  // Handle click on a member name
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

  // Update Firebase
  const updateFirebase = async () => {
    try {
      const membersSnapshot = await getDocs(collection(db, "memberRecords"));
      const allMemberNames = membersSnapshot.docs.map((doc) => doc.id);

      for (const name of allMemberNames) {
        const docRef = doc(db, "memberRecords", name);
        const timeField = currentWeekNumber + "t";
        const uploadTime = new Date().toLocaleString();

        await updateDoc(docRef, {
          [currentWeekNumber]: selectedNames.includes(name),
          [timeField]: selectedNames.includes(name) ? uploadTime : "",
        });
      }

      setSelectedNames([]);
      console.log("Firebase documents updated successfully!");
    } catch (error) {
      console.error("Error updating Firebase documents: ", error);
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

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold bg-gray-100 p-5 rounded-md shadow-lg mb-4">
        Members:
      </h2>

      <div className="flex flex-col gap-2 w-full"> {/* Container for Members */}
        {memberNames.map((name, index) => (
          <button
            key={index}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl
              ${selectedNames.includes(name) ? "bg-gray-500" : ""}
              text-lg sm:text-xl md:text-2xl`}
            onClick={() => handleClick(name)}
          >
            {name}
          </button>
        ))}{selectedNames.length > 0 && (
          <>
            <h3>Selected Names:</h3>
            <ul>
              {selectedNames.map((name, index) => (
                <li key={index}> {name} </li>
              ))}
            </ul>
          </>
        )}


     </div>

      {/* ... (Rest of your JSX: selected names display, update button, etc.) ... */}

    </div>
  );
}

export default Members;




//  <div className="flex gap-2 justify-center">
// <button
// className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl"
// onClick={updateFirebase} // Attach the update function
// >
// Button to Upload to Firebase
// </button>



//

{/* <div className="flex flex-col gap-2 w-full">
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


</div>
</div>
<p>Current Week Number: {currentWeekNumber}</p> */}
