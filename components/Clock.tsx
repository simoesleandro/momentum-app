
import React from 'react';
import { useClock } from '../hooks/useClock';

const Clock: React.FC = () => {
  const { formattedDate, formattedTime } = useClock();
  return (
    <div className="text-right">
      <p className="font-semibold text-lg text-brand-light">{formattedTime}</p>
      <p className="text-sm text-brand-subtle capitalize">{formattedDate}</p>
    </div>
  );
};

export default Clock;
