import { FormField } from "../types/FormField";

export const validate = (field: string | number | symbol, value: unknown, config: FormField[]): string | undefined => {
    const fieldConfig = config.find(f => f.id === String(field));
    const strValue = String(value ?? "");

    if (fieldConfig?.required && !strValue.trim()) {
        return "Este campo es obligatorio";
    }

    if (fieldConfig?.minLength && strValue.length < fieldConfig.minLength) {
        return `Mínimo ${fieldConfig.minLength} caracteres`;
    }

    if (fieldConfig?.maxLength && strValue.length > fieldConfig.maxLength) {
        return `Máximo ${fieldConfig.maxLength} caracteres`;
    }

    if (fieldConfig?.type === "number" && fieldConfig.min !== undefined) {
        const numValue = Number(value);
        if (numValue < fieldConfig.min) {
            return `Mínimo ${fieldConfig.min}`;
        }
    }

    return undefined;
}