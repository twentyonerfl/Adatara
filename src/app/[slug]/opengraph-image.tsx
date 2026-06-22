import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const size = { width: 1000, height: 1000 };
export const contentType = "image/png";

const BASE_URL = "https://adatara.my.id";

function toAbsoluteUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function extractCoverImage(dataJson: any, templateThumbnail?: string | null): string | null {
  try {
    const cover = dataJson?.cover;
    if (cover?.background?.type === "image" && cover?.background?.value) {
      return toAbsoluteUrl(cover.background.value);
    }
    if (cover?.foto && typeof cover.foto === "string") {
      return toAbsoluteUrl(cover.foto);
    }
    if (templateThumbnail) {
      return toAbsoluteUrl(templateThumbnail);
    }
  } catch {}
  return null;
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const invitation = await db.invitation.findUnique({
    where: { slug },
    include: { template: true },
  }).catch(() => null);

  if (!invitation) {
    // Fallback: Adatara branding
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(145deg, #064e3b, #041f18)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={`${BASE_URL}/logo.png`}
            width={300}
            height={300}
            style={{ borderRadius: "50%" }}
          />
        </div>
      ),
      { ...size }
    );
  }

  const dataJson = invitation.data_undangan_json as any;
  const namaAcara: string = dataJson?.cover?.nama_acara || "Undangan Spesial";
  const coverImageUrl = extractCoverImage(dataJson, invitation.template.thumbnail);

  if (coverImageUrl) {
    // Show cover photo full-bleed with couple name overlay at the bottom
    return new ImageResponse(
      (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "flex-end",
            overflow: "hidden",
          }}
        >
          {/* Cover image */}
          <img
            src={coverImageUrl}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Gradient overlay at bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "48%",
              background: "linear-gradient(to bottom, transparent, rgba(6,28,22,0.88))",
            }}
          />
          {/* Logo top-left badge */}
          <div
            style={{
              position: "absolute",
              top: 36,
              left: 44,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <img
              src={`${BASE_URL}/logo.png`}
              width={56}
              height={56}
              style={{ borderRadius: "50%" }}
            />
            <span
              style={{
                color: "rgba(212,175,55,0.9)",
                fontSize: 22,
                letterSpacing: "0.18em",
                fontFamily: "serif",
                textTransform: "uppercase",
              }}
            >
              Adatara
            </span>
          </div>
          {/* Text overlay at bottom */}
          <div
            style={{
              position: "relative",
              padding: "0 56px 52px",
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <p
              style={{
                color: "rgba(212,175,55,0.85)",
                fontSize: 20,
                margin: 0,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontFamily: "serif",
              }}
            >
              UNDANGAN DIGITAL
            </p>
            <h1
              style={{
                color: "#fff",
                fontSize: 64,
                fontWeight: 700,
                margin: "10px 0 0",
                fontFamily: "serif",
                lineHeight: 1.1,
              }}
            >
              {namaAcara}
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 20,
                margin: "12px 0 0",
                fontFamily: "sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              adatara.my.id/{slug}
            </p>
          </div>
        </div>
      ),
      { ...size }
    );
  }

  // No cover image — styled branded card with couple name
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(145deg, #064e3b 0%, #0a3d2f 40%, #041f18 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <img
          src={`${BASE_URL}/logo.png`}
          width={220}
          height={220}
          style={{ borderRadius: "50%" }}
        />
        <div
          style={{
            marginTop: 36,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              color: "rgba(212,175,55,0.6)",
              fontSize: 18,
              letterSpacing: "0.3em",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            UNDANGAN DIGITAL
          </p>
          <h1
            style={{
              color: "#d4af37",
              fontSize: 68,
              fontWeight: 700,
              margin: "14px 0 0",
              textAlign: "center",
              fontFamily: "serif",
            }}
          >
            {namaAcara}
          </h1>
          <div
            style={{
              width: 160,
              height: 1,
              background: "rgba(212,175,55,0.35)",
              margin: "20px 0",
            }}
          />
          <p
            style={{
              color: "rgba(245,245,220,0.65)",
              fontSize: 22,
              margin: 0,
            }}
          >
            Lihat Undangan di adatara.my.id/{slug}
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
