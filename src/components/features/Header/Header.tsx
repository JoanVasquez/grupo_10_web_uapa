import React from "react";
import styles from "./Header.module.css";

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

const Header: React.FC<HeaderProps> = ({
  actions = [],
  avatar,
  avatarAlt = "User",
  onMenuClick,
}) => {
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuBtn}
        onClick={onMenuClick}
        aria-label="Toggle menu"
        aria-controls="main-navigation"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <div className={styles.actions}>
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={styles.iconBtn}
            onClick={action.onClick}
            aria-label={action.label}
          >
            {action.badge !== undefined && action.badge > 0 && (
              <span className={styles.badge}>{action.badge}</span>
            )}
            {action.icon}
          </button>
        ))}
        {avatar && (
          <div className={styles.avatar}>
            <img src={avatar} alt={avatarAlt} />
            <span className={styles.chevron}>▾</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
