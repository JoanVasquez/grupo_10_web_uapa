import React from "react";
import styles from "./Badge.module.css";

interface BadgeProps {
  count: number;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ count, children }) => (
  <span className={styles.wrapper}>
    {children}
    {count > 0 && <span className={styles.badge}>{count}</span>}
  </span>
);

export default Badge;
