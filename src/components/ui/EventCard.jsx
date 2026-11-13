import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Wifi } from 'lucide-react';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { EVENT_CATEGORY_LABEL } from '../../data/events';

// イベントのカード（絆を見つける：一覧・TOPで共通）。主催は外部の事業者・団体で、クラミッケは紹介するだけ。
// 呼び出す側で <li> に包む（ColumnCard と同じ形）
export const EventCard = ({ event }) => (
  <Link to={`/community/${event.slug}`} className="group block h-full bg-white border border-gold/50 rounded-2xl p-3 transition-colors hover:border-gold hover:bg-cream-50">
    <PhotoPlaceholder image={event.image} art={event.art} alt={event.title} className="aspect-[4/3] rounded-xl" />
    <p className="mt-3 flex flex-wrap items-center gap-2">
      <span className="inline-block bg-cream-200 text-[0.7rem] px-2 py-0.5">{EVENT_CATEGORY_LABEL[event.category]}</span>
      <span className="inline-flex items-center gap-1 text-[0.7rem] text-[#2A7A73] font-bold">
        {event.format === 'online' ? <><Wifi size={13} aria-hidden="true" />オンライン</> : <><MapPin size={13} aria-hidden="true" />会場</>}
      </span>
    </p>
    <h3 className="font-round font-bold text-[0.95rem] leading-snug mt-2 mb-1 line-clamp-2 group-hover:text-gold-deep">{event.title}</h3>
    <p className="text-[0.75rem] text-ink-sub mb-2">主催：{event.organizer}</p>
    <p className="flex items-center gap-1.5 text-[0.8rem] font-bold">
      <CalendarDays size={15} className="text-gold-deep shrink-0" aria-hidden="true" />{event.dateLabel}
    </p>
    <p className="mt-1 text-[0.8rem]">{event.price}</p>
  </Link>
);
