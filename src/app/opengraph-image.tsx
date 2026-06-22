import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BASE_URL = "https://adatara.my.id";

export default async function OgImage() {
  // Fetch actual homepage background image from database
  let bgImage: string | null = null;
  try {
    const settings = await db.homepageSetting.findFirst();
    if (settings?.bg_image) {
      const raw = settings.bg_image;
      // next/og requires absolute URLs — convert relative paths
      bgImage = raw.startsWith("http") ? raw : `${BASE_URL}${raw.startsWith("/") ? "" : "/"}${raw}`;
    }
  } catch {}

  // If a real background image exists, display it full-bleed with overlay + branding
  if (bgImage) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background image */}
          <img
            src={bgImage}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(4,30,23,0.5) 0%, rgba(4,30,23,0.72) 100%)",
              display: "flex",
            }}
          />
          {/* Branding */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px",
            }}
          >
            <img
              src={`${BASE_URL}/logo.png`}
              width={120}
              height={120}
              style={{ borderRadius: "50%", marginBottom: 24 }}
            />
            <p
              style={{
                color: "rgba(212,175,55,0.85)",
                fontSize: 18,
                letterSpacing: "0.3em",
                margin: 0,
                textTransform: "uppercase",
                fontFamily: "serif",
              }}
            >
              PLATFORM UNDANGAN DIGITAL
            </p>
            <h1
              style={{
                color: "#d4af37",
                fontSize: 80,
                fontWeight: 900,
                letterSpacing: "0.1em",
                margin: "8px 0 0",
                textTransform: "uppercase",
                fontFamily: "serif",
              }}
            >
              ADATARA
            </h1>
            <p
              style={{
                color: "rgba(245,245,220,0.80)",
                fontSize: 22,
                margin: "16px 0 0",
                textAlign: "center",
                maxWidth: 640,
                lineHeight: 1.5,
                fontFamily: "serif",
              }}
            >
              Undangan digital elegan untuk pernikahan, ulang tahun, dan acara spesial Anda.
            </p>
            <p
              style={{
                color: "rgba(212,175,55,0.6)",
                fontSize: 18,
                marginTop: 20,
                letterSpacing: "0.06em",
                fontFamily: "serif",
              }}
            >
              adatara.my.id
            </p>
          </div>
        </div>
      ),
      { ...size }
    );
  }

  // Fallback: dark branded card with just logo
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
          fontFamily: "serif",
          padding: "60px",
        }}
      >
        <img
          src={`${BASE_URL}/logo.png`}
          width={200}
          height={200}
          style={{ borderRadius: "50%", marginBottom: 32 }}
        />
        <p
          style={{
            color: "rgba(212,175,55,0.7)",
            fontSize: 18,
            letterSpacing: "0.3em",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          PLATFORM UNDANGAN DIGITAL
        </p>
        <h1
          style={{
            color: "#d4af37",
            fontSize: 88,
            fontWeight: 900,
            letterSpacing: "0.12em",
            margin: "10px 0 0",
            textTransform: "uppercase",
          }}
        >
          ADATARA
        </h1>
        <div
          style={{
            width: 200,
            height: 1,
            background: "rgba(212,175,55,0.4)",
            margin: "20px 0",
          }}
        />
        <p
          style={{
            color: "rgba(245,245,220,0.75)",
            fontSize: 26,
            margin: 0,
            textAlign: "center",
            maxWidth: 640,
            lineHeight: 1.4,
          }}
        >
          Undangan digital elegan untuk pernikahan, ulang tahun, dan acara spesial Anda.
        </p>
        <p
          style={{
            color: "rgba(212,175,55,0.55)",
            fontSize: 20,
            marginTop: 24,
            letterSpacing: "0.08em",
          }}
        >
          adatara.my.id
        </p>
      </div>
    ),
    { ...size }
  );
}
