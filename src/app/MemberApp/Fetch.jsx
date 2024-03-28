import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

function Fetch({ setSelectedMonth, setAllDocuments, selectedMonth }) {
  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const documentsRef = collection(db, "memberRecords");
        const querySnapshot = await getDocs(documentsRef);

        console.log(querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })));
        setAllDocuments(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchAllDocuments();
  }, [setAllDocuments]);

  return null; // This component doesn't render anything visible
}

export default Fetch;
