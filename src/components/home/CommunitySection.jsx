import React from 'react';
import { SectionTitle } from '../ui/SectionTitle';
import { Button } from '../ui/Button';
import { EventCard } from '../ui/EventCard';
import { EVENTS } from '../../data/dummy';

export const CommunitySection = ({ onNavigate }) => (
  <section className="bg-cream-50 py-12 md:py-16">
    <SectionTitle>コミュニティ</SectionTitle>
    <div className="max-w-content mx-auto md:px-4">
      {/* スマホは横に送る。PCは4列×2段（原案どおり） */}
      <ul className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-[9px] overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar px-4 md:px-0 scroll-px-4">
        {EVENTS.map((ev) => (
          <li key={ev.id} className="snap-start shrink-0 basis-[72%] sm:basis-[42%] md:basis-auto">
            <EventCard event={ev} />
          </li>
        ))}
      </ul>
    </div>
    <div className="text-center mt-10">
      <Button onClick={() => onNavigate('COMMUNITY')}>もっと読む</Button>
    </div>
  </section>
);
