export interface Result {
  id: string;
  discipline: string;
  medal: "gold" | "silver" | "bronze" | "participation";
  place: number;
  description: string;
  expand?: {
    competition: {
      name: string;
      year: number;
      date: string;
      rank: string;
    };
  };
}

export interface Athlete {
  id: string;
  name: string;
  rank: string; // KUP/DAN
  bio: string;
  image: string;
  status: "active" | "inactive" | "alumni";
  collectionId: string;
  collectionName: string;
  stats?: {
    gold: number;
    silver: number;
    bronze: number;
  };
  recentResults?: Result[];
}
