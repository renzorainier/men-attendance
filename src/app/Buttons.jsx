import React, { useState, useEffect } from "react"
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase.js";

// use this for firebase (const docRef = doc(db, "memberRecords", name);)

function Buttons(props) {
  const [selectedNames, setSelectedNames] = useState([]);

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

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold bg-gray-100 p-5 rounded-md shadow-lg mb-4">
        Members:
      </h2>
      <div className="flex flex-col gap-2 w-full"> {/* Container for buttons */}
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
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl">
            Button to Upload to firebase
          </button>

        </div>
      </div>
      <p>Current Week Number: {currentWeekNumber}</p>

    </div>
  );
}

export default Buttons;

{/* <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl">
Button 2
</button> */}








// {selectedNames.length > 0 && (
//   <>
//     <h3>Selected Names:</h3>
//     <ul>
//       {selectedNames.map((name, index) => (
//         <li key={index}> {name} </li>
//       ))}
//     </ul>
//   </>
// )}
