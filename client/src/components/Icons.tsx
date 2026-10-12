import React from 'react';

// Reusable SVG line icons (Lucide-style). Using inline SVG instead of emojis
// guarantees identical rendering on every OS and lets icons inherit text color.
type IconProps = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const IconLayout: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M9 3v18M15 3v12" />
  </svg>
);

export const IconSearch: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const IconPlus: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconTrash: React.FC<IconProps> = ({ size = 14, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
);

export const IconX: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const IconChevronLeft: React.FC<IconProps> = ({ size = 14, className }) => (
  <svg {...base(size)} className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const IconChevronRight: React.FC<IconProps> = ({ size = 14, className }) => (
  <svg {...base(size)} className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const IconCheck: React.FC<IconProps> = ({ size = 14, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconAlert: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);
