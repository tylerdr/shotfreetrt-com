import Image from "next/image";
import { cn } from "@/lib/utils";

type EditorialImageFrameProps = {
  src: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * The batch3 editorial illustrations are cut out on a transparent
 * background but carry a soft light vignette, so placed directly on the
 * site's dark background they read as a stark white glow rather than
 * mounted artwork. This wraps them in a warm-bone (--editorial-frame)
 * surface instead. The image file itself keeps its real alpha channel —
 * this is a CSS background, not a baked-in color.
 */
export function EditorialImageFrame({ src, width, height, sizes, priority, className }: EditorialImageFrameProps) {
  return (
    <div className={cn("flex items-center justify-center bg-editorial-frame p-6 sm:p-8", className)}>
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className="h-auto w-full max-w-md"
      />
    </div>
  );
}
