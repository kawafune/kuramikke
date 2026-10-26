import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Mail } from 'lucide-react';
import { RichText } from '../ui/RichText';
import { Button } from '../ui/Button';
import { useSite } from '../../context/siteContext';
import { CONTACT_EMAIL } from '../../config/site';

// 終活ガイドの本文の部品（data/shukatsuGuide.js の blocks を描画する）
const Block = ({ block }) => {
  const { isAvailable } = useSite();

  switch (block.type) {
    case 'p':
      return <p className="mb-5"><RichText text={block.text} /></p>;

    case 'ul':
      return (
        <ul className="mb-5 space-y-2">
          {block.items.map((t) => (
            <li key={t} className="flex gap-3"><span className="mt-[0.8em] w-2 h-2 rounded-full bg-gold shrink-0" aria-hidden="true" /><span><RichText text={t} /></span></li>
          ))}
        </ul>
      );

    case 'ol':
      return (
        <ol className="mb-5 space-y-4">
          {block.items.map((it, i) => (
            <li key={it.title} className="flex gap-4">
              <span className="shrink-0 w-9 h-9 rounded-full bg-gold-deep text-white font-round font-bold flex items-center justify-center" aria-hidden="true">{i + 1}</span>
              <span>
                <strong className="block font-round text-[1rem]">{it.title}</strong>
                <span className="block"><RichText text={it.text} /></span>
                {it.to && <Link to={it.to} className="text-gold-deep underline underline-offset-4 text-[0.9rem]">くわしく見る</Link>}
              </span>
            </li>
          ))}
        </ol>
      );

    case 'cards':
      return (
        <ul className="mb-6 grid gap-3 sm:grid-cols-2">
          {block.items.map((c) => (
            <li key={c.title} className="border border-gold bg-white p-4">
              <strong className="block font-round text-gold-deep mb-1">{c.title}</strong>
              <span className="text-[0.9rem]"><RichText text={c.text} /></span>
            </li>
          ))}
        </ul>
      );

    case 'callout':
      // 原案の二重枠
      return (
        <div className="mb-6 border border-gold p-1">
          <div className="border border-gold bg-cream-50 p-5">
            <strong className="block font-round text-gold-deep mb-1">{block.title}</strong>
            <p><RichText text={block.text} /></p>
          </div>
        </div>
      );

    case 'link':
      return (!block.needs || isAvailable(block.needs))
        ? <p className="mb-6"><Button to={block.to}>{block.label}</Button></p>
        : <p className="mb-6 text-[0.9rem] bg-cream-50 p-3">{block.label}（準備中）</p>;

    case 'download':
      return (
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <span aria-disabled="true" className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 bg-ink-sub/70 text-white font-round font-bold text-[0.85rem] rounded cursor-not-allowed">
            <Download size={18} aria-hidden="true" />{block.label}
          </span>
          <span className="text-[0.85rem]">{block.note}</span>
        </div>
      );

    case 'pricing':
      return (
        <ul className="mb-6 grid gap-4 md:grid-cols-2">
          {block.plans.map((pl) => (
            <li key={pl.name} className={`relative border-2 p-5 bg-white ${pl.badge ? 'border-accent-red-text' : 'border-gold'}`}>
              {pl.badge && <span className="absolute -top-3 left-4 bg-accent-red-text text-white text-[0.75rem] font-bold px-3 py-0.5">{pl.badge}</span>}
              <strong className="block font-round text-gold-deep mb-1">{pl.name}</strong>
              <p className="mb-3"><span className="text-[1.8rem] font-round font-bold">{pl.price}</span><span className="text-[0.85rem] ml-1">{pl.unit}</span></p>
              <ul className="space-y-1 text-[0.85rem]">
                {pl.lines.map((l) => <li key={l}>・<RichText text={l} /></li>)}
              </ul>
            </li>
          ))}
        </ul>
      );

    case 'mailto': {
      // お問い合わせ先のメールアドレス（config/site.js）が決まるまでは「準備中」
      if (!CONTACT_EMAIL) {
        return <p className="mb-6 bg-cream-50 p-4 text-[0.9rem]"><RichText text="お申込みの窓口は、ただいま準備中です。【要人間確認：config/site.js の CONTACT_EMAIL にメールアドレスを入れる】" /></p>;
      }
      const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(block.subject)}&body=${encodeURIComponent(block.body)}`;
      return (
        <p className="mb-6">
          <Button href={href} icon={null}><Mail size={18} aria-hidden="true" />{block.label}</Button>
        </p>
      );
    }

    default:
      return null;
  }
};

export const GuideBlocks = ({ blocks }) => (
  <>{blocks.map((b, i) => <Block key={i} block={b} />)}</>
);
