import React from 'react';
import { Image } from 'lucide-react';

// 写真が用意できるまでの仮枠
export const PhotoPlaceholder = ({ className = '' }) => (
  <div className={`flex items-center justify-center bg-cream-100 text-gold-line ${className}`} aria-hidden="true">
    <Image size={36} strokeWidth={1.4} />
  </div>
);
