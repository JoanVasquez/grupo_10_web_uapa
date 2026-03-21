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
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="flex cursor-pointer flex-col gap-[5px] rounded-lg border-none bg-slate-100 p-2 md:hidden"
            onClick={onMenuClick}
            aria-label="Toggle menu"
            aria-controls="main-navigation"
          >
            <span aria-hidden="true" className="block h-[2px] w-[22px] rounded-sm bg-[#1e2d47]" />
            <span aria-hidden="true" className="block h-[2px] w-[22px] rounded-sm bg-[#1e2d47]" />
            <span aria-hidden="true" className="block h-[2px] w-[22px] rounded-sm bg-[#1e2d47]" />
          </button>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400 sm:text-xs">Sesión activa</p>
            <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">{displayName}</p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:gap-2.5 md:w-auto md:flex-nowrap">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-[1.05rem] text-slate-500 transition-[background,color,border-color] duration-150 hover:border-slate-300 hover:bg-slate-100 hover:text-[#1e2d47]"
              onClick={action.onClick}
              aria-label={action.label}
            >
              {action.badge !== undefined && action.badge > 0 && (
                <span className="absolute right-[2px] top-[2px] flex h-4 min-w-4 items-center justify-center rounded-full border-[1.5px] border-white bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                  {action.badge}
                </span>
              )}
              {action.icon}
            </button>
          ))}

          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex-initial sm:min-w-[220px]">
            {avatar && (
              <img src={avatar} alt={avatarAlt} className="h-[34px] w-[34px] shrink-0 rounded-full border-2 border-slate-200 object-cover" />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{displayName}</p>
              <p className="truncate text-xs text-slate-500">Cuenta autenticada</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:w-auto"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
