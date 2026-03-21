import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  id,
  className = "",
  ...props
}) => {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <textarea
        id={id}
        className={[
          "min-h-[120px] w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition resize-y",
          "placeholder:text-slate-400",
          "focus:outline-none focus:ring-2",
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-500/20"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20",
          className,
        ].join(" ")}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />

      {error && (
        <p id={errorId} className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Textarea;