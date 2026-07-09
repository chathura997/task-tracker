import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Avatar,
} from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ username, password });
      navigate("/tasks");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#F7F5EF",
      }}
    >
      {/* ================= LEFT COVER ================= */}

      <Box
        sx={{
          width: { xs: 0, md: "52%" },
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "#103B35",
          color: "white",
          p: 7,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background circles */}

        <Box
          sx={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,.03)",
            top: -120,
            right: -120,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,.02)",
            bottom: -120,
            left: -80,
          }}
        />

        {/* Logo */}

        <Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,.12)",
                width: 60,
                height: 60,
              }}
            >
              <TaskAltIcon />
            </Avatar>

            <Box>
              <Typography fontSize={30} fontWeight={700}>
                Task Tracker
              </Typography>

              <Typography color="rgba(255,255,255,.75)">
                Organize. Prioritize. Get things done.
              </Typography>
            </Box>
          </Stack>

          <Typography
            sx={{
              mt: 8,
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            Stay organized,
            <br />
            achieve more.
          </Typography>

          <Typography
            sx={{
              mt: 2,
              mb: 4,
              width: "80%",
              color: "rgba(255,255,255,.75)",
              fontSize: 20,
            }}
          >
            Task Tracker helps you manage your daily work efficiently and stay
            focused on what matters most.
          </Typography>

          <Stack spacing={4} mt={8}>
            <Feature
              icon={<CheckCircleIcon />}
              title="Create & Manage Tasks"
              text="Create, update and organize tasks easily."
            />

            <Feature
              icon={<CalendarMonthIcon />}
              title="Stay on Schedule"
              text="Never miss deadlines and priorities."
            />

            <Feature
              icon={<BarChartIcon />}
              title="Track Progress"
              text="Visualize your productivity."
            />
          </Stack>
        </Box>
      </Box>

      {/* ================= LOGIN ================= */}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: 480,
            borderRadius: 5,
            p: 5,
          }}
        >
          <Typography
            sx={{
              fontSize: 50,
              fontWeight: 800,
              mb: 1,
            }}
          >
            Welcome back
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Log in to manage your tasks
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                autoFocus
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />

              {error && <Alert severity="error">{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                size="large"
                fullWidth
                sx={{
                  bgcolor: "#184D43",
                  py: 1.8,
                  fontSize: 18,
                  borderRadius: 3,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#103B35",
                  },
                }}
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </Stack>
          </Box>

          <Typography
            sx={{
              mt: 4,
              textAlign: "center",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                color: "#184D43",
                fontWeight: 700,
              }}
            >
              Register
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

function Feature({ icon, title, text }) {
  return (
    <Stack direction="row" spacing={2}>
      <Avatar
        sx={{
          bgcolor: "rgba(255,255,255,.12)",
          width: 55,
          height: 55,
        }}
      >
        {icon}
      </Avatar>

      <Box>
        <Typography fontWeight={700}>{title}</Typography>

        <Typography
          sx={{
            color: "rgba(255,255,255,.75)",
          }}
        >
          {text}
        </Typography>
      </Box>
    </Stack>
  );
}
