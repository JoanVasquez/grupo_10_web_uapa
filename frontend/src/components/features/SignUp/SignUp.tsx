import React from "react";
import { DynamicForm } from "../../index";
import { useSignUpForm, SIGNUP_FIELDS } from "../../../hooks/useSignUpForm";

type SignUpProps = {
  onRegistered?: () => void;
};

const SignUp: React.FC<SignUpProps> = ({ onRegistered }) => {
  const { errors, handleChange, handleReset, handleSubmit, submitError, values } = useSignUpForm({ onRegistered });

  return (
    <div className="space-y-4">
      {submitError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      <DynamicForm
        fields={SIGNUP_FIELDS}
        handleChange={handleChange}
        onSubmit={handleSubmit}
        onReset={handleReset}
        submitLabel="Create account"
        resetLabel="Clear"
        ariaLabel="Sign up form"
        values={values}
        errors={errors}
        columns={1}
      />
    </div>
  );
};

export default SignUp;
