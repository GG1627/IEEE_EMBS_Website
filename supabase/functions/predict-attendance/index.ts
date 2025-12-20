// supabase/functions/predict-attendance/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ML_API_URL = "https://uf-embs-ml.onrender.com/predict";

interface EventData {
  event_id: number;
  name: string;
  date: string;
  points: number;
  code: string;
  start_time: string;
  end_time: string;
  event_type: string;
  food_present: boolean;
  is_virtual: boolean;
}

interface MLPredictionRequest {
  points: number;
  food_present: number;
  is_virtual: number;
  event_type_competition: boolean;
  event_type_fundraising: boolean;
  event_type_gbm: boolean;
  event_type_industry_speaker: boolean;
  event_type_workshop: boolean;
  weekday: number;
  month: number;
  day: number;
  start_hour: number;
}

Deno.serve(async (req) => {
  try {
    // Get the event data from the request body
    const eventData: EventData = await req.json();

    // Transform event data to ML API format
    const startTime = new Date(eventData.start_time);
    
    // Parse the date - handle both YYYY-MM-DD format and ISO format
    let eventDate: Date;
    if (eventData.date.includes("T")) {
      eventDate = new Date(eventData.date);
    } else {
      eventDate = new Date(eventData.date + "T00:00:00");
    }

    // Determine which event type boolean should be true
    // Map academia_speaker to industry_speaker since ML model doesn't have academia_speaker
    const eventTypeMap: Record<string, string> = {
      competition: "event_type_competition",
      fundraising: "event_type_fundraising",
      gbm: "event_type_gbm",
      industry_speaker: "event_type_industry_speaker",
      academia_speaker: "event_type_industry_speaker", // Map to industry_speaker
      workshop: "event_type_workshop",
    };

    const eventTypeKey = eventTypeMap[eventData.event_type] || "event_type_gbm";

    // Build ML API request payload
    const mlPayload: MLPredictionRequest = {
      points: parseInt(eventData.points.toString(), 10),
      food_present: eventData.food_present ? 1 : 0,
      is_virtual: eventData.is_virtual ? 1 : 0,
      event_type_competition: eventTypeKey === "event_type_competition",
      event_type_fundraising: eventTypeKey === "event_type_fundraising",
      event_type_gbm: eventTypeKey === "event_type_gbm",
      event_type_industry_speaker: eventTypeKey === "event_type_industry_speaker",
      event_type_workshop: eventTypeKey === "event_type_workshop",
      weekday: startTime.getDay(), // 0 = Sunday, 1 = Monday, etc.
      month: eventDate.getMonth() + 1, // 1-12
      day: eventDate.getDate(), // 1-31
      start_hour: startTime.getHours(), // 0-23
    };

    // Call ML API
    const mlResponse = await fetch(ML_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mlPayload),
    });

    let predictedAttendance = 0;

    if (mlResponse.ok) {
      const mlResult = await mlResponse.json();
      predictedAttendance = mlResult.predicted_attendance || 0;
    } else {
      console.error("ML API error:", await mlResponse.text());
      // Default to 0 if API fails
    }

    // Update the event in the database with predicted attendance
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: updateError } = await supabase
      .from("events")
      .update({ predicted_attendance: predictedAttendance })
      .eq("id", eventData.event_id);

    if (updateError) {
      console.error("Error updating event:", updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        event_id: eventData.event_id,
        predicted_attendance: predictedAttendance,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in predict-attendance function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

