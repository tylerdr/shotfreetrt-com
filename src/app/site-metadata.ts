import type { Metadata } from "next";

// Fields shared by both root layouts ((main) and (isolated)) so the GSC
// verification tag, favicon, and metadataBase are identical everywhere,
// regardless of which root layout a route belongs to.
export const baseSiteMetadata: Metadata = {
  metadataBase: new URL("https://shotfreetrt.com"),
  icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" },
  verification: { google: "eFS_GYPi2qp4xAw2BQ1BEaj0aA8-X5NpuY8rxCfKmpU" },
};
