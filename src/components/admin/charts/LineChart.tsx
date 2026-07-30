'use client';

import { useId } from 'react';
import { TrendPoint } from '@/types';

interface LineChartProps {
  data: TrendPoint[];
  height?: number;
  lineColor?: string;
}

// A minimal, dependency-free SVG line chart for trend data (e.g. signups/day).
export function LineChart({ data, height = 220, lineColor = 'var(--color-gold)' }: LineChartProps) {
  const uid = useId();
  const max = Math.max(1, ...data.map(d => d.value));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-muted-foreground" style={{ height }}>
        No data yet
      </div>
    );
  }

  const points = data.map((d, i) => {
    const x = data.length === 1 ? 50 : (i / (data.length - 1)) * 100;
    const y = 92 - (d.value / max) * 84;
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L 100 92 L 0 92 Z`;

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${uid}-fill)`} stroke="none" />
        <path d={pathD} fill="none" stroke={lineColor} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={`${uid}-pt-${i}`} cx={p.x} cy={p.y} r={1.3} fill={lineColor}>
            <title>{`${p.label}: ${p.value}`}</title>
          </circle>
        ))}
        <line x1={0} y1={92} x2={100} y2={92} stroke="var(--color-border)" strokeWidth={0.4} />
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground px-0.5">
        <span>{data[0]?.label}</span>
        {data.length > 2 && <span>{data[Math.floor(data.length / 2)]?.label}</span>}
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}
