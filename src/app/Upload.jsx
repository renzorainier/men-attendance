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
        const data = {};
        for (let i = 1; i <= 52; i++) {
          data[String(i)] = "";
          data[String(i) + "t"] = "";
        }

        const docRef = doc(db, "memberRecords", name);
        await setDoc(docRef, data);
        console.log("Document with ID '" + name + "' created.");
      }
      setNames([]);
    } catch (error) {
      console.error("Error creating documents: ", error);
    }
  };

  return (
    <div>
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-10 py-2 px-4 rounded"
      onClick={uploadToFirestore}
    >
      Upload to Firestore
    </button>
  </div>
  );
}

export default Upload;
