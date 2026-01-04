import { AthleteRecord, ResultRecord } from "./pocketbase.ts";

export type AthleteStatus = AthleteRecord["status"];

// Domain Result (mostly matches Record but allows for joins/expanded data)
export interface Result extends
  Omit<
    ResultRecord,
    "created" | "updated" | "collectionId" | "collectionName"
  > {
  expand?: {
    competition?: {
      name: string;
      year: number;
      date?: string;
      rank?: string;
    };
  };
}

export interface Athlete extends AthleteRecord {
  // Enriched / Computed Fields
  stats?: {
    gold: number;
    silver: number;
    bronze: number;
  };
  recentResults?: Result[];
}

export interface EnrichedAthlete extends Athlete {
  // Explicitly enforce stats presence if needed, but 'Athlete' usually carries optional stats in this app
}

export type {
  AlbumRecord,
  AthleteRecord,
  BaseRecord,
  CompetitionRecord,
  MenuPageRecord,
  NewsRecord,
  PhotoRecord,
  ResultRecord,
  SiteInfoRecord,
} from "./pocketbase.ts";

export interface State {
  shared: string;
}
