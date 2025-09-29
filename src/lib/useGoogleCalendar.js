import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CALENDAR_ID = import.meta.env.VITE_CALENDAR_ID;
const CACHE_DURATION = 10 * 60 * 1000; // 15 minutes in milliseconds
const CACHE_KEY = "google_calendar_events";

export default function useGoogleCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!API_KEY || !CALENDAR_ID) {
      setError("Missing API key or Calendar ID");
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          key: API_KEY,
          singleEvents: "true",
          orderBy: "startTime",
          timeMin: new Date().toISOString(),
          maxResults: "25",
        });

        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
            CALENDAR_ID
          )}/events?${params}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const eventsData = data.items || [];

        // Cache the results with timestamp
        const cacheData = {
          events: eventsData,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

        setEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching calendar events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Check if we have cached data
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      try {
        const { events: cachedEvents, timestamp } = JSON.parse(cachedData);
        const now = Date.now();

        // If cache is still fresh (less than 15 minutes old), use it
        if (now - timestamp < CACHE_DURATION) {
          setEvents(cachedEvents);
          setLoading(false);
          setError(null);
          return;
        }
      } catch (err) {
        console.error("Error parsing cached data:", err);
      }
    }

    // If no cache or cache is stale, fetch fresh data
    fetchEvents();
  }, []);

  return { events, loading, error };
}
