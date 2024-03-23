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

  const addVisitor = async () => {
    if (newVisitorName.trim() !== "") {
      try {
        const docRef = await setDoc(doc(db, "visitors", newVisitorName), {
          name: newVisitorName,
        });
        setVisitors([...visitors, { id: docRef.id, name: newVisitorName }]);
        setNewVisitorName("");
        console.log("Visitor added with ID: ", docRef.id);
      } catch (error) {
        // console.error("Error adding visitor: ", error);
      }
    }
  };


  
}

export default Visitors;




// return (
//     <div className="flex flex-col items-center">
//       <h2 className="text-2xl font-semibold bg-gray-100 p-5 rounded-md shadow-lg mb-4">
//         Visitors:
//       </h2>

//       <div className="flex flex-col gap-2 w-full">
//         <ul>
//           {visitors.map((visitor) => (
//             <li key={visitor.id}>{visitor.name}</li>
//           ))}
//         </ul>
//       </div>

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