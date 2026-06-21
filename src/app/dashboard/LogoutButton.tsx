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
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-[#064e3b]/50 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider"
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
