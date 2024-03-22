import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase.js";

function Upload() {
  const [names, setNames] = useState([]);

  const uploadToFirestore = async () => {
    try {
      const docRef = await addDoc(collection(db, "memberRecords"), {
        names: names
      });
      console.log("Document uploaded with ID: ", docRef.id);
      setNames([]);
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
