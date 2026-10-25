import React from 'react';
import { MapPin, User } from 'lucide-react';
import { FeatureTag } from './Tags';
import { PhotoPlaceholder } from './PhotoPlaceholder';

// 出逢いのイベントカード（TOP・出逢いTOP・一覧で共通）
export const EventCard = ({ event, bordered = false }) => (
  <article className={`h-full bg-white p-3 md:p-[10px] flex flex-col ${bordered ? 'border border-gold' : ''}`}>
    <PhotoPlaceholder className="aspect-[4/3]" />
    <h3 className="font-sans font-normal text-[0.9rem] leading-relaxed mt-3 mb-2 line-clamp-2">
      <a href="#" className="hover:text-gold-deep">{event.title}</a>
    </h3>
    <p className="bg-cream-200 text-center py-1 mb-2">
      <span className="text-[1.25rem] tracking-[0.1em]">{event.date}</span>
      <span className="text-[0.7rem] ml-2">開催決定</span>
    </p>
    <p className="flex items-center gap-1 text-[0.8rem]">
      <MapPin size={16} className="text-gold-deep shrink-0" aria-hidden="true" />{event.place}
    </p>
    <p className="flex items-center gap-1 text-[0.8rem] mb-3">
      <User size={16} className="text-gold-deep shrink-0" aria-hidden="true" />
      参加人数
      <span className="text-accent-red-text text-[1.3rem] leading-none mx-1">{event.joined}</span>
      <span>/{event.capacity}</span>
    </p>
    <ul className="grid grid-cols-2 gap-[6px] mt-auto">
      {event.tags.map((t) => <li key={t}><FeatureTag name={t} /></li>)}
    </ul>
  </article>
);
