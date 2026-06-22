"use client";

import { useState } from "react";
import { Link as LinkIcon, Check, Copy } from "lucide-react";

export function CopyButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Bangun URL absolut berdasarkan window location
    const url = `${window.location.origin}/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin link: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold ${
        copied
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-white border border-[#064e3b]/20 text-[#064e3b]/80 hover:text-[#064e3b] hover:bg-[#064e3b]/5"
      }`}
      title="Salin Link Undangan"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span>Tersalin</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Salin Link</span>
        </>
      )}
    </button>
  );
}
