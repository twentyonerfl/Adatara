import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1000, height: 1000 };
export const contentType = "image/png";

const BASE_URL = "https://adatara.my.id";

export default function OgImage() {
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
        {/* Decorative ring */}
        <div
          style={{
            width: 310,
            height: 310,
            borderRadius: "50%",
            border: "2px solid rgba(212,175,55,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={`${BASE_URL}/logo.png`}
            width={270}
            height={270}
            style={{ borderRadius: "50%" }}
          />
        </div>

        {/* Brand name */}
        <div
          style={{
            marginTop: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          <p
            style={{
              color: "rgba(212,175,55,0.6)",
              fontSize: 18,
              letterSpacing: "0.35em",
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
          {/* Divider line */}
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
            Undangan digital elegan untuk pernikahan,{"\n"}ulang tahun, dan acara spesial Anda.
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
      </div>
    ),
    { ...size }
  );
}
