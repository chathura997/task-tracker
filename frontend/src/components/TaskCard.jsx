import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EventIcon from "@mui/icons-material/Event";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";

const statusConfig = {
  TODO: {
    label: "To Do",
    color: "#1976d2",
    bg: "#E3F2FD",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "#ED6C02",
    bg: "#FFF3E0",
  },
  DONE: {
    label: "Done",
    color: "#2E7D32",
    bg: "#E8F5E9",
  },
};

export default function TaskCard({ task, onDelete }) {
  const status = statusConfig[task.status] || statusConfig.TODO;

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        borderRadius: 4,
        border: "1px solid #E5E7EB",
        transition: "all .25s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box flex={1}>
            <Typography
              component={Link}
              to={`/tasks/${task.id}`}
              sx={{
                textDecoration: "none",
                color: "text.primary",
                fontSize: 22,
                fontWeight: 700,
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              {task.title}
            </Typography>

            {task.description && (
              <Typography
                sx={{
                  mt: 1.2,
                  color: "text.secondary",
                  lineHeight: 1.7,
                }}
              >
                {task.description}
              </Typography>
            )}
          </Box>

          <Tooltip title="Delete Task">
            <IconButton
              onClick={() => onDelete(task.id)}
              sx={{
                bgcolor: "#FAFAFA",
                border: "1px solid #EEEEEE",
                "&:hover": {
                  bgcolor: "#FFEBEE",
                  color: "error.main",
                },
              }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Footer */}
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          sx={{
            mt: 3,
          }}
        >
          <Chip
            label={status.label}
            sx={{
              bgcolor: status.bg,
              color: status.color,
              fontWeight: 700,
              borderRadius: 10,
            }}
          />

          {task.dueDate && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <EventIcon
                sx={{
                  color: "text.secondary",
                  fontSize: 18,
                }}
              />

              <Typography variant="body2" color="text.secondary">
                {task.dueDate}
              </Typography>
            </Stack>
          )}

          <Stack direction="row" spacing={0.5} alignItems="center">
            <PersonOutlineIcon
              sx={{
                color: "text.secondary",
                fontSize: 18,
              }}
            />

            <Typography variant="body2" color="text.secondary">
              {task.ownerUsername}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
