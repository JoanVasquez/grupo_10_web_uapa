import React from "react";

type AlertVariant = "success" | "error" | "info";

interface AlertProps {
  message?: string;
  variant?: AlertVariant;
}

const variantClasses: Record<AlertVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-red-200 bg-red-50 text-red-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
};

const Alert: React.FC<AlertProps> = ({ message, variant = "info" }) => {
  if (!message) return null;

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${variantClasses[variant]}`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Alert;
