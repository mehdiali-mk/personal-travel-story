import React from "react";

export default function EmptyCard({ imgSrc, message }) {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div
        className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-primary"
        style={{ backgroundColor: "#e9fcff" }}
      >
        <img src={imgSrc} alt="No Notes" className="w-10" />
      </div>
      <p className="w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5">
        {message}
      </p>
    </div>
  );
}
