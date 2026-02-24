export interface FormField {
  id: string;
  label: string;
  type?: "text" | "number" | "email" | "textarea" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
  colSpan?: 1 | 2;
}
