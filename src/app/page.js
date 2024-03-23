'use client'
import Image from "next/image";
import Main from "./Main.jsx"

export default function Home() {
  return (
    <main>
         <div className="flex justify-center pt-10  items-center">
        <div className="w-full rounded-lg mx-auto" style={{ maxWidth: "90%" }}>
        <Main/>
          </div>
        </div>

    </main>
  );
}
