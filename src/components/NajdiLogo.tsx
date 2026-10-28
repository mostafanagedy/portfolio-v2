import React from "react";

interface NajdiLogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export default function NajdiLogo({
  width = 56,
  height = 56,
  className = "najdi-logo__icon",
}: NajdiLogoProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 128 128"
      role="img"
      aria-label="Najdi monogram"
    >
      <g data-fill="" fill="var(--color-primary, #FFA116)">
        <path d="M18 22 L64 10 L64 84 Q64 87 62 89 L34 114 Q32.5 115.5 31 115.5 Q28.5 115.5 28.5 112.5 L28.5 46 L18 35 Z" />
        <path d="M74 22 L102 12 L112 22 L112 84 Q112 86.5 110.5 88.5 L82 116 L74 123 Z" />
        <rect x="66" y="40" width="8" height="22" rx="2" transform="skewX(-15)" />
      </g>
    </svg>
  );
}
