"use client";

import React from "react";
import Fetch from "./Fetch";
import Upload from "./Upload";
import Visitors from "./Visitors";
import Tab from "./Tab";

// import { doc, getDoc } from "/firebase/firestore";
// import { db } from "./firebase.js";

function Main() {
  return (
    <div>
      {/* <Fetch />
      <Visitors/> */}
      <Upload />
      <Tab/>
    </div>
  );
}

export default Main;
