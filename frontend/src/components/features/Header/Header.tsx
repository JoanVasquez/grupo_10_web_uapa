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
  userName?: string;
  onLogout?: () => void;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  actions = [],
  avatar,
  avatarAlt = "User",
  userName,
  onLogout,
  onMenuClick,
}) => {
  const displayName = userName?.trim() || "Usuario";

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-100 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex cursor-pointer flex-col gap-[5px] border-none bg-transparent p-1 md:hidden"
          onClick={onMenuClick}
          aria-label="Toggle menu"
          aria-controls="main-navigation"
        >
          <span aria-hidden="true" className="block h-[2px] w-[22px] rounded-sm bg-[#1e2d47]" />
          <span aria-hidden="true" className="block h-[2px] w-[22px] rounded-sm bg-[#1e2d47]" />
          <span aria-hidden="true" className="block h-[2px] w-[22px] rounded-sm bg-[#1e2d47]" />
        </button>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Sesión activa</p>
          <p className="text-sm font-semibold text-slate-900 sm:text-base">{displayName}</p>
        </div>
      </div>

      <div className="ml-4 flex items-center gap-1.5 sm:gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="relative flex items-center rounded-lg border-none bg-transparent p-2 text-[1.15rem] text-slate-500 transition-[background,color] duration-150 hover:bg-slate-100 hover:text-[#1e2d47]"
            onClick={action.onClick}
            aria-label={action.label}
          >
            {action.badge !== undefined && action.badge > 0 && (
              <span className="absolute right-[3px] top-[3px] flex h-4 w-4 items-center justify-center rounded-full border-[1.5px] border-white bg-red-500 text-[10px] font-bold leading-none text-white">
                {action.badge}
              </span>
            )}
            {action.icon}
          </button>
        ))}

        <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
          {avatar && (
            <img src={avatar} alt={avatarAlt} className="h-[34px] w-[34px] rounded-full border-2 border-slate-200 object-cover" />
          )}
          <div className="min-w-0">
            <p className="max-w-[180px] truncate text-sm font-semibold text-slate-800">{displayName}</p>
            <p className="text-xs text-slate-500">Cuenta autenticada</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Header;
