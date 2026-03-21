import React, { useEffect, useState } from "react";
import { DynamicForm } from "../../index";
import { FormField } from "../../../types/FormField";
import { Auth } from "../../../types/User";
import { validate } from "../../../utils/validation";
import { useLoginMutation } from "../../../stores/slices/api/authApi";
import { Login } from "../../../types/Response";
import { useNavigate } from "react-router-dom";
import { Alert } from "../../index";

const SIGNIN_FIELDS: FormField[] = [
  { id: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
  { id: "password", label: "Password", type: "password", placeholder: "••••••••", required: true, minLength: 6 },
];

const INITIAL_VALUES: Auth = { email: "", password: "" };

const SignIn: React.FC = () => {
  const [values, setValues] = useState<Auth>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof Auth, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [login] = useLoginMutation();
  const navigate = useNavigate();

  const handleChange = <K extends keyof Auth>(id: K, value: Auth[K]) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    const error = validate(id, value, SIGNIN_FIELDS);
    setErrors((prev) => ({ ...prev, [id]: error }));
    setSubmitError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof Auth, string>> = {};
    (Object.keys(values) as Array<keyof Auth>).forEach((key) => {
      const error = validate(key, values[key], SIGNIN_FIELDS);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const response: Login = await login(values).unwrap();
        localStorage.setItem('token', response._data.token)
        handleReset();
        navigate('/dashboard', { replace: true });
      } catch (error) {
        const data =
          typeof error === "object" && error !== null && "data" in error ? error.data : undefined;
        const message =
          typeof data === "object" && data !== null && "_message" in data ? data._message : undefined;

        setSubmitError(typeof message === "string" ? message : "No se pudo iniciar sesión.");
      }
    }
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="space-y-4">
      <Alert message={submitError} variant="error" />

      <DynamicForm
        fields={SIGNIN_FIELDS}
        handleChange={handleChange}
        onSubmit={handleSubmit}
        onReset={handleReset}
        submitLabel="Sign In"
        resetLabel="Clear"
        ariaLabel="Sign in form"
        values={values}
        errors={errors}
        columns={1}
      />
    </div>
  );
};

export default SignIn;
