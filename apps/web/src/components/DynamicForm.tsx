"use client";

import React from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Box,
  Container,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { ZodObject, ZodTypeAny } from "zod";
import { FormField } from "@/lib/formSchema";

interface DynamicFormProps {
  fields: FormField[];
  schema: ZodObject<Record<string, ZodTypeAny>>;
  onSubmit: (data: FieldValues) => void;
  title?: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  schema,
  onSubmit,
  title = "Dynamic Form",
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: loadFormDataFromLocalStorage(fields),
    mode: "onBlur",
  });

  const onSubmitHandler: SubmitHandler<FieldValues> = (data: FieldValues) => {
    // Save to localStorage before calling the parent onSubmit
    saveFormDataToLocalStorage(data);
    onSubmit(data);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
          {title}
        </Typography>

        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Stack spacing={3}>
            {fields.map((field) => (
              <div key={field.id}>
                {field.fieldType === "TEXT" && (
                  <Controller
                    name={field.id.toString()}
                    control={control}
                    render={({ field: fieldProps }) => (
                      <TextField
                        {...fieldProps}
                        fullWidth
                        label={field.name}
                        type="text"
                        variant="outlined"
                        placeholder={field.defaultValue}
                        error={!!errors[field.id.toString()]}
                        helperText={
                          errors[field.id.toString()]?.message as string
                        }
                        required={field.required}
                        inputProps={{
                          minLength: field.minLength,
                          maxLength: field.maxLength,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                          },
                        }}
                      />
                    )}
                  />
                )}

                {field.fieldType === "LIST" && (
                  <Controller
                    name={field.id.toString()}
                    control={control}
                    render={({ field: fieldProps }) => (
                      <FormControl
                        fullWidth
                        error={!!errors[field.id.toString()]}
                      >
                        <InputLabel>{field.name}</InputLabel>
                        <Select
                          {...fieldProps}
                          label={field.name}
                          required={field.required}
                          sx={{
                            borderRadius: 1,
                          }}
                        >
                          {field.listOfValues1?.map((option, idx) => (
                            <MenuItem key={idx} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors[field.id.toString()] && (
                          <Typography
                            variant="caption"
                            sx={{ color: "error.main", mt: 0.5, display: "block" }}
                          >
                            {errors[field.id.toString()]?.message as string}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                )}

                {field.fieldType === "RADIO" && (
                  <FormControl
                    component="fieldset"
                    error={!!errors[field.id.toString()]}
                  >
                    <Typography
                      component="legend"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        mb: 1,
                        color: "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      {field.name}
                      {field.required && (
                        <span style={{ color: "#d32f2f", marginLeft: "4px" }}>
                          *
                        </span>
                      )}
                    </Typography>
                    <Controller
                      name={field.id.toString()}
                      control={control}
                      render={({ field: fieldProps }) => (
                        <RadioGroup
                          {...fieldProps}
                          row
                          sx={{
                            gap: 3,
                          }}
                        >
                          {field.listOfValues1?.map((option, idx) => (
                            <FormControlLabel
                              key={idx}
                              value={option}
                              control={<Radio />}
                              label={option}
                              sx={{
                                m: 0,
                              }}
                            />
                          ))}
                        </RadioGroup>
                      )}
                    />
                    {errors[field.id.toString()] && (
                      <Typography
                        variant="caption"
                        sx={{ color: "error.main", mt: 1, display: "block" }}
                      >
                        {errors[field.id.toString()]?.message as string}
                      </Typography>
                    )}
                  </FormControl>
                )}
              </div>
            ))}
          </Stack>

          <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 1.2,
                fontWeight: 600,
                borderRadius: 1,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              Submit
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => reset()}
              sx={{
                px: 4,
                py: 1.2,
                fontWeight: 600,
                borderRadius: 1,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              Reset
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

/**
 * Load form data from localStorage
 */
export const loadFormDataFromLocalStorage = (
  fields: FormField[]
): Record<string, string> => {
  if (typeof window === "undefined") return {};

  const saved = localStorage.getItem("formData");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  }

  // Return default values
  const defaults: Record<string, string> = {};
  fields.forEach((field) => {
    defaults[field.id.toString()] = field.defaultValue || "";
  });
  return defaults;
};

/**
 * Save form data to localStorage
 */
export const saveFormDataToLocalStorage = (
  data: FieldValues
): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("formData", JSON.stringify(data));
};
