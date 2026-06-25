import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { TaksirResult } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "taksir-results.json");

type StoredResults = Record<string, TaksirResult>;

export function getResultKey(username: string) {
  return username
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/(?:www\.)?threads\.(?:com|net)\//, "")
    .replace(/^@+/, "")
    .split(/[/?#]/)[0];
}

async function readResults(): Promise<StoredResults> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as StoredResults;
  } catch {
    return {};
  }
}

export async function getStoredResult(username: string) {
  const key = getResultKey(username);
  if (!key) return null;

  const results = await readResults();
  return results[key] || null;
}

export async function saveStoredResult(result: TaksirResult) {
  const key = getResultKey(result.username);
  if (!key) return;

  const results = await readResults();
  results[key] = result;

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(results, null, 2), "utf8");
}
