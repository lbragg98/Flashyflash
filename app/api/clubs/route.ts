import { Club, FlashType } from "@/lib/clubs";

const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SHEET_NAME = process.env.GOOGLE_SHEETS_TAB || "Sheet1";

// Column index mapping (0-based)
const COLUMNS = {
  name: 0,           // Club Name
  quickLink: 1,      // Quick Link
  avgFlashLength: 2, // Avg Flash Length
  flashType: 3,      // Flash Type
  avgPrice: 4,       // Avg Price
  sfwFriendly: 5,    // SFW Friendly
  sfwActive: 6,      // SFW Active
  invSpeed: 7,       // Inv speed
  yeetSpeed: 8,      // yeet speed
  preparedness: 9,   // preparedness
  avgRating: 10,     // Avg. Rating
  comments: 11,      // Comments
  clubAge: 12,       // Club Age
};

function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.toLowerCase().trim();
  return normalized === "true" || normalized === "yes" || normalized === "1";
}

function parseFlashType(value: string | undefined): FlashType {
  if (!value) return "Hybrid";
  const normalized = value.toLowerCase().trim();
  const validTypes: FlashType[] = ["Dog", "Cat", "Invites", "Hybrid"];
  const match = validTypes.find((t) => t.toLowerCase() === normalized);
  return match || "Hybrid";
}

function transformRow(row: string[], index: number): Club {
  return {
    id: `club-${index}`,
    name: row[COLUMNS.name]?.trim() || "Unknown Club",
    quickLink: row[COLUMNS.quickLink]?.trim() || "",
    avgFlashLength: parseInt(row[COLUMNS.avgFlashLength] || "0") || 0,
    flashType: parseFlashType(row[COLUMNS.flashType]),
    avgPrice: parseInt(row[COLUMNS.avgPrice] || "0") || 0,
    sfwFriendly: parseBoolean(row[COLUMNS.sfwFriendly]),
    sfwActive: parseBoolean(row[COLUMNS.sfwActive]),
    invSpeed: parseInt(row[COLUMNS.invSpeed] || "0") || 0,
    yeetSpeed: parseInt(row[COLUMNS.yeetSpeed] || "0") || 0,
    preparedness: parseInt(row[COLUMNS.preparedness] || "0") || 0,
    avgRating: parseFloat((parseFloat(row[COLUMNS.avgRating] || "0") || 0).toFixed(1)),
    comments: row[COLUMNS.comments]?.trim() || "",
    clubAge: parseInt(row[COLUMNS.clubAge] || "0") || 0,
  };
}

export async function GET() {
  try {
    if (!API_KEY || !SHEET_ID) {
      return Response.json(
        { error: "Missing Google Sheets credentials" },
        { status: 500 }
      );
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}?key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("[v0] Google Sheets API error:", response.status, response.statusText);
      return Response.json(
        { error: "Failed to fetch from Google Sheets" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rows = data.values || [];

    // Skip header row
    const clubs: Club[] = rows.slice(1).map((row: string[], index: number) => transformRow(row, index + 1));

    return Response.json(clubs);
  } catch (error) {
    console.error("[v0] Error fetching clubs:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
