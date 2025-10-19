import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

// Events columns
const eventsColumns = [
  {
    field: "eventName",
    headerName: "Event Name",
    flex: 2,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    align: "left",
    headerAlign: "left",
    editable: true,
    valueGetter: (params) => {
      if (!params) return "No date";
      const dateStr = params.substring(0, 10); // Get "2025-10-06"
      const [year, month, day] = dateStr.split("-");
      return `${month}/${day}/${year}`;
    },
  },
  {
    field: "points",
    headerName: "Points",
    type: "number",
    flex: 1,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "code",
    headerName: "Code",
    flex: 1,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "attendees",
    headerName: "Attendees",
    type: "number",
    flex: 1,
    align: "left",
    headerAlign: "left",
    editable: false,
  },
];

// Members columns
const membersColumns = [
  {
    field: "name",
    headerName: "Name",
    flex: 1.5,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 2,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "points",
    headerName: "Points",
    type: "number",
    flex: 1,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "national_member",
    headerName: "National Member",
    flex: 1,
    align: "left",
    headerAlign: "left",
    editable: true,
    renderCell: (params) => {
      return params.value ? "Yes" : "No";
    },
  },
];

// Events data will be fetched from Supabase

export default function StatsTab() {
  const [category, setCategory] = React.useState("events");
  const [membersData, setMembersData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const handleChange = (event) => {
    setCategory(event.target.value);
    setSelectedEventId(null); // Clear selection when switching categories
  };

  // Download attendee data for selected event
  const downloadAttendees = async (format) => {
    if (!selectedEventId) {
      alert("Please select an event to download attendance data.");
      return;
    }

    try {
      // Get attendee data for selected event
      const { data: attendanceData, error } = await supabase
        .from("event_attendance")
        .select(
          `
          event_id,
          member_id,
          members (
            first_name,
            last_name,
            email
          )
        `
        )
        .eq("event_id", selectedEventId);

      if (error) {
        console.error("Error fetching attendance data:", error);
        alert("Error fetching attendance data. Please try again.");
        return;
      }

      if (!attendanceData || attendanceData.length === 0) {
        alert("No attendance data found for the selected events.");
        return;
      }

      // Transform data for export
      const exportData = attendanceData.map((record) => ({
        name: `${record.members?.first_name || ""} ${
          record.members?.last_name || ""
        }`.trim(),
        email: record.members?.email || "",
      }));

      // Create filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `event_attendance_${currentDate}`;

      if (format === "CSV") {
        downloadCSV(exportData, filename);
      } else if (format === "TXT") {
        downloadTXT(exportData, filename);
      } else if (format === "EXCEL") {
        downloadExcel(exportData, filename);
      }
    } catch (error) {
      console.error("Error downloading attendance data:", error);
      alert("Error downloading attendance data. Please try again.");
    }
  };

  // Download as CSV
  const downloadCSV = (data, filename) => {
    const headers = ["Name", "Email"];
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        [`"${row.name || ""}"`, `"${row.email || ""}"`].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  // Download as TXT
  const downloadTXT = (data, filename) => {
    const txtContent = data
      .map((row) => `${row.name || ""} - ${row.email || ""}`)
      .join("\n");

    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.txt`;
    link.click();
  };

  // Download as Excel (CSV format for Excel compatibility)
  const downloadExcel = (data, filename) => {
    downloadCSV(data, filename.replace(".csv", ".xlsx"));
  };

  // Fetch events data from Supabase with attendee counts
  const fetchEventsData = async () => {
    try {
      setLoadingEvents(true);
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("id, name, date, points, code")
        .order("date", { ascending: false });

      if (eventsError) {
        console.error("Error fetching events:", eventsError);
        setEventsData([]);
        return;
      }

      // Get attendee counts for each event
      const eventsWithAttendees = await Promise.all(
        (events || []).map(async (event) => {
          const { count, error: attendanceError } = await supabase
            .from("event_attendance")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id);

          if (attendanceError) {
            console.error(
              `Error fetching attendance for event ${event.id}:`,
              attendanceError
            );
            return {
              ...event,
              eventName: event.name,
              attendees: 0,
            };
          }

          return {
            ...event,
            eventName: event.name,
            attendees: count || 0,
          };
        })
      );

      console.log("Events data:", eventsWithAttendees);
      setEventsData(eventsWithAttendees);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEventsData([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch members data from Supabase
  const fetchMembersData = async () => {
    try {
      setLoadingMembers(true);
      const { data, error } = await supabase
        .from("members")
        .select("id, first_name, last_name, email, points, national_member")
        .order("points", { ascending: false });

      if (error) {
        console.error("Error fetching members:", error);
        setMembersData([]);
      } else {
        // Transform data to include computed name field
        const transformedData = (data || []).map((member) => ({
          ...member,
          name: `${member.first_name || ""} ${member.last_name || ""}`.trim(),
        }));
        setMembersData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembersData([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Fetch data when component mounts or category changes
  useEffect(() => {
    if (category === "members") {
      fetchMembersData();
    } else if (category === "events") {
      fetchEventsData();
    }
  }, [category]);

  // Get current data based on selection
  const getCurrentData = () => {
    if (category === "events") {
      return {
        columns: eventsColumns,
        rows: eventsData,
        title: "UF EMBS Events",
        loading: loadingEvents,
      };
    } else {
      return {
        columns: membersColumns,
        rows: membersData,
        title: "UF EMBS Members",
        loading: loadingMembers,
      };
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="mx-auto">
      <div className="h-[calc(100vh-6.5rem)] flex flex-col overflow-hidden p-2">
        <div className="bg-[#000000]/0 rounded-xl flex-1 flex gap-3 p-2 overflow-hidden">
          <div className="bg-[#000000]/50 flex-[0.8] rounded-3xl p-4 flex flex-col overflow-hidden">
            <h1 className="text-4xl font-bold italic text-[#8ed8f8] mb-2 flex-shrink-0">
              {currentData.title}
            </h1>
            <div className="w-full h-px bg-white mb-2"></div>
            <div className="flex-1 min-h-0 w-full overflow-hidden">
              <DataGrid
                rows={currentData.rows || []}
                columns={currentData.columns || []}
                loading={currentData.loading}
                disableMultipleSelection
                disableRowSelectionOnClick={false}
                onRowClick={(params) => {
                  if (category === "events") {
                    setSelectedEventId(params.id);
                  }
                }}
                selectionModel={selectedEventId ? [selectedEventId] : []}
                hideFooterSelectedRowCount
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 30, page: 0 },
                  },
                }}
                pageSizeOptions={[30, 50, 100]}
                sx={{
                  height: "100%",
                  width: "100%",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "white",
                  "& .MuiDataGrid-virtualScroller": {
                    overflowY: "auto",
                    backgroundColor: "transparent",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#6877FF",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    color: "black",
                  },
                  "& .MuiDataGrid-row": {
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(40, 40, 40, 0.4)",
                      "&:hover": {
                        backgroundColor: "rgba(100, 100, 100, 0.4)",
                      },
                    },
                  },

                  "& .MuiDataGrid-cell": {
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "& .MuiTablePagination-displayedRows": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiTablePagination-actions": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiTablePagination-selectLabel": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiTablePagination-actions svg": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiTablePagination-select": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiDataGrid-selectedRowCount": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiSelect-icon": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiCheckbox-root": {
                    color: "rgb(255, 255, 255)",
                  },
                  "& .MuiCheckbox-root.Mui-checked": {
                    color: "#836BFF",
                  },
                  "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
                    color: "#666666",
                  },
                  "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root.Mui-checked":
                    {
                      color: "#666666",
                    },
                }}
              />
            </div>
          </div>
          {/* RIGHT SIDEBAR */}
          <div className="bg-[#000000]/50 flex-[0.2] rounded-3xl p-4 space-y-6">
            {/* Filter Section */}
            <div className="mt-3">
              <h2 className="text-xl font-bold text-white mb-2">
                Filter by Category
              </h2>
              <div className="w-full h-px bg-white mb-4"></div>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel
                    id="category-select-label"
                    sx={{
                      color: "white",
                      "&.Mui-focused": {
                        color: "white",
                      },
                    }}
                  >
                    Category
                  </InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={category}
                    label="Category"
                    onChange={handleChange}
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                      "& .MuiSelect-icon": {
                        color: "white",
                      },
                    }}
                  >
                    <MenuItem value="events">Events</MenuItem>
                    <MenuItem value="members">Members</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>

            {/* Download Section - Only show for Events */}
            {category === "events" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Download Attendance
                </h2>
                <div className="w-full h-px bg-white mb-4"></div>
                <div className="space-y-3">
                  <button
                    onClick={() => downloadAttendees("TXT")}
                    className="w-full px-4 py-2 bg-[#121212]/90 hover:bg-[#121212] text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A3AD] focus:ring-offset-2 hover:cursor-pointer"
                  >
                    TXT
                  </button>
                  <button
                    onClick={() => downloadAttendees("EXCEL")}
                    className="w-full px-4 py-2 bg-[#121212]/90 hover:bg-[#121212] text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A3AD] focus:ring-offset-2 hover:cursor-pointer"
                  >
                    EXCEL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
