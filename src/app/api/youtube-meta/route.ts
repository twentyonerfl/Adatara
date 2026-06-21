import { NextRequest, NextResponse } from "next/server";

function getYoutubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Parameter url tidak ditemukan" }, { status: 400 });
    }

    const videoId = getYoutubeId(url) || url; // Fallback if user just entered the 11-char ID
    if (!videoId || videoId.length !== 11) {
      return NextResponse.json({ error: "Link YouTube tidak valid atau ID tidak ditemukan" }, { status: 400 });
    }

    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`;
    const res = await fetch(oembedUrl);

    if (!res.ok) {
      // Fallback metadata if oembed request fails
      return NextResponse.json({
        title: "Video YouTube",
        author_name: "YouTube Channel",
        thumbnail_url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        video_id: videoId,
      });
    }

    const data = await res.json();
    return NextResponse.json({
      title: data.title || "Video YouTube",
      author_name: data.author_name || "YouTube Channel",
      thumbnail_url: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      video_id: videoId,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("YouTube metadata proxy error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
