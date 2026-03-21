import React, { useEffect, useState } from "react";
import { DynamicForm } from "../../index";
import { FormField } from "../../../types/FormField";
import { User } from "../../../types/User";
import { validate } from "../../../utils/validation";
import { useRegisterMutation } from "../../../stores/slices/api/authApi";
import { useNavigate } from "react-router-dom";

type SignUpForm = Omit<User, "id" | "is_active">;

const SIGNUP_FIELDS: FormField[] = [
  { id: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
  { id: "username", label: "Username", type: "text", placeholder: "username", required: true, minLength: 2, maxLength: 8 },
  { id: "password", label: "Password", type: "password", placeholder: "••••••••", required: true, minLength: 5 },
];

const INITIAL_VALUES: SignUpForm = { email: "", username: "", password: "" };

const SignUp: React.FC = () => {
  const [values, setValues] = useState<SignUpForm>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpForm, string>>>({});
  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  const handleChange = <K extends keyof SignUpForm>(id: K, value: SignUpForm[K]) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    const error = validate(id, value, SIGNUP_FIELDS);
    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof SignUpForm, string>> = {};
    (Object.keys(values) as Array<keyof SignUpForm>).forEach((key) => {
      const error = validate(key, values[key], SIGNUP_FIELDS);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      await register(values as User);
      handleReset();
    }
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, []);

  return (
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
  );
};

export default SignUp;