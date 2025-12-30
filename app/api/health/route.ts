import { NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";

export async function GET() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    await pool.query("SELECT 1");
    return NextResponse.json({ status: "ok", db: "connected" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "DB not connected" },
      { status: 500 }
    );
  }
}
