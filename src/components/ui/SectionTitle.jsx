import React from 'react';

// 原案の見出し：ゴールドで中央揃え、下に短い下線
export const SectionTitle = ({ as: Tag = 'h2', className = '', children }) => (
  <Tag className={`text-center text-gold-deep text-[1.25rem] md:text-[1.4rem] tracking-[0.12em] mb-8 md:mb-10 ${className}`}>
    {children}
    <span className="block w-9 h-[3px] bg-gold mx-auto mt-2" aria-hidden="true" />
  </Tag>
);
