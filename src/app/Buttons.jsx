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
      <div className="flex flex-wrap gap-2">
        {props.memberNames.map((name, index) => (
          <button
            key={index}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              ${selectedNames.includes(name) ? 'bg-gray-500' : ''}`} // Apply a style change if selected
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
