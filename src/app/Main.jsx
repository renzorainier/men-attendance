"use client";

import React from "react";
import Fetch from "./Fetch";
import Upload from "./Upload";

// import { doc, getDoc } from "/firebase/firestore";
// import { db } from "./firebase.js";

function Main() {
  return (
    <div>
      <Fetch />
      <Upload />
    </div>
  );
}

export default Main;
