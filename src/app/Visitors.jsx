import React, { useState, useEffect } from "react";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./firebase.js"; // Assuming you have your Firebase setup

function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [newVisitorName, setNewVisitorName] = useState("");

  // Fetch visitors on component mount
  useEffect(() => {
    const fetchVisitors = async () => {
      const visitorsSnapshot = await getDocs(collection(db, "visitors"));
      const visitorList = visitorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVisitors(visitorList);
    };

    fetchVisitors();
  }, []);

  const handleInputChange = (event) => {
    setNewVisitorName(event.target.value);
  };


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

  const addVisitor = async () => {
    if (newVisitorName.trim() !== "") {
      try {
        const docRef = await setDoc(doc(db, "visitors", newVisitorName), {
          [currentWeekNumber]: true,
        });

        console.log("docRef:", docRef); // For debugging

        // Small delay for potential network/Firestore delays
        await new Promise(resolve => setTimeout(resolve, 500));

        setVisitors([...visitors, { id: docRef.id, name: newVisitorName }]);
        setNewVisitorName("");
        console.log("Visitor added with ID: ", docRef.id);
      } catch (error) {
        console.error("Error asdding visitor: ", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold bg-gray-100 p-5 rounded-md shadow-lg mb-4">
        Visitors:
      </h2>

      <div className="flex flex-col gap-2 w-full">
        <ul>
          {visitors.map((visitor) => (
            <li key={visitor.id}>{visitor.name}</li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2 justify-center">
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




// return (
//     <div className="flex flex-col items-center">
//

//       <div className="flex gap-2 justify-center">
//         <input
//           type="text"
//           value={newVisitorName}
//           onChange={handleInputChange}
//           placeholder="Enter visitor name"
//           className="border border-gray-400 rounded p-2"
//         />
//         <button
//           className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//           onClick={addVisitor}
//         >
//           Add Visitor
//         </button>
//       </div>
//     </div>
//   );