'use client';

import { useId } from 'react';
import { TrendPoint } from '@/types';

interface BarChartProps {
  data: TrendPoint[];
  height?: number;
  barColor?: string;
  valueFormatter?: (value: number) => string;
}

// A minimal, dependency-free SVG bar chart. Keeps the admin bundle small and
// avoids pulling in a heavier charting library for a handful of simple views.
export function BarChart({ data, height = 220, barColor = 'var(--color-primary)', valueFormatter }: BarChartProps) {
  const uid = useId();
  const max = Math.max(1, ...data.map(d => d.value));
  const width = 100 / Math.max(data.length, 1);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-muted-foreground" style={{ height }}>
        No data yet
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        {data.map((point, i) => {
          const barHeight = (point.value / max) * 88;
          const x = i * width + width * 0.15;
          const barWidth = width * 0.7;
          const y = 92 - barHeight;
          return (
            <g key={`${uid}-${i}`}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={1.2}
                fill={barColor}
                opacity={point.value === 0 ? 0.15 : 0.9}
              >
                <title>{`${point.label}: ${valueFormatter ? valueFormatter(point.value) : point.value}`}</title>
              </rect>
            </g>
          );
        })}
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
