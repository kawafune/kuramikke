import React from 'react';
import { CircleArrowRight, ExternalLink } from 'lucide-react';

// 原案のボタン：ゴールドの面＋下の影線＋⊕→（spec 6章）。色は案A（濃ゴールド×白文字）
const variants = {
  primary: 'bg-gold-deep text-white shadow-[0_3px_0_theme(colors.gold.shadow)] hover:brightness-110',
  cta: 'bg-accent-red-text text-white shadow-[0_3px_0_#8E2814] hover:brightness-110',
  external: 'bg-ink-sub text-white shadow-[0_3px_0_#444] hover:brightness-110',
};

export const Button = ({ variant = 'primary', icon = 'arrow', className = '', children, ...props }) => {
  const Icon = icon === 'external' ? ExternalLink : icon === 'arrow' ? CircleArrowRight : null;
  const Tag = props.href ? 'a' : 'button';
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-8 py-2 rounded font-round font-bold text-[0.9rem] tracking-[0.1em] transition active:translate-y-[2px] active:shadow-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {Icon && <Icon size={18} strokeWidth={2.2} aria-hidden="true" />}
    </Tag>
  );
};
