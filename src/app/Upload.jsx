import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase.js";

function Upload() {
  const [names, setNames] = useState([
    "Renz Pasagdan",
    "Sean Samaniego",
    "Earl Rance",
    "Vince Pasagdan",
    "Calvin Calica",
    "Vaughn Tio",
    "Sean Tio",
    "Drei Gammad",
  ]);

  const uploadToFirestore = async () => {
    try {
      for (const name of names) {
        const data = {}; // Create an object to hold field values
        for (let i = 1; i <= 52; i++) {
          data[String(i)] = ""; // Add fields "1" to "52" with empty values
        }

        const docRef = doc(db, "memberRecords", name);
        await setDoc(docRef, data);
        console.log("Document with ID '" + name + "' created.");
      }
      setNames([]);
    } catch (error) {
      console.error("Error creatisng dodcumsssents: ", error);
    }
  };

  return (
    <div>
      <button onClick={uploadToFirestore}>Upload to sFirestore</button>
    </div>
  );
}

export default Upload;
