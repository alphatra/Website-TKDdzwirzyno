export interface Result {
  id: string;
  // Relation fields (IDs)
  athlete?: string; 
  coach?: string; 
  competition?: string;
  
  // Data fields
  discipline: string;
  medal: "gold" | "silver" | "bronze" | "participation";
  place: number;
  description: string;
  expand?: {
    competition?: {
      name: string;
      year: number;
      date?: string;
      rank?: string;
    };
  };
}

export type AthleteStatus = "active" | "inactive" | "alumni";

export interface Athlete {
  id: string;
  name: string;
  rank: string; // KUP/DAN
  bio: string;
  image: string;
  status: AthleteStatus | ""; // Fallback for empty string from PB
  collectionId: string;
  collectionName: string;
  // Optional enriched fields
  stats?: {
    gold: number;
    silver: number;
    bronze: number;
  };
  recentResults?: Result[];
}

export interface EnrichedAthlete extends Athlete {
  stats: {
    gold: number;
    silver: number;
    bronze: number;
  };
  recentResults: Result[];
}
