import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore"; // Change: Import setDoc
import { db } from "./firebase.js";

function Upload() {
  const [names, setNames] = useState(["John Doe", "Jane Smith", "Alex Johnson"]);

  const uploadToFirestore = async () => {
    try {
      for (const name of names) {
        const docRef = doc(db, "memberRecords", name); // Get a document reference with the name as ID
        await setDoc(docRef, {}); // Create an empty document
        console.log("Document with ID '" + name + "' created.");
      }
      setNames([]);
    } catch (error) {
      console.error("Error creating documents: ", error);
    }
  };

  return (
    <div>
      <button onClick={uploadToFirestore}>Upload to Firestore</button>
    </div>
  );
}

export default Upload;
