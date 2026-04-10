import Image from "next/image";

import { cn } from "@/lib/utils";

const LOGO_SRC = "/brand/dhofar-insurance-logo.svg";

export type BrandLogoProps = {
  className?: string;
  /** Renders as horizontal wordmark; native aspect ~2.6:1 */
  width?: number;
  height?: number;
  priority?: boolean;
};

/**
 * Dhofar Insurance wordmark — source: `/public/brand/dhofar-insurance-logo.svg`.
 */
export function BrandLogo({
  className,
  width = 220,
  height = Math.round((width * 615) / 1602),
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Dhofar Insurance"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={cn("h-auto w-full object-contain object-left", className)}
      style={{ maxWidth: width }}
    />
  );
}
