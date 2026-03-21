import React from "react";

export interface HeaderAction {
  id: string;
  icon: React.ReactNode;
  badge?: number;
  onClick?: () => void;
  label: string;
}

interface HeaderProps {
  actions?: HeaderAction[];
  avatar?: string;
  avatarAlt?: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ actions = [], avatar, avatarAlt = "User", onMenuClick }) => {
  return (
    <header className="h-14 bg-white flex items-center justify-between px-6 border-b border-slate-100 sticky top-0 z-50">
      <button
        type="button"
        className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
        onClick={onMenuClick}
        aria-label="Toggle menu"
        aria-controls="main-navigation"
      >
        <span aria-hidden="true" className="block w-[22px] h-[2px] bg-[#1e2d47] rounded-sm" />
        <span aria-hidden="true" className="block w-[22px] h-[2px] bg-[#1e2d47] rounded-sm" />
        <span aria-hidden="true" className="block w-[22px] h-[2px] bg-[#1e2d47] rounded-sm" />
      </button>

      <div className="flex items-center gap-1.5 ml-auto">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="relative bg-transparent border-none cursor-pointer text-slate-500 p-2 rounded-lg flex items-center text-[1.15rem] transition-[background,color] duration-150 hover:bg-slate-100 hover:text-[#1e2d47]"
            onClick={action.onClick}
            aria-label={action.label}
          >
            {action.badge !== undefined && action.badge > 0 && (
              <span className="absolute top-[3px] right-[3px] bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-[1.5px] border-white leading-none">
                {action.badge}
              </span>
            )}
            {action.icon}
          </button>
        ))}
        {avatar && (
          <div className="flex items-center gap-1 ml-2 cursor-pointer">
            <img src={avatar} alt={avatarAlt} className="w-[34px] h-[34px] rounded-full object-cover border-2 border-slate-200" />
            <span className="text-slate-500 text-xs">▾</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
