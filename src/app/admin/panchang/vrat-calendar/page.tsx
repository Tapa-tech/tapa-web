"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VratCalendarRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/panchang");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-6 h-6 border-2 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
