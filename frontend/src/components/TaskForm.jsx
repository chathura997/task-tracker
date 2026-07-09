import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Alert,
  Stack,
  Typography,
  Paper,
} from "@mui/material";

export default function TaskForm({
  initialData,
  onSubmit,
  submitLabel = "Save",
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || "TODO",
    dueDate: initialData?.dueDate || "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      const validationErrors = err.response?.data?.errors;

      setError(
        validationErrors
          ? Object.values(validationErrors).join(", ")
          : err.response?.data?.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        p: 4,
        bgcolor: "#fff",
      }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {submitLabel}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Fill in the task details below.
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            >
              <MenuItem value="TODO">📝 To Do</MenuItem>
              <MenuItem value="IN_PROGRESS">🚀 In Progress</MenuItem>
              <MenuItem value="DONE">✅ Done</MenuItem>
            </TextField>

            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />
          </Stack>

          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                minWidth: 180,
                py: 1.4,
                borderRadius: 3,
                textTransform: "none",
                fontSize: 16,
                fontWeight: 700,
                boxShadow: "0 8px 20px rgba(25,118,210,.25)",
                transition: ".3s",

                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 24px rgba(25,118,210,.35)",
                },
              }}
            >
              {loading ? "Saving..." : submitLabel}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}
