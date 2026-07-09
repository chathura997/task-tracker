import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import * as taskApi from "../api/tasks";
import TaskForm from "../components/TaskForm";

const statusConfig = {
  TODO: { label: "To Do", color: "default" },
  IN_PROGRESS: { label: "In Progress", color: "warning" },
  DONE: { label: "Done", color: "success" },
};

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    taskApi
      .getTaskById(id)
      .then((res) => setTask(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load task"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data) => {
    const response = await taskApi.updateTask(id, data);
    setTask(response.data);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;
    await taskApi.deleteTask(id);
    navigate("/tasks");
  };

  if (loading)
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="text.secondary">
          <CircularProgress />
        </Typography>
      </Container>
    );
  if (error)
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  const status = statusConfig[task.status] || statusConfig.TODO;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/tasks")}
          sx={{ mb: 2 }}
        >
          Back to Tasks
        </Button>

        <Paper
          elevation={0}
          sx={{ p: 4, border: "1px solid", borderColor: "divider" }}
        >
          {editing ? (
            <>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Edit Task
              </Typography>
              <TaskForm
                initialData={task}
                onSubmit={handleUpdate}
                submitLabel="Update Task"
              />
            </>
          ) : (
            <>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {task.title}
                </Typography>
                <Chip label={status.label} color={status.color} />
              </Stack>
              {task.description && (
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  {task.description}
                </Typography>
              )}
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Due date:</strong> {task.dueDate || "None"}
                </Typography>
                <Typography variant="body2">
                  <strong>Owner:</strong> {task.ownerUsername}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Stack>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
