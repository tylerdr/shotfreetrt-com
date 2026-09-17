// Decorative editorial illustrations for specific article slugs. These are
// soft artistic vignettes on transparent backgrounds (batch2 asset set,
// provenance documented in documents/CHANGELOG.md), not clinical diagrams.
// alt is intentionally empty (purely decorative); the visible caption below
// each image is honest about what it is.
export type ArticleHeroImage = {
  src: string;
  width: number;
  height: number;
  caption: string;
};

export const articleHeroImages: Record<string, ArticleHeroImage> = {
  "trt-and-sleep-apnea": {
    src: "/media/sft-web-batch2-06.webp",
    width: 960,
    height: 640,
    caption: "Editorial illustration referencing sleep and recovery — decorative, not a clinical diagram."
  },
  "testosterone-boosting-foods": {
    src: "/media/sft-web-batch2-08.webp",
    width: 960,
    height: 640,
    caption: "Editorial illustration referencing daily health habits — decorative, not a clinical diagram."
  }
};
