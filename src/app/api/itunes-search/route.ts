import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get("term");

    if (!term) {
      return NextResponse.json({ results: [] });
    }

    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=15`;
    const res = await fetch(itunesUrl);

    if (!res.ok) {
      throw new Error(`iTunes API returned status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("iTunes search proxy error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
