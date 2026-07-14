import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
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

export default async function GuestOgImage({
  params,
}: {
  params: Promise<{ slug: string; guestName: string }>;
}) {
  const { slug, guestName } = await params;
  const decodedGuestName = decodeURIComponent(guestName.replace(/\+/g, " "));

  const invitation = await db.invitation
    .findUnique({
      where: { slug },
      include: { template: true },
    })
    .catch(() => null);

  if (!invitation) {
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
            width={240}
            height={240}
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
    return new ImageResponse(
      (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#064e3b",
            overflow: "hidden",
          }}
        >
          {/* Blurred Background to fill landscape banner ratio perfectly */}
          <img
            src={coverImageUrl}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(24px) brightness(0.4)",
              transform: "scale(1.1)",
            }}
          />

          {/* Full Uncropped Photo Container */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={coverImageUrl}
              style={{
                height: "100%",
                maxHeight: "630px",
                objectFit: "contain",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              }}
            />
          </div>

          {/* Dark Gradient Overlay for readability at bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
              background:
                "linear-gradient(to bottom, transparent, rgba(4, 25, 19, 0.94))",
            }}
          />

          {/* Logo & Brand Tag (Top Left) */}
          <div
            style={{
              position: "absolute",
              top: 28,
              left: 36,
              display: "flex",
              alignItems: "center",
              gap: 12,
              backgroundColor: "rgba(6, 78, 59, 0.75)",
              padding: "8px 20px",
              borderRadius: 30,
              border: "1px solid rgba(212,175,55,0.4)",
            }}
          >
            <img
              src={`${BASE_URL}/logo.png`}
              width={36}
              height={36}
              style={{ borderRadius: "50%" }}
            />
            <span
              style={{
                color: "#d4af37",
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "0.2em",
                fontFamily: "serif",
                textTransform: "uppercase",
              }}
            >
              ADATARA
            </span>
          </div>

          {/* Text Title & Guest Overlay (Bottom Left) */}
          <div
            style={{
              position: "absolute",
              bottom: 32,
              left: 40,
              right: 40,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p
              style={{
                color: "#d4af37",
                fontSize: 16,
                margin: 0,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "serif",
                fontWeight: 700,
              }}
            >
              UNDANGAN SPESIAL UNTUK: {decodedGuestName}
            </p>
            <h1
              style={{
                color: "#ffffff",
                fontSize: 46,
                fontWeight: 800,
                margin: "4px 0 0",
                fontFamily: "serif",
                lineHeight: 1.15,
                textShadow: "0 4px 12px rgba(0,0,0,0.6)",
              }}
            >
              {namaAcara}
            </h1>
          </div>
        </div>
      ),
      { ...size }
    );
  }

  // Fallback branded banner
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(145deg, #064e3b 0%, #0a3d2f 40%, #041f18 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <img
          src={`${BASE_URL}/logo.png`}
          width={160}
          height={160}
          style={{ borderRadius: "50%" }}
        />
        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              color: "rgba(212,175,55,0.8)",
              fontSize: 16,
              letterSpacing: "0.2em",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            UNDANGAN UNTUK {decodedGuestName}
          </p>
          <h1
            style={{
              color: "#d4af37",
              fontSize: 52,
              fontWeight: 800,
              margin: "10px 0 0",
              textAlign: "center",
              fontFamily: "serif",
            }}
          >
            {namaAcara}
          </h1>
        </div>
      </div>
    ),
    { ...size }
  );
}
