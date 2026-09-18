"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isAnalyticsExemptPath, trackPageView } from "@/lib/analytics";

const TENANT_ID = "015fd669-36bc-4847-9d7d-d0ad20bf90b5";

export { TENANT_ID };

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lastPathname = useRef("");

  useEffect(() => {
    if (pathname !== lastPathname.current) {
      lastPathname.current = pathname;
      if (!isAnalyticsExemptPath(pathname)) {
        trackPageView(TENANT_ID, { path: pathname });
      }
    }
  }, [pathname]);

  return <>{children}</>;
}
