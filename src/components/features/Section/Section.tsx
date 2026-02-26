import React from "react";
import styles from "./Section.module.css";

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Section: React.FC<SectionProps> = ({ title, children, className = "", headingLevel = 2 }) => {
  const HeadingTag = `h${headingLevel}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <section className={`${styles.section} ${className}`}>
      {title && (
        <header className={styles.titleWrapper}>
          <HeadingTag className={styles.title}>{title}</HeadingTag>
          <div className={styles.divider} />
        </header>
      )}
      {children}
    </section>
  );
};

export default Section;
