import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";

function Fetch() {
  const [allDocuments, setAllDocuments] = useState([]);

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const documentsRef = collection(db, "memberRecords"); // Replace 'yourCollectionName'
        const querySnapshot = await getDocs(documentsRef);

        const fetchedDocuments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setAllDocuments(fetchedDocuments);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchAllDocuments();
  }, []);

  // Here's where you'll utilize the 'allDocuments' array
  useEffect(() => {
    if (allDocuments.length > 0) {
      // Do something with all the fetched documents.
      console.log("All Documents Fetched:", allDocuments);

      // Here are some examples of what you can do:
      // - Store them in a global state (Context API or State Management Library)
      // - Pass them to another function for processing
      // - Trigger other operations based on the data
    }
  }, [allDocuments]);

  return (
    <div>
      {/* UI to display loading state while documents are being fetched */}
      {allDocuments.length === 0 ? <p>Loading...</p> : null}
    </div>
  );
}

export default Fetch;
