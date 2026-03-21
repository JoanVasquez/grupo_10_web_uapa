export interface FormField {
  id: string;
  label: string;
  type?: "text" | "number" | "email" | "textarea" | "select" | "password";
  placeholder?: string;
  options?: { value: string; label: string }[];
  colSpan?: 1 | 2;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  step?: number;
}