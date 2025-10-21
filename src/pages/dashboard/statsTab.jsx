import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { ChartsYAxis } from "@mui/x-charts";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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
      return params.value === "yes" ? "Yes" : "No";
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
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  // Charts data states
  const [attendanceOverTimeData, setAttendanceOverTimeData] = useState([]);
  const [eventTypeData, setEventTypeData] = useState([]);
  const [memberCountOverTimeData, setMemberCountOverTimeData] = useState([]);
  const [selectedChart, setSelectedChart] = useState(0);
  const [majorDistributionData, setMajorDistributionData] = useState([]);
  const [showFoodLines, setShowFoodLines] = useState(true);

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
        .select("id, name, date, points, code, event_type, food_present")
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

  // Fetch charts data
  const fetchChartsData = async () => {
    try {
      setLoadingCharts(true);
      
      // Fetch events with attendance data
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("id, name, date, event_type, food_present")
        .order("date", { ascending: true });

      if (eventsError) {
        console.error("Error fetching events for charts:", eventsError);
        return;
      }

      // Get attendance data for each event
      const eventsWithAttendance = await Promise.all(
        (events || []).map(async (event) => {
          const { count, error: attendanceError } = await supabase
            .from("event_attendance")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id);

          return {
            ...event,
            attendance: count || 0,
            date: new Date(event.date),
          };
        })
      );

      // Calculate various attendance metrics
      const eventTypes = [...new Set(eventsWithAttendance.map(e => e.event_type || 'Unknown'))];
      
      // Calculate averages by event type and food presence
      const typeStats = eventTypes.reduce((acc, type) => {
        const eventsOfType = eventsWithAttendance.filter(e => (e.event_type || 'Unknown') === type);
        const foodEvents = eventsOfType.filter(e => e.food_present === true);
        const noFoodEvents = eventsOfType.filter(e => e.food_present === false);
        
        acc[type] = {
          avgWithFood: foodEvents.length > 0 
            ? Math.round(foodEvents.reduce((sum, e) => sum + e.attendance, 0) / foodEvents.length)
            : 0,
          avgWithoutFood: noFoodEvents.length > 0
            ? Math.round(noFoodEvents.reduce((sum, e) => sum + e.attendance, 0) / noFoodEvents.length)
            : 0,
          totalEvents: eventsOfType.length,
          foodEvents: foodEvents.length,
          noFoodEvents: noFoodEvents.length,
          totalAttendance: eventsOfType.reduce((sum, e) => sum + e.attendance, 0),
        };
        return acc;
      }, {});

      // Overall food vs no food stats
      const allFoodEvents = eventsWithAttendance.filter(e => e.food_present === true);
      const allNoFoodEvents = eventsWithAttendance.filter(e => e.food_present === false);
      const overallStats = {
        avgWithFood: allFoodEvents.length > 0
          ? Math.round(allFoodEvents.reduce((sum, e) => sum + e.attendance, 0) / allFoodEvents.length)
          : 0,
        avgWithoutFood: allNoFoodEvents.length > 0
          ? Math.round(allNoFoodEvents.reduce((sum, e) => sum + e.attendance, 0) / allNoFoodEvents.length)
          : 0,
      };

      // Enhanced attendance over time data
      const attendanceOverTime = eventsWithAttendance.map(event => ({
        date: event.date,
        attendance: Number(event.attendance) || 0,
        name: event.name,
        hasFood: event.food_present,
        type: event.event_type || 'Unknown',
        typeAvgWithFood: Number(typeStats[event.event_type || 'Unknown']?.avgWithFood) || 0,
        typeAvgWithoutFood: Number(typeStats[event.event_type || 'Unknown']?.avgWithoutFood) || 0,
        overallAvgWithFood: Number(overallStats.avgWithFood) || 0,
        overallAvgWithoutFood: Number(overallStats.avgWithoutFood) || 0,
      }));

      // Event type analysis data - simplified for bar chart
      const eventTypeAnalysis = Object.entries(typeStats).map(([type, stats]) => {
        const avgAttendance = stats.totalEvents > 0 
          ? Math.round(stats.totalAttendance / stats.totalEvents) 
          : 0;
        
        return {
          type: type.replace('_', ' ').toUpperCase(),
          avgAttendance: Number(avgAttendance) || 0,
          totalEvents: Number(stats.totalEvents) || 0,
          totalAttendance: Number(stats.totalAttendance) || 0,
          avgWithFood: Number(stats.avgWithFood) || 0,
          avgWithoutFood: Number(stats.avgWithoutFood) || 0,
        };
      }).filter(item => item.avgAttendance > 0); // Only show event types with attendance

      setAttendanceOverTimeData(attendanceOverTime);
      setEventTypeData(eventTypeAnalysis);

      console.log("Event Type Analysis Data:", eventTypeAnalysis);
      console.log("Type Stats:", typeStats);

      // 4. Member count over time (simulated - would need member registration dates)
      const memberCountData = eventsWithAttendance.map((event, index) => ({
        date: event.date,
        memberCount: Number(50 + (index * 5) + Math.floor(Math.random() * 10)) || 0 // Simulated growth
      }));
      setMemberCountOverTimeData(memberCountData);

    } catch (error) {
      console.error("Error fetching charts data:", error);
    } finally {
      setLoadingCharts(false);
    }
  };

  // Fetch major distribution data
  const fetchMajorData = async () => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("major")
        .not("major", "is", null);

      if (error) {
        console.error("Error fetching major data:", error);
        return;
      }

      // Count occurrences of each major
      const majorCounts = {};
      (data || []).forEach(member => {
        const major = member.major || "Unknown";
        majorCounts[major] = (majorCounts[major] || 0) + 1;
      });

      // Convert to array format for PieChart
      const totalMembers = data?.length || 0;
      const majorData = Object.entries(majorCounts).map(([major, count]) => ({
        id: major,
        value: count,
        label: major,
        percentage: totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0,
      }));

      // Sort by count descending
      majorData.sort((a, b) => b.value - a.value);
      
      setMajorDistributionData(majorData);
    } catch (error) {
      console.error("Error fetching major data:", error);
    }
  };

  // Fetch data when component mounts or category changes
  useEffect(() => {
    if (category === "members") {
      fetchMembersData();
    } else if (category === "events") {
      fetchEventsData();
    } else if (category === "charts") {
      fetchChartsData();
      fetchMajorData();
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
    } else if (category === "members") {
      return {
        columns: membersColumns,
        rows: membersData,
        title: "UF EMBS Members",
        loading: loadingMembers,
      };
    } else {
      return {
        title: "UF EMBS Analytics",
        loading: loadingCharts,
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
              {category === "charts" ? (
                <div className="h-full flex gap-4">
                  {/* Left side - Charts (2/3 width) */}
                    <div className="flex-[2] bg-gradient-to-br from-gray-900/40 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col shadow-2xl" style={{ minHeight: '400px', maxHeight: '600px' }}>
                    {/* Chart Selection Tabs */}
                    <Tabs
                      value={selectedChart}
                      onChange={(e, newValue) => setSelectedChart(newValue)}
                      sx={{
                        mb: 4,
                        '& .MuiTab-root': {
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '14px',
                          fontWeight: '500',
                          textTransform: 'none',
                          minHeight: '48px',
                          '&.Mui-selected': {
                            color: '#a855f7',
                            fontWeight: '600',
                          },
                          '&:hover': {
                            color: 'rgba(255,255,255,0.8)',
                          },
                        },
                        '& .MuiTabs-indicator': {
                          backgroundColor: '#a855f7',
                          height: '3px',
                          borderRadius: '2px',
                        },
                      }}
                    >
                      <Tab label="Event Attendance Trends" />
                      <Tab label="Event Type Analysis" />
                      <Tab label="Member Growth" />
                    </Tabs>

                    {/* Chart Container */}
                    <div className="flex-1 relative bg-gradient-to-br from-white/5 to-white/2 rounded-2xl border border-white/5" style={{ minHeight: '320px', maxHeight: '500px' }}>
                      {selectedChart === 0 && (
                        <div className="absolute inset-0 flex flex-col">
                          <div className="mb-3 mt-3 flex justify-between gap-3 px-4">
                            <div className="bg-gradient-to-br from-[#a855f7]/20 to-[#a855f7]/10 backdrop-blur-sm border border-[#a855f7]/30 p-3 rounded-xl flex-1">
                              <h3 className="text-white/90 text-xs font-medium mb-2">Overall Attendance with Food</h3>
                              <p className="text-lg font-bold text-[#a855f7]">
                                {attendanceOverTimeData[0]?.overallAvgWithFood || 0} avg. attendees
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-[#60a5fa]/20 to-[#60a5fa]/10 backdrop-blur-sm border border-[#60a5fa]/30 p-3 rounded-xl flex-1">
                              <h3 className="text-white/90 text-xs font-medium mb-2">Overall Attendance without Food</h3>
                              <p className="text-lg font-bold text-[#60a5fa]">
                                {attendanceOverTimeData[0]?.overallAvgWithoutFood || 0} avg. attendees
                              </p>
                            </div>
                            <div className="flex items-center">
                              <button
                                onClick={() => setShowFoodLines(!showFoodLines)}
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                                  showFoodLines 
                                    ? 'bg-gradient-to-br from-[#34d399]/20 to-[#34d399]/10 border border-[#34d399]/30 text-[#34d399]' 
                                    : 'bg-gradient-to-br from-gray-600/20 to-gray-600/10 border border-gray-600/30 text-gray-400'
                                }`}
                              >
                                {showFoodLines ? 'Hide Food Lines' : 'Show Food Lines'}
                              </button>
                            </div>
                          </div>
                          <div className="flex-1 relative">
                            <LineChart
                              xAxis={[{
                                dataKey: 'date',
                                scaleType: 'time',
                                valueFormatter: (value) => value ? new Date(value).toLocaleDateString() : '',
                                tickLabelStyle: { fill: 'white' },
                                axisLine: { stroke: 'white', strokeWidth: 1 },
                                tickLine: { stroke: 'white' },
                              }]}
                              yAxis={[{
                                tickLabelStyle: { fill: 'white' },
                                axisLine: { stroke: 'white', strokeWidth: 1 },
                                tickLine: { stroke: 'white' },
                              }]}
                              series={[
                                {
                                  dataKey: 'attendance',
                                  label: 'Event Attendance',
                                  color: '#a855f7',
                                  showMark: true,
                                  curve: 'linear',
                                  valueFormatter: (value, ctx) => {
                                    if (!ctx || !attendanceOverTimeData || !attendanceOverTimeData[ctx.index]) return `${value} attendees`;
                                    const point = attendanceOverTimeData[ctx.index];
                                    return `${point.name || 'Unknown Event'}\n${value} attendees\n${point.type || 'Unknown Type'}\n${point.hasFood ? 'Food Provided' : 'No Food'}`;
                                  },
                                },
                                ...(showFoodLines ? [
                                  {
                                    dataKey: 'overallAvgWithFood',
                                    label: 'Avg. with Food',
                                    color: '#60a5fa',
                                    showMark: false,
                                    curve: 'linear',
                                    valueFormatter: (value) => `${value} avg. attendees (with food)`,
                                  },
                                  {
                                    dataKey: 'overallAvgWithoutFood',
                                    label: 'Avg. without Food',
                                    color: '#34d399',
                                    showMark: false,
                                    curve: 'linear',
                                    valueFormatter: (value) => `${value} avg. attendees (no food)`,
                                  }
                                ] : [])
                              ]}
                              dataset={attendanceOverTimeData}
                              height={300}
                              margin={{ left: 60, right: 60, top: 40, bottom: 40 }}
                              slotProps={{
                                legend: {
                                  direction: 'row',
                                  position: { vertical: 'top', horizontal: 'middle' },
                                  padding: 0,
                                },
                              }}
                              sx={{
                                '& .MuiChartsLegend-root': {
                                  fill: 'white',
                                },
                                '& .MuiChartsLegend-mark': {
                                  fill: 'white',
                                },
                                '& .MuiChartsLegend-label': {
                                  fill: 'white !important',
                                  color: 'white !important',
                                },
                                '& .MuiChartsAxis-line': {
                                  stroke: 'white !important',
                                },
                                '& .MuiChartsAxis-tick': {
                                  stroke: 'white !important',
                                },
                                '& .MuiChartsAxis-root': {
                                  '& .MuiChartsAxis-line': {
                                    stroke: 'white !important',
                                  },
                                  '& .MuiChartsAxis-tick': {
                                    stroke: 'white !important',
                                  },
                                },
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {selectedChart === 1 && (
                        <div className="absolute inset-0 flex flex-col">
                          <div className="mb-3 mt-3 flex justify-between gap-3 px-4">
                            <div className="bg-gradient-to-br from-[#34d399]/20 to-[#34d399]/10 backdrop-blur-sm border border-[#34d399]/30 p-3 rounded-xl flex-1">
                              <h3 className="text-white/90 text-xs font-medium mb-2">Most Popular Event Type</h3>
                              <p className="text-lg font-bold text-[#34d399]">
                                {eventTypeData.length > 0 ? eventTypeData.reduce((max, type) => 
                                  type.avgAttendance > max.avgAttendance ? type : max
                                ).type : 'None'}
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-[#60a5fa]/20 to-[#60a5fa]/10 backdrop-blur-sm border border-[#60a5fa]/30 p-3 rounded-xl flex-1">
                              <h3 className="text-white/90 text-xs font-medium mb-2">Total Event Types</h3>
                              <p className="text-lg font-bold text-[#60a5fa]">
                                {eventTypeData.length}
                              </p>
                            </div>
                          </div>
                          <div className="flex-1 relative">
                            {eventTypeData.length > 0 ? (
                              <BarChart
                              xAxis={[{
                                dataKey: 'type',
                                scaleType: 'band',
                                tickLabelStyle: { fill: 'white', fontSize: 12 },
                                axisLine: { stroke: 'white', strokeWidth: 1 },
                                tickLine: { stroke: 'white' },
                              }]}
                              yAxis={[{
                                tickLabelStyle: { fill: 'white' },
                                axisLine: { stroke: 'white', strokeWidth: 1 },
                                tickLine: { stroke: 'white' },
                              }]}
                                series={[{
                                  dataKey: 'avgAttendance',
                                  label: 'Average Attendance',
                                  color: '#a855f7',
                                  valueFormatter: (value) => `${value} attendees`,
                                }]}
                                dataset={eventTypeData}
                                height={280}
                                margin={{ left: 60, right: 60, top: 40, bottom: 40 }}
                                slotProps={{
                                  legend: {
                                    direction: 'row',
                                    position: { vertical: 'top', horizontal: 'middle' },
                                    padding: 0,
                                  },
                                }}
                                sx={{
                                  '& .MuiChartsLegend-root': {
                                    fill: 'white',
                                  },
                                  '& .MuiChartsLegend-mark': {
                                    fill: 'white',
                                  },
                                  '& .MuiChartsLegend-label': {
                                    fill: 'white !important',
                                    color: 'white !important',
                                  },
                                  '& .MuiChartsAxis-line': {
                                    stroke: 'white',
                                  },
                                  '& .MuiChartsAxis-tick': {
                                    stroke: 'white',
                                  },
                                }}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                  <p className="text-white text-lg mb-2">No Event Data Available</p>
                                  <p className="text-gray-400 text-sm">Add some events with attendance to see the chart</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedChart === 2 && (
                        <div className="absolute inset-0 flex flex-col">
                          <div className="flex-1 relative">
                            <LineChart
                              xAxis={[{
                                dataKey: 'date',
                                scaleType: 'time',
                                valueFormatter: (value) => value ? new Date(value).toLocaleDateString() : '',
                                tickLabelStyle: { fill: 'white' },
                                axisLine: { stroke: 'white', strokeWidth: 1 },
                                tickLine: { stroke: 'white' },
                              }]}
                              yAxis={[{
                                tickLabelStyle: { fill: 'white' },
                                axisLine: { stroke: 'white', strokeWidth: 1 },
                                tickLine: { stroke: 'white' },
                              }]}
                              series={[{
                                dataKey: 'memberCount',
                                label: 'Total Members',
                                color: '#60a5fa',
                                showMark: true,
                                curve: 'linear',
                                valueFormatter: (value) => `${value} members`,
                              }]}
                              dataset={memberCountOverTimeData}
                              height={300}
                              margin={{ left: 60, right: 60, top: 40, bottom: 40 }}
                              slotProps={{
                                legend: {
                                  direction: 'row',
                                  position: { vertical: 'top', horizontal: 'middle' },
                                  padding: 0,
                                },
                              }}
                              sx={{
                                '& .MuiChartsLegend-root': {
                                  fill: 'white',
                                },
                                '& .MuiChartsLegend-mark': {
                                  fill: 'white',
                                },
                                '& .MuiChartsLegend-label': {
                                  fill: 'white !important',
                                  color: 'white !important',
                                },
                                '& .MuiChartsAxis-line': {
                                  stroke: 'white !important',
                                },
                                '& .MuiChartsAxis-tick': {
                                  stroke: 'white !important',
                                },
                                '& .MuiChartsAxis-root': {
                                  '& .MuiChartsAxis-line': {
                                    stroke: 'white !important',
                                  },
                                  '& .MuiChartsAxis-tick': {
                                    stroke: 'white !important',
                                  },
                                },
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side - Pie Chart (1/3 width) */}
                  <div className="flex-[1] bg-gradient-to-br from-gray-900/40 to-gray-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col shadow-2xl">
                    <h3 className="text-white text-xl font-bold mb-6 text-center">Major Distribution</h3>
                    <div className="flex-1 flex items-center justify-center">
                      {majorDistributionData.length > 0 ? (
                        <PieChart
                          series={[
                            {
                              data: majorDistributionData.map((item, index) => {
                                const colors = ['#a855f7', '#60a5fa', '#34d399', '#fbbf24', '#fb7185'];
                                const colorIndex = index % colors.length;
                                return {
                                  id: item.id,
                                  value: item.value,
                                  label: item.label,
                                  color: colors[colorIndex],
                                };
                              }),
                              highlightScope: { faded: 'global', highlighted: 'item' },
                              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            },
                          ]}
                          width={280}
                          height={280}
                          slotProps={{
                            legend: {
                              direction: 'row',
                              position: { vertical: 'bottom', horizontal: 'middle' },
                              padding: 0,
                              itemMarkWidth: 12,
                              itemMarkHeight: 12,
                              markGap: 5,
                              itemGap: 12,
                            },
                          }}
                          sx={{
                            '& .MuiChartsLegend-root': {
                              fill: 'white',
                            },
                            '& .MuiChartsLegend-mark': {
                              fill: 'white',
                            },
                            '& .MuiChartsLegend-label': {
                              fill: 'white !important',
                              fontSize: '12px',
                              color: 'white !important',
                            },
                          }}
                          tooltip={{
                            trigger: 'item',
                            formatter: (params) => [
                              `${params.name}: ${params.value} members (${params.percent}%)`,
                            ],
                          }}
                        />
                      ) : (
                        <div className="text-center">
                          <p className="text-white text-lg mb-2">No Major Data Available</p>
                          <p className="text-gray-400 text-sm">Members need to set their major to see distribution</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
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
              )}
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
                    <MenuItem value="charts">Charts</MenuItem>
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

            {/* Extra Stats Section - Only show for Members */}
            {category === "members" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Extra Stats
                </h2>
                <div className="w-full h-px bg-white mb-4"></div>
                <div className="space-y-4">
                  <div className="bg-[#121212]/50 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">
                      Total Members
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {membersData.length}
                    </div>
                  </div>
                  <div className="bg-[#121212]/50 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">
                      National Members
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {
                        membersData.filter(
                          (member) => member.national_member === "yes"
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Charts Info Section - Only show for Charts */}
            {category === "charts" && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Analytics Overview
                </h2>
                <div className="w-full h-px bg-white mb-4"></div>
                <div className="space-y-4">
                  <div className="bg-[#121212]/50 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">
                      Total Events
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {attendanceOverTimeData.length}
                    </div>
                  </div>
                  <div className="bg-[#121212]/50 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">
                      Total Attendance
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {attendanceOverTimeData.reduce((sum, event) => sum + event.attendance, 0)}
                    </div>
                  </div>
                  <div className="bg-[#121212]/50 rounded-lg p-3">
                    <div className="text-sm text-gray-300 mb-1">
                      Avg. Attendance
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {attendanceOverTimeData.length > 0 
                        ? Math.round(attendanceOverTimeData.reduce((sum, event) => sum + event.attendance, 0) / attendanceOverTimeData.length)
                        : 0
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
