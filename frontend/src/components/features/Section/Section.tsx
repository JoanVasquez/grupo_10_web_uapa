import React from "react";
import { Card } from "../../index";

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  subtitle?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = "",
  headingLevel = 2,
  subtitle,
}) => {
  const HeadingTag = `h${headingLevel}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Card className={`p-4 sm:p-6 lg:p-8 ${className}`}>
      {(title || subtitle) && (
        <header className="mb-5 sm:mb-6">
          {title && (
            <HeadingTag className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
              {title}
            </HeadingTag>
          )}
          {subtitle && <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>}
        </header>
      )}
      {children}
    </Card>
  );
};

export default Section;
