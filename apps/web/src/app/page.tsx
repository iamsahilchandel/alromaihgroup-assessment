"use client";

import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { Box, Container, Typography, Paper, Alert } from "@mui/material";
import { DynamicForm } from "@/components/DynamicForm";
import { FormData, generateZodSchema } from "@/lib/formSchema";

const formConfig: FormData = {
  data: [
    {
      id: 1,
      name: "Full Name",
      fieldType: "TEXT",
      minLength: 1,
      maxLength: 100,
      defaultValue: "John Doe",
      required: true,
    },
    {
      id: 2,
      name: "Email",
      fieldType: "TEXT",
      minLength: 1,
      maxLength: 50,
      defaultValue: "hello@mail.com",
      required: true,
    },
    {
      id: 6,
      name: "Gender",
      fieldType: "LIST",
      defaultValue: "Male",
      required: true,
      listOfValues1: ["Male", "Female", "Others"],
    },
    {
      id: 7,
      name: "Love React?",
      fieldType: "RADIO",
      defaultValue: "Yes",
      required: true,
      listOfValues1: ["Yes", "No"],
    },
  ],
};

export default function Home() {
  const [submittedData, setSubmittedData] = useState<FieldValues | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const schema = generateZodSchema(formConfig.data);

  const handleFormSubmit = (data: FieldValues) => {
    setSubmittedData(data);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", paddingTop: "2rem" }}>
      <DynamicForm
        fields={formConfig.data}
        schema={schema}
        onSubmit={handleFormSubmit}
        title="Signup Form"
      />

      {showSuccess && (
        <Container maxWidth="sm" sx={{ mt: 2 }}>
          <Alert severity="success">
            Form submitted successfully! Data saved to localStorage.
          </Alert>
        </Container>
      )}

      {submittedData && (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={2} sx={{ p: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Submitted Data:
            </Typography>
            <Box
              component="pre"
              sx={{
                backgroundColor: "#f0f0f0",
                p: 2,
                borderRadius: 1,
                overflowX: "auto",
                fontFamily: "monospace",
                fontSize: "0.875rem",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              {JSON.stringify(submittedData, null, 2)}
            </Box>
          </Paper>
        </Container>
      )}
    </main>
  );
}
