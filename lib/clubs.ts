export type FlashType = "Dog" | "Cat" | "Invites" | "Hybrid";

export interface Club {
  id: string;
  name: string;              // Club Name
  quickLink: string;         // Quick Link (copyable name, not URL)
  avgFlashLength: number;    // Avg Flash Length
  flashType: FlashType;      // Flash Type
  avgPrice: number;          // Avg Price (no currency symbol)
  sfwFriendly: boolean;      // SFW Friendly
  sfwActive: boolean;        // SFW Active
  invSpeed: number;          // Inv speed (1-10)
  yeetSpeed: number;         // yeet speed (1-10)
  preparedness: number;      // preparedness (1-10)
  avgRating: number;         // Avg. Rating (1-5)
  comments: string;          // Comments (supports longer text)
  clubAge: number;           // Club Age
}

// Placeholder - will be replaced with Google Sheets data
export const CLUBS: Club[] = [];
