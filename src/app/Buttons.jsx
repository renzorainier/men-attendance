import React, { useState, useEffect } from "react"


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
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
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
            Button 1
          </button>
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl">
            Button 2
          </button>
        </div>
      </div>
      <p>Current Week Number: {currentWeekNumber}</p>

    </div>
  );
}

export default Buttons;










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
