export interface TaksirInput {
  username: string;
  platform: "threads";
}

export interface ThreadsProfileData {
  username: string;
  displayName?: string;
  bio?: string;
  followers?: number;
  threadCount?: number;
  avgViews?: number;
  avgViewsEstimated?: boolean;
  profileUrl: string;
  imageUrl?: string;
  scrapedAt: string;
}

export interface TaksirResult {
  username: string;
  platform: "threads";
  estimated_price_min: number;
  estimated_price_max: number;
  grade: string;
  funny_label: string;
  score_followers: number;
  score_engagement: number;
  score_branding: number;
  score_trust: number;
  score_cuan: number;
  score_asbun: number;
  price_boosters: string[];
  price_penalties: string[];
  ai_comment: string;
  disclaimer: string;
  generated_at: string;
  scraped_profile?: ThreadsProfileData;
}

export type Platform = "threads";
