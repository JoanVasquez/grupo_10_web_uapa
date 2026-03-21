import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "../types/FormField";
import { User } from "../types/User";
import { ApiMutationError } from "../types/Response";
import { validate } from "../utils/validation";
import { useRegisterMutation } from "../stores/slices/api/authApi";

type SignUpForm = Omit<User, "id" | "is_active">;

type UseSignUpFormOptions = {
  onRegistered?: () => void;
};

export const SIGNUP_FIELDS: FormField[] = [
  { id: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
  { id: "username", label: "Username", type: "text", placeholder: "username", required: true, minLength: 2, maxLength: 8 },
  { id: "password", label: "Password", type: "password", placeholder: "••••••••", required: true, minLength: 5 },
];

const INITIAL_VALUES: SignUpForm = { email: "", username: "", password: "" };

export const useSignUpForm = ({ onRegistered }: UseSignUpFormOptions = {}) => {
  const [values, setValues] = useState<SignUpForm>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpForm, string>>>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmitError("");
  };

  const handleChange = <K extends keyof SignUpForm>(id: K, value: SignUpForm[K]) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    const error = validate(id, value, SIGNUP_FIELDS);
    setErrors((prev) => ({ ...prev, [id]: error }));
    setSubmitError("");
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
      try {
        await register(values).unwrap();
        handleReset();
        onRegistered?.();
      } catch (error: unknown) {
        const mutationError = error as ApiMutationError;
        const message = mutationError.data?._message;

        if (mutationError.status === 409) {
          setSubmitError(typeof message === "string" ? message : "Ya existe una cuenta con ese correo.");
          return;
        }

        setSubmitError("No se pudo crear la cuenta. Inténtalo de nuevo.");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
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
