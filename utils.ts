import { createDefine } from "fresh";
import { MenuPageRecord, NewsRecord, SiteInfoRecord } from "./utils/types.ts";

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
  shared?: string;
  siteInfo: SiteInfoRecord | null;
  menuPages: MenuPageRecord[];
  news?: NewsRecord[];
}

export const define = createDefine<State>();
