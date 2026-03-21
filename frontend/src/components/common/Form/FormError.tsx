import React from "react";

interface FormErrorProps {
  message?: string;
}

const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <p className="text-xs font-medium text-red-500" role="alert">
      {message}
    </p>
  );
};

export default FormError;