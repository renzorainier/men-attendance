import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase.js";

function Fetch() {
  const [memberNames, setMemberNames] = useState([]); // State to store names

  useEffect(() => {
    const fetchNames = async () => {
      // Use a more descriptive function name
      try {
        const wordRef = doc(db, "men", "members"); // Adjust if needed
        const wordDoc = await getDoc(wordRef);

        if (wordDoc.exists()) {
          const data = wordDoc.data();
          setMemberNames(data.names); // Update state with fetched names
          console.log(data);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchNames();
  }, []);

  return (
    <div>
      {memberNames.length > 0 ? (
        <ul>
          {memberNames.map((name, index) => (
            <li key={index}> {name} </li>
          ))}
        </ul>
      ) : (
        <div>Loading names...</div>
      )}
    </div>
  );
}

export default Fetch;
