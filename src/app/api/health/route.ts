import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

type Health = {
  db: { ok: boolean; error: string | null };
  uploads: { ok: boolean; path: string; error: string | null };
};

export async function GET() {
  const result: Health = {
    db: { ok: false, error: null },
    uploads: { ok: false, path: "", error: null },
  };

  // DB connectivity test
  try {
    await pool.query("SELECT 1");
    result.db.ok = true;
  } catch (e) {
    const err = e as Error;
    result.db.error = err.message || String(e);
  }

  // Uploads write test
  try {
    const baseUploads =
      process.env.UPLOADS_DIR || path.join(process.cwd(), "public", "uploads");
    result.uploads.path = baseUploads;
    await mkdir(baseUploads, { recursive: true });
    const filePath = path.join(baseUploads, ".health-check");
    await writeFile(filePath, "ok");
    await unlink(filePath);
    result.uploads.ok = true;
  } catch (e) {
    const err = e as Error;
    result.uploads.error = err.message || String(e);
  }

  return NextResponse.json(result);
}
