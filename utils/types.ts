// Re-exporting from split files for backward compatibility
export type {
  Athlete,
  AthleteStatus,
  EnrichedAthlete,
  Result,
} from "./domain.ts";

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
