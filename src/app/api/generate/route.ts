import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT, buildPrompt } from "@/lib/prompts";
import { calculateThreadsScores, estimateAvgViews, scrapeThreadsProfile } from "@/lib/threads-scraper";
import type { TaksirResult } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || "https://api.openai.com/v1",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username } = body;
    const platform = "threads";

    if (!username) {
      return NextResponse.json(
        { error: "Username Threads wajib diisi." },
        { status: 400 }
      );
    }

    let profile;
    try {
      profile = await scrapeThreadsProfile(username);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal mengambil data publik Threads.";
      return NextResponse.json(
        { error: message },
        { status: 502 }
      );
    }

    const estimatedAvgViews = estimateAvgViews(profile);
    if (estimatedAvgViews) {
      profile.avgViews = estimatedAvgViews;
      profile.avgViewsEstimated = true;
    }

    const scores = calculateThreadsScores(profile);
    const prompt = buildPrompt({
      username: profile.username,
      platform,
      followers: profile.followers,
      threadCount: profile.threadCount,
      avgViews: profile.avgViews,
      avgViewsEstimated: profile.avgViewsEstimated,
      displayName: profile.displayName,
      bio: profile.bio,
      profileUrl: profile.profileUrl,
      scrapedAt: profile.scrapedAt,
      scores,
    });

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "AI tidak menghasilkan respons." },
        { status: 500 }
      );
    }

    let result: TaksirResult;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Gagal parse hasil AI. Coba lagi." },
        { status: 500 }
      );
    }

    result.username = profile.username;
    result.platform = platform;
    result.generated_at = new Date().toISOString();
    result.scraped_profile = profile;
    result.score_followers = scores.score_followers;
    result.score_engagement = scores.score_engagement;
    result.score_branding = scores.score_branding;
    result.score_trust = scores.score_trust;
    result.score_cuan = scores.score_cuan;
    result.estimated_price_min = Math.round(result.estimated_price_min * 10);
    result.estimated_price_max = Math.round(result.estimated_price_max * 10);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Coba lagi nanti." },
      { status: 500 }
    );
  }
}
