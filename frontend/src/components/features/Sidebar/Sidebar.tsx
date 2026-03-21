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

  const navItems = (
    <ul className="space-y-2">
      {NAV_ITEMS.map((item) => (
        <li key={item.href}>
          <NavLink
            to={item.href}
            end={item.href === "/dashboard"}
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
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 sm:h-11 sm:w-11">
              <span className="text-current [&_*]:!text-current [&_*]:stroke-current [&_*]:fill-current">
                {item.icon}
              </span>
            </span>

            <span className="min-w-0 text-sm font-semibold sm:text-[0.98rem]">{item.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );

  const navContent = (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div className="border-b border-white/10 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-lg sm:h-20 sm:w-20">
            <div className="text-white">
              <SettingsLogo />
            </div>
          </div>

          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-slate-400">
            Navegación
          </p>

          <h2 className="mt-2 break-words text-xl font-extrabold uppercase tracking-[0.18em] text-white sm:text-[1.8rem]">
            {title}
          </h2>
        </div>
      </div>

      <nav id="main-navigation" className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5" aria-label="Main navigation">
        {navItems}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="text-center text-xs leading-5 text-slate-400">Administra productos y consulta tu inventario.</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed left-0 top-0 hidden h-screen w-[250px] border-r border-slate-800 bg-slate-950 lg:w-[270px] md:block">
        {navContent}
      </aside>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
          onClick={onClose}
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={[
          "fixed left-0 top-0 z-50 h-screen w-[88vw] max-w-[340px]",
          "border-r border-slate-800 shadow-2xl md:hidden",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Sidebar"
      >
        {navContent}
      </aside>
    </>
  );
};

export default Sidebar;
