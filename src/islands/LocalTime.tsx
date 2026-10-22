import { useEffect, useState } from 'react';

interface Props { timeZone: string }

/** Live HH:MM clock in the given time zone. Renders "--:--" until hydrated. */
export default function LocalTime({ timeZone }: Props) {
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return <time>{time}</time>;
}
