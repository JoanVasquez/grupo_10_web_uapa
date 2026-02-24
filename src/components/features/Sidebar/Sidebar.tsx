import React from "react";
import styles from "./Sidebar.module.css";
import { SettingsLogo } from "../../../utils/IconsConfig";
import { NAV_ITEMS } from "../../../utils/iconsData";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  title: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ title, isOpen = true, onClose }) => {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} aria-hidden="true" />}
      <aside className={`${styles.aside} ${isOpen ? styles.open : ""}`} aria-label="Sidebar">
        <div className={styles.brand}>
          <div className={styles.logo}>
            <SettingsLogo />
          </div>
          <span className={styles.title}>{title}</span>
        </div>
        <nav id="main-navigation" className={styles.nav} aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.active}` : `${styles.navItem}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
