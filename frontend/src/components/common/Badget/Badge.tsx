import React from "react";

interface BadgeProps {
  count: number;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ count, children }) => (
  <span className="relative inline-flex">
    {children}
    {count > 0 && (
      <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-[17px] h-[17px] rounded-full flex items-center justify-center border-2 border-white leading-none">
        {count}
      </span>
    )}
  </span>
);

export default Badge;
