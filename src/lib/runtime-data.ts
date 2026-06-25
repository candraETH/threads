import os from "os";
import path from "path";

export function getRuntimeDataDir() {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return path.join(os.tmpdir(), "taksir-akun-data");
  }

  return path.join(process.cwd(), "data");
}
