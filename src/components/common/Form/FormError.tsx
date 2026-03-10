import React from "react";
import styles from "./FormError.module.css";

interface FormErrorProps {
  message?: string;
}

const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <span className={styles.error} role="alert">
      {message}
    </span>
  );
};

export default FormError;
