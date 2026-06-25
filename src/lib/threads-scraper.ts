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

export interface ThreadsProfileScores {
  score_followers: number;
  score_engagement: number;
  score_branding: number;
  score_trust: number;
  score_cuan: number;
  score_asbun: number;
}

export function estimateAvgViews(profile: ThreadsProfileData): number | undefined {
  const followers = profile.followers || 0;
  const threadCount = profile.threadCount || 0;

  if (followers <= 0 && threadCount <= 0) return undefined;

  const baseAudience = Math.max(followers, 50);
  const activityMultiplier = 1 + Math.min(12, Math.log10(threadCount + 1) * 2.2);
  const contentDepthBonus = threadCount >= 200 ? 1.35 : threadCount >= 75 ? 1.18 : threadCount >= 20 ? 1.08 : 0.9;
  const profileCompletenessBonus = profile.bio && profile.imageUrl ? 1.12 : profile.bio || profile.imageUrl ? 1.05 : 0.95;
  const smallAccountDiscoveryBoost = followers > 0 && followers < 1_000 && threadCount >= 100 ? 1.8 : 1;
  const highFollowerDampener = followers >= 100_000 ? 0.75 : 1;

  const estimate =
    baseAudience *
    activityMultiplier *
    contentDepthBonus *
    profileCompletenessBonus *
    smallAccountDiscoveryBoost *
    highFollowerDampener;

  const minimum = followers > 0 ? followers * 1.2 : threadCount * 25;
  const maximum = Math.max(minimum, followers * 5_000, threadCount * 25_000);

  return Math.round(Math.min(Math.max(estimate, minimum), maximum));
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreFollowers(followers = 0): number {
  if (followers <= 0) return 5;
  if (followers >= 1_000_000) return 100;
  return clampScore((Math.log10(followers + 1) / 6) * 100);
}

function scoreEngagementProxy(followers = 0, threadCount = 0, avgViews = 0): number {
  if (threadCount <= 0) return followers > 0 ? 18 : 5;

  const activityScore = Math.min(38, Math.log10(threadCount + 1) * 15);
  const scaleBonus = followers >= 100_000 ? 14 : followers >= 10_000 ? 10 : followers >= 1_000 ? 6 : followers >= 100 ? 2 : 0;
  const saturationPenalty = followers >= 100_000 && threadCount < 50 ? 12 : 0;
  const viewsScore = avgViews > 0 ? Math.min(22, Math.log10(avgViews + 1) * 3.2) : 0;
  const viewsFollowerRatioBonus =
    avgViews > 0 && followers > 0
      ? Math.min(10, Math.log10(avgViews / followers + 1) * 6)
      : 0;
  const estimatedViewsCap = avgViews > 0 ? (followers >= 10_000 ? 82 : followers >= 1_000 ? 76 : 68) : 64;
  const largeAccountCap = followers >= 100_000 && avgViews >= 1_000_000 ? 92 : estimatedViewsCap;
  const score = activityScore + scaleBonus + viewsScore + viewsFollowerRatioBonus - saturationPenalty;

  return Math.min(clampScore(score), largeAccountCap);
}

function scoreBranding(profile: ThreadsProfileData): number {
  const followers = profile.followers || 0;
  const bio = profile.bio?.trim() || "";
  const username = profile.username.replace("@", "");
  const hasLink = /(?:https?:\/\/|www\.|\.com|\.id|\.co|lynk\.id|linktr\.ee|wa\.me)/i.test(bio);
  const hasPositioning = /ai|tools?|dokter|bisnis|coach|agency|shop|store|jasa|kelas|creator|founder|brand|official|studio|design|beauty|food|travel|fitness/i.test(bio);

  let score = 10;
  if (profile.displayName && profile.displayName.length >= 3) score += 10;
  if (profile.imageUrl) score += 8;
  if (/^[a-z0-9._]{3,18}$/i.test(username)) score += 8;
  if (bio.length >= 20) score += 12;
  if (bio.length >= 60) score += 8;
  if (hasPositioning) score += 12;
  if (hasLink) score += 10;
  if (followers >= 1_000) score += 6;
  if (followers >= 10_000) score += 8;

  const cap =
    followers >= 50_000 && hasPositioning && hasLink ? 92 :
    followers >= 10_000 && hasPositioning ? 86 :
    followers >= 1_000 ? 78 :
    hasPositioning && hasLink ? 72 :
    62;

  return Math.min(clampScore(score), cap);
}

function scoreTrust(profile: ThreadsProfileData): number {
  const followers = profile.followers || 0;
  const threadCount = profile.threadCount || 0;
  let score = 20;

  if (followers >= 100) score += 10;
  if (followers >= 1_000) score += 15;
  if (followers >= 10_000) score += 15;
  if (threadCount >= 10) score += 10;
  if (threadCount >= 100) score += 10;
  if ((profile.avgViews || 0) >= 10_000) score += 5;
  if ((profile.avgViews || 0) >= 100_000) score += 5;
  if (profile.bio) score += 10;
  if (profile.imageUrl) score += 5;

  return clampScore(score);
}

function scoreAsbun(profile: ThreadsProfileData): number {
  const followers = profile.followers || 0;
  const threadCount = profile.threadCount || 0;
  const bio = profile.bio?.trim() || "";
  const vagueBio = /random|gabut|opini|curhat|apa aja|suka suka|semua|cerita|daily|hidup|pemikir/i.test(bio);

  let score = 18;
  if (threadCount >= 10) score += 12;
  if (threadCount >= 50) score += 12;
  if (threadCount >= 150) score += 12;
  if (followers > 0 && followers < 500) score += 8;
  if (followers >= 500 && followers < 5_000) score += 5;
  if (bio.length > 0 && bio.length < 35) score += 8;
  if (vagueBio) score += 15;
  if (!bio) score += 10;
  if ((profile.avgViews || 0) > followers * 5) score += 8;

  return clampScore(score);
}

export function calculateThreadsScores(profile: ThreadsProfileData): ThreadsProfileScores {
  const score_followers = scoreFollowers(profile.followers);
  const score_engagement = scoreEngagementProxy(profile.followers, profile.threadCount, profile.avgViews);
  const score_branding = scoreBranding(profile);
  const score_trust = scoreTrust(profile);
  const score_asbun = scoreAsbun(profile);
  const score_cuan = clampScore(
    score_followers * 0.3 +
    score_engagement * 0.3 +
    score_branding * 0.2 +
    score_trust * 0.2
  );

  return {
    score_followers,
    score_engagement,
    score_branding,
    score_trust,
    score_cuan,
    score_asbun,
  };
}

function cleanUsername(username: string): string {
  return username.trim().replace(/^@+/, "").split(/[/?#]/)[0];
}

function decodeHtml(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function getMetaContent(html: string, key: string): string | undefined {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];

  for (const tag of tags) {
    const property = tag.match(/\bproperty=["']([^"']+)["']/i)?.[1];
    const name = tag.match(/\bname=["']([^"']+)["']/i)?.[1];
    if (property !== key && name !== key) continue;

    const content =
      tag.match(/\bcontent="([^"]*)"/i)?.[1] ||
      tag.match(/\bcontent='([^']*)'/i)?.[1];

    if (content) return decodeHtml(content.trim());
  }

  return undefined;
}

function parseCompactNumber(value: string, suffix?: string): number | undefined {
  const normalized = value.replace(/,/g, "");
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) return undefined;

  const multiplier =
    suffix?.toUpperCase() === "B" ? 1_000_000_000 :
    suffix?.toUpperCase() === "M" ? 1_000_000 :
    suffix?.toUpperCase() === "K" ? 1_000 :
    1;

  return Math.round(parsed * multiplier);
}

function parseProfileDescription(description?: string): Pick<ThreadsProfileData, "bio" | "followers" | "threadCount"> {
  if (!description) return {};

  const followersMatch = description.match(/([\d.,]+)\s*([KMB])?\s+Followers/i);
  const threadsMatch = description.match(/([\d.,]+)\s*([KMB])?\s+Threads/i);
  const parts = description.split("•").map((part) => part.trim()).filter(Boolean);
  const bioPart = parts.slice(2).join(" • ").replace(/\s*See the latest conversations.*$/i, "").trim();

  return {
    followers: followersMatch ? parseCompactNumber(followersMatch[1], followersMatch[2]) : undefined,
    threadCount: threadsMatch ? parseCompactNumber(threadsMatch[1], threadsMatch[2]) : undefined,
    bio: bioPart || undefined,
  };
}

export async function scrapeThreadsProfile(rawUsername: string): Promise<ThreadsProfileData> {
  const username = cleanUsername(rawUsername);
  if (!username) {
    throw new Error("Username Threads wajib diisi.");
  }

  const profileUrl = `https://www.threads.com/@${encodeURIComponent(username)}`;
  const response = await fetch(profileUrl, {
    cache: "no-store",
    headers: {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9,id;q=0.8",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    },
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    throw new Error(`Threads mengembalikan status ${response.status}.`);
  }

  const html = await response.text();
  const title = getMetaContent(html, "og:title") || getMetaContent(html, "twitter:title");
  const description = getMetaContent(html, "og:description") || getMetaContent(html, "description");
  const imageUrl = getMetaContent(html, "og:image") || getMetaContent(html, "twitter:image");
  const parsed = parseProfileDescription(description);
  const displayName = title?.match(/^(.+?)\s+\(@/)?.[1]?.trim();

  if (!description?.toLowerCase().includes("followers")) {
    throw new Error("Data publik profil Threads tidak ditemukan. Akun mungkin private, tidak ada, atau sedang dibatasi.");
  }

  return {
    username: `@${username}`,
    displayName,
    bio: parsed.bio,
    followers: parsed.followers,
    threadCount: parsed.threadCount,
    profileUrl,
    imageUrl,
    scrapedAt: new Date().toISOString(),
  };
}
