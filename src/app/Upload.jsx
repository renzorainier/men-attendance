import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase.js";

function Upload() {
  const [names, setNames] = useState(["John Doe", "Jane Smith", "Alex Johnson"]);

  const uploadToFirestore = async () => {
    try {
      for (const name of names) {
        const docRef = await addDoc(collection(db, "memberRecords"), {
          name: name, // Upload each name individually
        });
        console.log("Document uploaded with ID: ", docRef.id);
      }
      setNames([]);
    } catch (error) {
      console.error("Error uploading documents: ", error);
    }
  };

  return (
    <div>
      <button onClick={uploadToFirestore}>Upload to Firestore</button>
    </div>
  );
}

export default Upload;
