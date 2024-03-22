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
    <div className="">
     <h2>Members:</h2>
      <div className="flex flex-col gap-2">
        {props.memberNames.map((name, index) => (
          <button
            key={index}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded mx-10
              ${selectedNames.includes(name) ? 'bg-gray-500' : ''}
              text-lg sm:text-xl md:text-2xl`} // Responsive text sizes
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
