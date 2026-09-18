import { Barlow_Condensed, Inter } from "next/font/google";

// Shared by both root layouts ((main) and (isolated)) so next/font only
// generates one font instance for the whole app.
export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-barlow-condensed",
});
