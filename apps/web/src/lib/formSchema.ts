import { z } from "zod";

export interface FormField {
  id: number;
  name: string;
  fieldType: "TEXT" | "LIST" | "RADIO";
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
  required?: boolean;
  listOfValues1?: string[];
}

export interface FormData {
  data: FormField[];
}

/**
 * Generate a Zod schema dynamically from JSON field definitions
 */
export const generateZodSchema = (
  fields: FormField[]
): z.ZodObject<Record<string, z.ZodTypeAny>> => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    if (field.fieldType === "TEXT") {
      let textSchema = z.string();

      if (field.minLength) {
        textSchema = textSchema.min(
          field.minLength,
          `Minimum ${field.minLength} characters required`
        );
      }

      if (field.maxLength) {
        textSchema = textSchema.max(
          field.maxLength,
          `Maximum ${field.maxLength} characters allowed`
        );
      }

      if (field.fieldType === "TEXT" && field.name.toLowerCase().includes("email")) {
        textSchema = textSchema.email("Invalid email address");
      }

      fieldSchema = field.required ? textSchema : textSchema.optional();
    } else if (field.fieldType === "LIST" || field.fieldType === "RADIO") {
      const options = field.listOfValues1 || [];
      const selectSchema = z.enum(options as [string, ...string[]]);
      fieldSchema = field.required ? selectSchema : selectSchema.optional();
    } else {
      fieldSchema = z.string().optional();
    }

    shape[field.id.toString()] = fieldSchema;
  });

  return z.object(shape);
};

/**
 * Convert form field ID to field name for display
 */
export const getFieldName = (fieldId: number, fields: FormField[]): string => {
  const field = fields.find((f) => f.id === fieldId);
  return field?.name || `Field ${fieldId}`;
};
