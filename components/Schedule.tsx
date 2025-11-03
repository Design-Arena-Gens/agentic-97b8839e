"use client";

import { Routine } from "@/lib/types";

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6..21
const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export function Schedule({ routine }: { routine: Routine }) {
  const minMinute = 6 * 60;
  const maxMinute = 22 * 60;
  const span = maxMinute - minMinute;

  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Weekly schedule</h3>
      <div className="overflow-x-auto">
        <div className="grid" style={{ gridTemplateColumns: `80px repeat(7, minmax(160px, 1fr))` }}>
          <div></div>
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center text-sm font-medium text-gray-700 pb-2">{d}</div>
          ))}
        </div>
        <div className="relative">
          {/* Hour lines */}
          {HOURS.map((h) => (
            <div key={h} className="flex" style={{ height: 48 }}>
              <div className="w-20 pr-2 text-right text-xs text-gray-500">{String(h).padStart(2,'0')}:00</div>
              <div className="flex-1 grid grid-cols-7 border-t border-gray-200"></div>
            </div>
          ))}

          {/* Tasks overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {routine.tasks.map((t) => (
              t.days.map((d) => {
                const start = timeToMinutes(t.startTime);
                const end = timeToMinutes(t.endTime);
                const topPct = ((start - minMinute) / span) * 100;
                const heightPct = ((end - start) / span) * 100;
                return (
                  <div
                    key={`${t.id}-${d}`}
                    className="absolute left-0"
                    style={{
                      top: `${topPct}%`,
                      height: `${heightPct}%`,
                      width: `calc((100% - 80px) / 7)`,
                      transform: `translateX(${d * 100}%)`,
                      marginLeft: 80,
                      padding: 4,
                    }}
                  >
                    <div className="pointer-events-auto rounded-md text-xs shadow-sm border" style={{ background: t ? `${hexWithAlpha('#ffffff',0.9)}` : '#fff', borderColor: hexWithAlpha('#000000', 0.08) }}>
                      <div className="px-2 py-1" style={{ borderLeft: `4px solid ${routine.color}` }}>
                        <div className="font-medium text-gray-800 truncate">{t.title}</div>
                        <div className="text-[11px] text-gray-600">{t.startTime} - {t.endTime}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function hexWithAlpha(hex: string, alpha: number): string {
  // expects #rrggbb
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
