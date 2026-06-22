"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LogOut, Loader2 } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
        },
      });
    } catch (err) {
      console.error("Gagal keluar akun: ", err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-white/60 hover:text-white hover:bg-red-950/40 border border-transparent hover:border-red-900/30 transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Keluar...
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4" />
          Keluar Akun
        </>
      )}
    </button>
  );
}
