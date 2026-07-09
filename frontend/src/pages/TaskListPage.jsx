import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  Avatar,
  Stack,
  AppBar,
  Toolbar,
  Pagination,
  Collapse,
  Paper,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import { useTaskSocket } from "../hooks/useTaskSocket";
import * as taskApi from "../api/tasks";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

export default function TaskListPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (statusFilter) params.status = statusFilter;
      const response = await taskApi.getTasks(params);
      setTasks(response.data.content);
      setTotalPages(response.data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching data on mount/filter change is the correct use of this effect
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskEvent = useCallback(() => fetchTasks(), [fetchTasks]);
  useTaskSocket(handleTaskEvent);

  const handleCreate = async (data) => {
    await taskApi.createTask(data);
    setShowForm(false);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    await taskApi.deleteTask(id);
    fetchTasks();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fb",
      }}
    >
      <AppBar
        elevation={0}
        position="sticky"
        sx={{
          bgcolor: "#1f4f46",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1100,
            width: "100%",
            mx: "auto",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            Task Tracker
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "#fff",
                color: "#1f4f46",
                fontWeight: 700,
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>

            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              <Typography fontWeight={600}>{user?.username}</Typography>

              <Typography
                variant="caption"
                sx={{
                  opacity: 0.8,
                }}
              >
                {user?.role}
              </Typography>
            </Box>

            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{
                borderRadius: 3,
                textTransform: "none",
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          py: 5,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row", xlg: "flex-end" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 4, width: "100%" }}
        >
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            displayEmpty
            sx={{
              minWidth: 220,
              bgcolor: "#fff",
              borderRadius: 3,
            }}
          >
            <MenuItem value="">All Tasks</MenuItem>
            <MenuItem value="TODO">To Do</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="DONE">Done</MenuItem>
          </Select>

          <Button
            variant={showForm ? "outlined" : "contained"}
            startIcon={showForm ? "" : <AddIcon />}
            onClick={() => setShowForm(!showForm)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              alignSelf: { xs: "stretch", sm: "auto" },
            }}
          >
            {showForm ? "Cancel" : "New Task"}
          </Button>
        </Stack>

        <Collapse in={showForm}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              mb: 4,
              bgcolor: "#fff",
            }}
          >
            <TaskForm onSubmit={handleCreate} submitLabel="Create Task" />
          </Paper>
        </Collapse>

        {loading ? (
          <Typography align="center">
            <CircularProgress />
          </Typography>
        ) : tasks.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
            }}
          >
            <Typography color="text.secondary">No tasks available.</Typography>
          </Paper>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={handleDelete} />
          ))
        )}

        {totalPages > 1 && (
          <Stack
            alignItems="center"
            sx={{
              mt: 5,
            }}
          >
            <Pagination
              page={page + 1}
              count={totalPages}
              color="primary"
              shape="rounded"
              onChange={(_, value) => setPage(value - 1)}
            />
          </Stack>
        )}
      </Container>
    </Box>
  );
}
