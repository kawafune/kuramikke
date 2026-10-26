import React from 'react';
import { SectionTitle } from '../ui/SectionTitle';
import { RichText } from '../ui/RichText';

// 掲載事業者（広告）の欄。審査基準と掲載料が決まるまでは、募集中の枠だけを出す。
// quiet＝亡くなった直後など、いま必要になった方向けのページ。広告を控えめにする（docs/shukatsu/ad-rules.md）
export const ListingSection = ({ groups, adNote, quiet = false }) => (
  <section className={quiet ? 'mt-10 pt-6 border-t border-gold-line' : 'mt-12'} aria-labelledby="listing-title">
    {quiet ? (
      <h2 id="listing-title" className="font-round font-bold text-[1rem] text-ink-sub mb-3">相談できる事業者（広告）</h2>
    ) : (
      <SectionTitle as="h2">
        <span id="listing-title">掲載事業者のご紹介</span>
      </SectionTitle>
    )}

    <p className="mb-4 text-[0.85rem] bg-cream-50 p-4 leading-relaxed">
      <span className="inline-block bg-gold-deep text-white text-[0.7rem] px-2 py-0.5 mr-2 align-middle">広告</span>
      <RichText text="このページの事業者の紹介は、広告です。掲載の審査基準は、準備ができ次第、公開します。【要人間確認：紹介料（成果報酬）の扱いを決めてから、文面を確定する】" />
      {adNote && <><br /><RichText text={adNote} /></>}
    </p>
    {/* 営業の電話を、クラミッケがしていると誤解されないための注記 */}
    <p className="mb-6 text-[0.85rem] leading-relaxed">
      資料請求やお問い合わせをされると、<strong>各専門の事業者からご連絡があります</strong>。クラミッケから、お電話することはありません。
    </p>

    <div className={`grid gap-4 ${quiet ? '' : 'sm:grid-cols-2'}`}>
      {groups.map((g) => (
        <div key={g.group} className="border border-dashed border-gold p-5 bg-white text-center">
          <h3 className="font-round font-bold text-gold-deep mb-1">{g.group}</h3>
          <p className="text-[0.85rem] mb-3">{g.text}</p>
          <p className="inline-block bg-cream-200 text-[0.8rem] px-3 py-1">掲載事業者を募集します（準備中）</p>
        </div>
      ))}
    </div>
  </section>
);
