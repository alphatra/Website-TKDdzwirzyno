import pb from "./pb.ts";

export { pb };

export interface BaseRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
}

export interface SiteInfoRecord extends BaseRecord {
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
}

export interface AthleteRecord extends BaseRecord {
  name: string;
  rank: string;
  bio: string;
  image: string;
  status: "active" | "inactive" | "alumni" | "";
}

export interface CompetitionRecord extends BaseRecord {
  name: string;
  year: number;
  date?: string;
  rank?: string;
}

export interface ResultRecord extends BaseRecord {
  athlete?: string;
  coach?: string;
  competition?: string;
  discipline: string;
  medal: "gold" | "silver" | "bronze" | "participation";
  place: number;
  description: string;
}

export interface NewsRecord extends BaseRecord {
  title: string;
  summary: string;
  content: string; // HTML probably
  image: string;
  published: boolean;
}

export interface MenuPageRecord extends BaseRecord {
  title: string;
  slug: string;
  order: number;
  content?: string;
  visible: boolean;
}

export interface PageRecord extends BaseRecord {
  title: string;
  subtitle?: string;
  slug: string;
  content: string;
  visible: boolean;
  image?: string;
}

export interface AlbumRecord extends BaseRecord {
  title: string;
  description: string;
}

export interface PhotoRecord extends BaseRecord {
  album: string;
  image: string;
  caption?: string;
}
