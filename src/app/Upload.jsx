import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase.js";

function Upload() {
  const [names, setNames] = useState(["John Doe", "Jane Smith", "Alex Johnson"]);

  const uploadToFirestore = async () => {
    try {
      const docRef = await addDoc(collection(db, "memberRecords"), {
        names: names
      });
      console.log("Document uploaded with ID: ", docRef.id);
      setNames([]); // Optionally clear the list after upload
    } catch (error) {
      console.error("Error uploading document: ", error);
    }
  };

  return (
    <div>
      <button onClick={uploadToFirestore}>Upload to Firestore</button>
    </div>
  );
}

export default Upload;
AC