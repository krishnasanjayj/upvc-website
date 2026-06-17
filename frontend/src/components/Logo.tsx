'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 40 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" /> {/* blue-600 */}
          <stop offset="100%" stopColor="#d97706" /> {/* amber-600 */}
        </linearGradient>
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Background shape - modern rounded icon container */}
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="22"
        className="fill-slate-50 dark:fill-slate-800/80 stroke-slate-200/80 dark:stroke-slate-700/80"
        strokeWidth="3.5"
      />

      {/* Left Pane / Door (Closed) */}
      <rect
        x="18"
        y="18"
        width="28"
        height="64"
        rx="6"
        stroke="url(#logoGrad)"
        strokeWidth="5"
        fill="url(#glassGrad)"
      />
      {/* Divider line in Left Pane */}
      <line
        x1="18"
        y1="46"
        x2="46"
        y2="46"
        stroke="url(#logoGrad)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Right Pane / Door (Slightly Offset / Sliding Open Concept) */}
      <g transform="translate(6, -4)">
        {/* Underlay shadow for right pane depth */}
        <rect
          x="46"
          y="22"
          width="28"
          height="64"
          rx="6"
          fill="url(#logoGrad)"
          fillOpacity="0.1"
        />
        {/* Right Pane Frame */}
        <rect
          x="46"
          y="22"
          width="28"
          height="64"
          rx="6"
          stroke="url(#logoGrad)"
          strokeWidth="5"
          fill="url(#glassGrad)"
        />
        {/* Divider line in Right Pane */}
        <line
          x1="46"
          y1="50"
          x2="74"
          y2="50"
          stroke="url(#logoGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Right Pane Handle */}
        <rect
          x="48"
          y="50"
          width="2.5"
          height="8"
          rx="1"
          fill="url(#logoGrad)"
        />
      </g>

      {/* Left Pane Handle */}
      <rect
        x="41"
        y="46"
        width="2.5"
        height="8"
        rx="1"
        fill="url(#logoGrad)"
      />
    </svg>
  );
}
