import React, { useState } from 'react';

function Buttons(props) {
  const [selectedNames, setSelectedNames] = useState([]);

  const handleClick = (name) => {
    const nameIndex = selectedNames.indexOf(name);

   if (nameIndex === -1) {
      // Name not in the array, add it
      setSelectedNames([...selectedNames, name]);
    } else {
      // Name already exists, remove it
      setSelectedNames([
        ...selectedNames.slice(0, nameIndex),
        ...selectedNames.slice(nameIndex + 1)
      ]);
    }
  };

  return (
    <div>
      <h2>Member Buttons:</h2>
      <div className="flex flex-col gap-2"> {/* Change to flex-col */}
        {props.memberNames.map((name, index) => (
          <button
            key={index}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold mx-10 rounded
              ${selectedNames.includes(name) ? 'bg-gray-500' : ''}`} // Add w-full for full width, and mx-4 for margin
            onClick={() => handleClick(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Display the selected names */}
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
    </div>
  );
}

export default Buttons;
