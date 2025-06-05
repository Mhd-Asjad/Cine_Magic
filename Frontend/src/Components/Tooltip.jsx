import React from "react";

const Tooltip = ({ value = [], children, width = "w-auto" }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={`absolute text-center mb-5 bottom-full transform -translate-x-1/2 px-3 py-2 rounded bg-gray-50 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${width} text-left z-10`}
      >
        <div className="flex space-x-2">
          {value.map((val, index) => (
            <div
              key={index}
              className="px-3 py-1 border border-black rounded"
            >
              ₹{val}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
