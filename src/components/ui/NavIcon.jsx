import React from 'react';

export const NavIcon = ({ item, className = 'h-6' }) => (
  <img src={item.icon} alt="" aria-hidden="true" className={`${className} w-auto`} />
);
