import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./firebase.js"; // Import your Firebase config

function Members() {
  const uploadTime = new Date().toLocaleString();

  const [memberNames, setMemberNames] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [currentWeekNumber, setCurrentWeekNumber] = useState(getWeekNumber());

  // Fetch data on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      const membersSnapshot = await getDocs(collection(db, "memberRecords"));
      const memberData = membersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMemberNames(memberData.map(member => member.id));
      setMemberData(memberData);
    };

    fetchMembers();
  }, []);

  // Handle click on a member name
  const handleClick = (name) => {
    const memberIndex = memberData.findIndex((m) => m.id === name);
    const updatedMemberData = [...memberData];
    updatedMemberData[memberIndex] = {
      ...updatedMemberData[memberIndex],
      [currentWeekNumber]: !updatedMemberData[memberIndex][currentWeekNumber]
    };
    setMemberData(updatedMemberData);
  };

  // Update Firebase
  const updateFirebase = async () => {
    try {
      for (const member of memberData) {
        const docRef = doc(db, "memberRecords", member.id);
        const timeField = currentWeekNumber + "t";

        await updateDoc(docRef, {
          [currentWeekNumber]: member[currentWeekNumber],
          [timeField]: member[currentWeekNumber] ? uploadTime : "",
        });
      }

      // Find the selected names
      const selectedNames = memberData.filter(member => member[currentWeekNumber]).map(member => member.id);

      console.log("Firebase documents updated successfully!");
      console.log("Selected Names:", selectedNames);
    } catch (error) {
      console.error("Error updating Firebase documents: ", error);
    }
  };

  // Week Number Calculation (same as before)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWeekNumber(getWeekNumber());
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  function getWeekNumber() {
    // ... (same week number calculation code)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-2 w-full">
        {memberNames.map((name, index) => {
          const member = memberData.find((m) => m.id === name);

          return (
            <button
              key={index}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl
                    ${member && member[currentWeekNumber] ? "bg-green-500" : "bg-gray-500"}
                    text-lg sm:text-xl md:text-2xl`}
              onClick={() => handleClick(name)}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 pt-10 justify-center">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl"
          onClick={updateFirebase}
        >
          Button to Upload to Firebase
        </button>
      </div>
    </div>
  );
}

export default Members;


//

{
  /* <div className="flex flex-col gap-2 w-full">
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
<p>Current Week Number: {currentWeekNumber}</p> */
}
