import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Illustration } from './Illustrations';

// 写真枠。本物の写真（image）があればそれを、なければ仮イラスト（art）を、どちらもなければ無地の枠を出す
export const PhotoPlaceholder = ({ image, art, alt = '', className = '' }) => {
  if (image) {
    return <img src={image} alt={alt} loading="lazy" className={`object-cover w-full ${className}`} />;
  }
  if (art) {
    return <Illustration name={art} className={`w-full ${className}`} />;
  }
  return (
    <div className={`flex items-center justify-center bg-cream-100 text-gold-line ${className}`} aria-hidden="true">
      <ImageIcon size={36} strokeWidth={1.4} />
    </div>
  );
};
