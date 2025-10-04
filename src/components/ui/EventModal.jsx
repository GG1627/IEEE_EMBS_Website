import { LuClock, LuMapPin } from "react-icons/lu";
import { Modal, Box, Typography, Button } from "@mui/material";

export default function EventModal({
  isOpen,
  onClose,
  eventName,
  location,
  date,
  time,
  description,
}) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="event-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker background
          backdropFilter: "blur(8px)", // More blur
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          bgcolor: "white",
          borderRadius: "22px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          p: 4,
          borderLeft: "8px solid #772583",
          maxWidth: "700px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
          outline: "none",
        }}
      >
        {/* Event Title */}
        <Typography
          id="event-modal-title"
          variant="h4"
          component="h2"
          sx={{
            color: "#772583",
            fontWeight: "bold",
            mb: 3,
            pr: 4,
          }}
        >
          {eventName}
        </Typography>

        {/* Event Details */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
            <LuMapPin
              style={{ color: "#9C1E96", flexShrink: 0, marginTop: 2 }}
              size={20}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "semibold",
                color: "gray.800",
                fontSize: "18px",
              }}
            >
              Location:
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "gray.700", fontSize: "18px" }}
            >
              {location}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
            <LuClock
              style={{ color: "#9C1E96", flexShrink: 0, marginTop: 2 }}
              size={20}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "semibold",
                color: "gray.800",
                fontSize: "18px",
              }}
            >
              Date & Time:
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "gray.700", fontSize: "18px" }}
            >
              {date}: {time}
            </Typography>
          </Box>

          {/* Full Description */}
          {description &&
            description.trim() &&
            description !== "No description available" &&
            !description.trim().startsWith("<a") && (
              <Box
                sx={{
                  mt: 2,
                  pt: 3,
                  borderTop: "1px solid",
                  borderColor: "gray.200",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "semibold", color: "gray.800", mb: 2 }}
                >
                  Event Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "gray.700",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {description}
                </Typography>
              </Box>
            )}
        </Box>
      </Box>
    </Modal>
  );
}
