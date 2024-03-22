import React, { useState } from "react";

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

  return (
    <div className="">
      <h2>
        <span class="text-2xl font-semibold bg-gray-100 p-2 rounded-md shadow-sm mb-4">
          Members:
        </span>
      </h2>
      <div className="flex flex-col gap-2">
        {sortedMemberNames.map((name, index) => (
          <button
            key={index}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl
              ${selectedNames.includes(name) ? "bg-gray-500" : ""}
              text-lg sm:text-xl md:text-2xl`}
            onClick={() => handleClick(name)}>
            {name}
          </button>
        ))}
        <div className="flex gap-2">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl">
            Button 1
          </button>
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl">
            Button 2
          </button>
        </div>
      </div>
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
