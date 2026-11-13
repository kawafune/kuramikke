import React from 'react';
import { SectionTitle } from '../ui/SectionTitle';
import { Button } from '../ui/Button';
import { EventCard } from '../ui/EventCard';
import { getEvents } from '../../data/events';
import { useSite } from '../../context/siteContext';

export const CommunitySection = ({ onNavigate }) => {
  const { devMode } = useSite();
  const events = getEvents(devMode).slice(0, 8);
  if (events.length === 0) return null;
  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <SectionTitle>絆を見つける｜セミナー・交流会</SectionTitle>
      <div className="max-w-content mx-auto md:px-4">
        {/* スマホは横に送る。PCは3〜4列 */}
        <ul className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar px-4 md:px-0 scroll-px-4">
          {events.map((ev) => (
            <li key={ev.slug} className="snap-start shrink-0 basis-[72%] sm:basis-[42%] md:basis-auto">
              <EventCard event={ev} />
            </li>
          ))}
        </ul>
      </div>
      <div className="text-center mt-10">
        <Button onClick={() => onNavigate('COMMUNITY')}>もっと見る</Button>
      </div>
    </section>
  );
};
