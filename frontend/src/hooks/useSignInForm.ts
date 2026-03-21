import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "../types/FormField";
import { Auth } from "../types/User";
import { validate } from "../utils/validation";
import { useLoginMutation } from "../stores/slices/api/authApi";
import { Login } from "../types/Response";

export const SIGNIN_FIELDS: FormField[] = [
  { id: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
  { id: "password", label: "Password", type: "password", placeholder: "••••••••", required: true, minLength: 6 },
];

const INITIAL_VALUES: Auth = { email: "", password: "" };

export const useSignInForm = () => {
  const [values, setValues] = useState<Auth>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof Auth, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [login] = useLoginMutation();
  const navigate = useNavigate();

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmitError("");
  };

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
      const response: Login = await login(values).unwrap();
      localStorage.setItem("token", response._data.token);
      localStorage.setItem("username", values.email.split("@")[0] ?? values.email);
      handleReset();
      navigate("/dashboard", { replace: true });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return {
    errors,
    handleChange,
    handleReset,
    handleSubmit,
    submitError,
    values,
  };
};
