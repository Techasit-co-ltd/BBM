import React from 'react';

export const BBMIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v12h16V6H4zm3 3h10v2H7V9zm0 4h7v2H7v-2z" />
  </svg>
);

export const CheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const PingIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11 2h2v5h-2V2zm0 15h2v5h-2v-5zm10-7v2h-5v-2h5zM8 10v2H3v-2h5zm11.1-6.9l1.4 1.4-3.5 3.5-1.4-1.4 3.5-3.5zM6.4 16.1l1.4 1.4-3.5 3.5-1.4-1.4 3.5-3.5zM19.1 19.1l-1.4 1.4-3.5-3.5 1.4-1.4 3.5 3.5zM6.4 4.9L5 6.3 8.5 9.8l1.4-1.4L6.4 4.9z" />
  </svg>
);

export const ChevronLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const SendIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

export const MoreVertical = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);