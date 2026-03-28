import React from "react";

const PlaceholderAvatars = () => {
  return (
    <ul className="flex">
      <li className="h-8 w-8 rounded-full border-2 border-[#0899A3] ring-2 ring-white/10 bg-[#D3B3FF] transform hover:-translate-y-1 transition-transform"></li>
      <li className="h-8 w-8 rounded-full border-2 border-[#0899A3] ring-2 ring-white/10 bg-[#7a6def] -ml-2 transform hover:-translate-y-1 transition-transform"></li>
      <li className="h-8 w-8 rounded-full border-2 border-[#0899A3] ring-2 ring-white/10 bg-[#FFD27F] -ml-2 transform hover:-translate-y-1 transition-transform"></li>
    </ul>
  );
}

export default PlaceholderAvatars;
