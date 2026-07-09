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
import {
  AssignmentTurnedIn,
  CalendarMonth,
  PersonOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";

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
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F5EF" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/tasks")}
          sx={{ mb: 2 }}
        >
          Back to Tasks
        </Button>

        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 5,
            border: "1px solid #ECECEC",
            background: "linear-gradient(to bottom,#ffffff,#fbfbfb)",
          }}
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
              <>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: 32, md: 42 },
                        lineHeight: 1.1,
                        mb: 1,
                      }}
                    >
                      {task.title}
                    </Typography>

                    {/* <Typography color="text.secondary"sx={{ mt: 2 }}>Task Details</Typography> */}
                  </Box>

                  <Chip
                    label={status.label}
                    color={status.color}
                    sx={{
                      px: 1,
                      py: 2.5,
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  />
                </Stack>

                {task.description && (
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 4,
                      mb: 2,
                      p: 3,
                      bgcolor: "#F7F8FA",
                      borderRadius: 3,
                    }}
                  >
                    <Typography color="text.secondary">
                      {task.description}
                    </Typography>
                  </Paper>
                )}

                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  mt={4}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      flex: 1,
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid #ECECEC",
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      <CalendarMonth color="primary" />

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Due Date
                        </Typography>

                        <Typography fontWeight={700}>
                          {task.dueDate || "No due date"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      flex: 1,
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid #ECECEC",
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      <PersonOutlined color="primary" />

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Owner
                        </Typography>

                        <Typography fontWeight={700}>
                          {task.ownerUsername}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      flex: 1,
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid #ECECEC",
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      <AssignmentTurnedIn color="success" />

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>

                        <Typography fontWeight={700}>{status.label}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                    sx={{
                      px: 4,
                      py: 1.4,
                      borderRadius: 3,
                      bgcolor: "#184D43",
                    }}
                  >
                    Edit Task
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={handleDelete}
                    sx={{
                      px: 4,
                      py: 1.4,
                      borderRadius: 3,
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
