import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getRuntimeDataDir } from "@/lib/runtime-data";

export interface TrackedUser {
  username: string;
  time: string;
}

const DATA_DIR = getRuntimeDataDir();
const DATA_FILE = path.join(DATA_DIR, "tracked-users.json");
const MAX_USERS = 500;

function cleanUsername(username: string) {
  const cleaned = username.trim();
  if (!cleaned) return "";
  return cleaned.startsWith("@") ? cleaned : `@${cleaned}`;
}

function getUserKey(username: string) {
  return cleanUsername(username).toLowerCase();
}

function uniqueTrackedUsers(users: TrackedUser[]) {
  const seen = new Set<string>();
  const unique: TrackedUser[] = [];

  for (const user of users) {
    const key = getUserKey(user.username);
    if (!key || seen.has(key)) continue;

    seen.add(key);
    unique.push({
      username: cleanUsername(user.username),
      time: user.time,
    });
  }

  return unique;
}

export async function readTrackedUsers(): Promise<TrackedUser[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    const rows = Array.isArray(parsed) ? parsed : [parsed];
    const users = rows.filter(
      (item): item is TrackedUser =>
        typeof item?.username === "string" && typeof item?.time === "string",
    );
    return uniqueTrackedUsers(users);
  } catch {
    return [];
  }
}

export async function addTrackedUser(username: string) {
  const cleaned = cleanUsername(username);
  if (!cleaned) return null;

  const users = await readTrackedUsers();
  const key = getUserKey(cleaned);
  const nextUsers = [
    { username: cleaned, time: new Date().toISOString() },
    ...users.filter((user) => getUserKey(user.username) !== key),
  ].slice(0, MAX_USERS);

  try {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(nextUsers, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to save tracked user:", error);
  }

  return nextUsers[0];
}
