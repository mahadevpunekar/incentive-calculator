"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

type MiniSparklineProps = {
  data: number[];
  color?: string;
  className?: string;
};

export function MiniSparkline({ data, color = "#22c55e", className }: MiniSparklineProps) {
  const { path, area } = useMemo(() => {
    if (data.length < 2) return { path: "", area: "" };
    const w = 80;
    const h = 28;
    const pad = 2;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((v, i) => ({
      x: pad + (i / (data.length - 1)) * (w - pad * 2),
      y: pad + (1 - (v - min) / range) * (h - pad * 2),
    }));

    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;

    return { path: linePath, area: areaPath };
  }, [data]);

  return (
    <svg
      viewBox="0 0 80 28"
      className={cn("w-20 h-7 shrink-0", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={area} fill={color} fillOpacity={0.1} />
      <path d={path} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
