"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { submitRsvp } from "./actions";
import { 
  Volume2,
  VolumeX
} from "lucide-react";

import { CoverPreview, PembukaPreview } from "../../dashboard/templates/BuilderTabsCoverPembuka";
import { ProfilPreview, AcaraPreview } from "../../dashboard/templates/BuilderTabsProfilAcara";
import { CeritaPreview, PenutupPreview } from "../../dashboard/templates/BuilderTabsCeritaPenutup";

type InvitationType = {
  id: string;
  slug: string;
  data_undangan_json: any;
  template: {
    kategori: string;
    nama_template: string;
  };
};

type WishType = {
  id: string;
  nama_tamu: string;
  kehadiran: string;
  ucapan: string | null;
  created_at: Date;
};

function ScaledSection({ children, scale }: { children: React.ReactNode; scale: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(512);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setHeight(entry.contentRect.height);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      style={{ 
        width: "100%", 
        height: height * scale, 
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "288px",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          position: "absolute",
          left: "50%",
          marginLeft: "-144px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function PublicInvitationView({
  invitation,
  wishes: initialWishes
}: {
  invitation: InvitationType;
  wishes: WishType[];
}) {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Tamu Undangan";

  const data = invitation.data_undangan_json;
  const musicUrl = data.cover?.music_url;
  const bahasa: "id" | "en" = data.cover?.bahasa || "id";
  const kategoriId = invitation.template.kategori || "";

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  const youtubeId = getYoutubeId(musicUrl || "");
  const isYoutube = !!youtubeId;

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wishes, setWishes] = useState<WishType[]>(initialWishes);

  // RSVP Form States
  const [namaTamu, setNamaTamu] = useState(guestName !== "Tamu Undangan" ? guestName : "");
  const [kehadiran, setKehadiran] = useState<"HADIR" | "TIDAK_HADIR" | "RAGU_RAGU">("HADIR");
  const [jumlahTamu, setJumlahTamu] = useState(1);
  const [ucapan, setUcapan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Clipboard copies
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [scale, setScale] = useState(1.555);

  useEffect(() => {
    const updateScale = () => {
      const width = Math.min(window.innerWidth, 448);
      setScale(width / 288);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpen = () => {
    setIsOpen(true);
    if (isYoutube) {
      setIsPlaying(true);
    } else if (audioRef.current && musicUrl) {
      const startSec = Number(data.cover?.music_start_second || 0);
      if (startSec > 0 && audioRef.current.currentTime === 0) {
        audioRef.current.currentTime = startSec;
      }
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Autoplay blocked: ", err));
    }
  };

  const toggleMusic = () => {
    if (isYoutube) {
      setIsPlaying(!isPlaying);
    } else {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const startSec = Number(data.cover?.music_start_second || 0);
        if (startSec > 0 && audioRef.current.currentTime === 0) {
          audioRef.current.currentTime = startSec;
        }
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Failed to play: ", err));
      }
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaTamu) return;

    setSubmitting(true);
    setFormError(null);
    setFormSuccess(false);

    try {
      const res = await submitRsvp({
        invitationId: invitation.id,
        namaTamu,
        kehadiran,
        jumlahTamu,
        ucapan: ucapan.trim() || undefined
      });

      if (res?.error) {
        setFormError(res.error);
      } else if (res?.success) {
        setFormSuccess(true);
        if (ucapan.trim()) {
          const newWish: WishType = {
            id: Math.random().toString(),
            nama_tamu: namaTamu,
            kehadiran,
            ucapan: ucapan.trim(),
            created_at: new Date()
          };
          setWishes(prev => [newWish, ...prev]);
        }
        setUcapan("");
      }
    } catch (err) {
      setFormError("Gagal mengirim RSVP. Periksa koneksi internet Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-x-hidden">
      {/* Dynamic Font Loader */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:wght@300;400;600;700&family=Great+Vibes&family=Inter:wght@300;400;600;700;900&family=Lato:wght@300;400;700&family=Outfit:wght@300;400;600;700;900&family=Pinyon+Script&family=Playfair+Display:wght@400;600;700;900&family=Poppins:wght@300;400;600;700;900&family=Roboto:wght@300;400;500;700&family=Sacramento&display=swap" rel="stylesheet" />

      {/* Background Music Object */}
      {musicUrl && !isYoutube && (
        <audio ref={audioRef} src={musicUrl} loop />
      )}

      {musicUrl && isYoutube && isPlaying && (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&enablejsapi=1${
            data.cover?.music_start_second ? `&start=${data.cover.music_start_second}` : ""
          }`}
          allow="autoplay"
          className="w-0 h-0 absolute pointer-events-none opacity-0"
        />
      )}

      {/* Floating Audio Control */}
      {isOpen && musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-40 p-3.5 bg-indigo-600 border border-indigo-500/30 text-white rounded-full shadow-lg shadow-indigo-600/20 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </button>
      )}

      {/* SCREEN 1: COVER OVERLAY */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100vh" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
          >
            <div
              className="rounded-2xl border border-slate-800"
              style={{
                width: "288px",
                height: "512px",
                transform: `scale(${scale})`,
                transformOrigin: "center center",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              }}
            >
              <CoverPreview 
                data={data.cover} 
                meta={{ kategori: kategoriId, bahasa: bahasa }} 
                onOpen={handleOpen} 
                guestName={guestName}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SCREEN 2: MAIN SCROLLABLE INVITATION */}
      {isOpen && (
        <div className="w-full max-w-md mx-auto bg-slate-950 md:rounded-2xl md:border border-slate-900 md:my-6 shadow-2xl relative overflow-hidden">
          <ScaledSection scale={scale}>
            <PembukaPreview data={data.pembuka} coverData={data.cover} bahasa={bahasa} />
          </ScaledSection>

          <ScaledSection scale={scale}>
            <ProfilPreview data={data.profil} />
          </ScaledSection>

          <ScaledSection scale={scale}>
            <AcaraPreview data={data.acara} />
          </ScaledSection>

          {data.cerita && (
            <ScaledSection scale={scale}>
              <CeritaPreview data={data.cerita} />
            </ScaledSection>
          )}

          <ScaledSection scale={scale}>
            <PenutupPreview 
              data={data.penutup}
              wishes={wishes}
              onRsvpSubmit={handleRsvpSubmit}
              namaTamu={namaTamu}
              setNamaTamu={setNamaTamu}
              kehadiran={kehadiran}
              setKehadiran={setKehadiran}
              jumlahTamu={jumlahTamu}
              setJumlahTamu={setJumlahTamu}
              ucapan={ucapan}
              setUcapan={setUcapan}
              submitting={submitting}
              formSuccess={formSuccess}
              formError={formError}
              onCopyClick={handleCopy}
              copiedIndex={copiedIndex}
            />
          </ScaledSection>
        </div>
      )}
    </div>
  );
}
