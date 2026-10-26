import React from 'react';
import { SectionTitle } from '../ui/SectionTitle';
import { RichText } from '../ui/RichText';

// 掲載事業者（広告）の欄。審査基準と掲載料が決まるまでは、募集中の枠だけを出す
export const ListingSection = ({ groups, adNote }) => (
  <section className="mt-12" aria-labelledby="listing-title">
    <SectionTitle as="h2">
      <span id="listing-title">掲載事業者のご紹介</span>
    </SectionTitle>
    <p className="mb-6 text-[0.85rem] bg-cream-50 p-4">
      <span className="inline-block bg-gold-deep text-white text-[0.7rem] px-2 py-0.5 mr-2 align-middle">広告</span>
      <RichText text="このページの事業者の紹介は、広告です。掲載の審査基準は、準備ができ次第、公開します。【要人間確認：紹介料（成果報酬）の扱いを決めてから、文面を確定する】" />
      {adNote && <><br /><RichText text={adNote} /></>}
    </p>
    <div className="grid gap-4 sm:grid-cols-2">
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
