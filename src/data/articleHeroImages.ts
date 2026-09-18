// Decorative editorial illustrations for specific article slugs. These are
// soft artistic vignettes on transparent backgrounds (batch3 asset set,
// provenance documented in documents/CHANGELOG.md), not clinical diagrams.
// alt is intentionally empty (purely decorative); the visible caption below
// each image is content-specific rather than describing the art's own
// production (no "decorative"/"not a clinical diagram" framing).
export type ArticleHeroImage = {
  src: string;
  width: number;
  height: number;
  caption: string;
};

export const articleHeroImages: Record<string, ArticleHeroImage> = {
  "trt-and-sleep-apnea": {
    src: "/media/sft-web-batch3-06.webp",
    width: 960,
    height: 640,
    caption: "Sleep quality shapes how symptoms and energy show up during the day."
  },
  "testosterone-boosting-foods": {
    src: "/media/sft-web-batch3-08.webp",
    width: 960,
    height: 640,
    caption: "Everyday training and nutrition habits that support metabolic health."
  }
};
