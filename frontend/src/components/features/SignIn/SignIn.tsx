import React from "react";
import { DynamicForm } from "../../index";
import { Alert } from "../../index";
import { SIGNIN_FIELDS, useSignInForm } from "../../../hooks/useSignInForm";

const SignIn: React.FC = () => {
  const { errors, handleChange, handleReset, handleSubmit, submitError, values } = useSignInForm();

  return (
    <div className="space-y-4">
      <Alert message={submitError} variant="error" />

      <DynamicForm
        fields={SIGNIN_FIELDS}
        handleChange={handleChange}
        onSubmit={handleSubmit}
        onReset={handleReset}
        submitLabel="Iniciar sesión"
        resetLabel="Limpiar"
        ariaLabel="Formulario de inicio de sesión"
        values={values}
        errors={errors}
        columns={1}
      />
    </div>
  );
};

export default SignIn;
