import React, { useEffect } from "react";
import { SettingsLogo } from "../../common/Icons/IconsConfig";
import { NAV_ITEMS } from "../../common/Icons/iconsData";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  title: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  title,
  isOpen = false,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navContent = (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div className="border-b border-white/10 px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-lg">
            <div className="text-white">
              <SettingsLogo />
            </div>
          </div>

          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-slate-400">
            Panel
          </p>

          <h2 className="mt-2 text-[1.8rem] font-extrabold uppercase tracking-[0.18em] text-white">
            {title}
          </h2>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Main navigation">
        <ul className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onClose?.();
                  }
                }}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-200 hover:bg-white/5 hover:text-white",
                  ].join(" ")
                }
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <span className="text-current [&_*]:!text-current [&_*]:stroke-current [&_*]:fill-current">
                    {item.icon}
                  </span>
                </span>

                <span className="text-[0.98rem] font-semibold">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="text-center text-xs text-slate-400">Gestión de productos</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-[270px] border-r border-slate-800 bg-slate-950 md:block">
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
          onClick={onClose}
          aria-label="Cerrar menú"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={[
          "fixed left-0 top-0 z-50 h-screen w-[82vw] max-w-[320px]",
          "border-r border-slate-800 shadow-2xl md:hidden",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Sidebar"
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <span className="text-sm font-semibold tracking-wide text-slate-300">
            Menú
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
            aria-label="Cerrar menú lateral"
          >
            Cerrar
          </button>
        </div>

        {navContent}
      </aside>
    </>
  );
};

export default Sidebar;