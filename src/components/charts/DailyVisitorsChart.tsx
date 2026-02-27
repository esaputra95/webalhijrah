"use client";

import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";

export type DailyPoint = {
  day: string | null;
  totalViews: number;
  uniqueVisitors: number;
};

interface DailyVisitorsChartProps {
  data: DailyPoint[];
  isLoading?: boolean;
}

const CHART_W = 800;
const CHART_H = 220; // Increased height to accommodate tooltip
const PAD = { top: 60, right: 20, bottom: 40, left: 50 }; // Increased top padding for tooltip

export default function DailyVisitorsChart({
  data,
  isLoading,
}: DailyVisitorsChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stable reference point for "today" to avoid shifting on renders
  const today = useMemo(() => dayjs().format("YYYY-MM-DD"), []);

  // Fill missing days in last 30 days
  const filled = useMemo(() => {
    const map = new Map<string, DailyPoint>();
    data.forEach((d) => {
      if (d.day) map.set(d.day, d);
    });

    const result: DailyPoint[] = [];
    const baseDate = dayjs(today);
    for (let i = 29; i >= 0; i--) {
      const key = baseDate.subtract(i, "day").format("YYYY-MM-DD");
      result.push(
        map.get(key) || { day: key, totalViews: 0, uniqueVisitors: 0 },
      );
    }
    return result;
  }, [data, today]);

  const maxVal = useMemo(
    () => Math.max(1, ...filled.map((d) => d.totalViews)),
    [filled],
  );

  const innerW = CHART_W - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;

  const xScale = (i: number) => PAD.left + (i / (filled.length - 1)) * innerW;
  const yScale = (v: number) => PAD.top + innerH - (v / maxVal) * innerH;

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = Math.max(1, Math.ceil(maxVal / 5));
    for (let v = 0; v <= maxVal; v += step) ticks.push(v);
    if (ticks[ticks.length - 1] < maxVal) ticks.push(maxVal);
    return ticks;
  }, [maxVal]);

  // Build area + line paths
  const linePath = filled
    .map(
      (d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(d.totalViews)}`,
    )
    .join(" ");

  const areaPath = `${linePath} L ${xScale(filled.length - 1)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`;

  const formatNum = (v: number) => new Intl.NumberFormat("id-ID").format(v);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    // Calculate index from x position
    const relativeX = svgP.x - PAD.left;
    const idx = Math.round((relativeX / innerW) * (filled.length - 1));

    if (idx >= 0 && idx < filled.length) {
      setHoverIdx(idx);
    } else {
      setHoverIdx(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="font-semibold text-slate-800 mb-4">
          Pengunjung Harian (30 Hari Terakhir)
        </h3>
        <div className="flex items-center justify-center h-[300px]">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-500">Memuat data...</span>
          </div>
        </div>
      </div>
    );
  }

  const hoveredData = hoverIdx !== null ? filled[hoverIdx] : null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">
          Pengunjung Harian (30 Hari Terakhir)
        </h3>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-blue-500" />
            Total Views
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
            Unique Visitors
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div ref={containerRef} className="relative" style={{ minWidth: 600 }}>
          {/* Tooltip - Fixed to top area to avoid clipping and overlap */}
          {hoverIdx !== null && hoveredData && (
            <div
              className="absolute z-20 pointer-events-none transition-all duration-75"
              style={{
                left: `${(xScale(hoverIdx) / CHART_W) * 100}%`,
                top: 8, // Fixed distance from top of relative container
                transform: `translateX(${
                  hoverIdx > 25 ? "-100%" : hoverIdx < 4 ? "0%" : "-50%"
                })`,
              }}
            >
              <div className="bg-white border border-slate-200 rounded-lg shadow-xl px-3 py-2 whitespace-nowrap ring-1 ring-slate-900/5">
                <p className="text-[11px] font-bold text-slate-800 mb-1 border-b border-slate-100 pb-1">
                  {hoveredData.day
                    ? dayjs(hoveredData.day).format("DD MMMM YYYY")
                    : "-"}
                </p>
                <div className="flex items-center justify-between gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-medium">
                      Views
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {formatNum(hoveredData.totalViews)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-medium">
                      Unique
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      {formatNum(hoveredData.uniqueVisitors)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="w-full touch-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIdx(null)}
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* grid lines */}
            {yTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  y1={yScale(tick)}
                  x2={CHART_W - PAD.right}
                  y2={yScale(tick)}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray={tick === 0 ? "0" : "4 4"}
                />
                <text
                  x={PAD.left - 12}
                  y={yScale(tick) + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#94a3b8"
                  className="font-medium"
                >
                  {formatNum(tick)}
                </text>
              </g>
            ))}

            {/* area fill */}
            <path d={areaPath} fill="url(#areaGrad)" />

            {/* line */}
            <path
              d={linePath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* data points (always rendered, highlighted on hover) */}
            {filled.map((d, i) => (
              <g key={`point-${i}`}>
                {/* unique visitors dots */}
                <circle
                  cx={xScale(i)}
                  cy={yScale(d.uniqueVisitors)}
                  r={hoverIdx === i ? 4 : 2}
                  fill="#10b981"
                  className="transition-all duration-150"
                  opacity={hoverIdx === i ? 1 : 0.6}
                />
                {/* total views dots */}
                <circle
                  cx={xScale(i)}
                  cy={yScale(d.totalViews)}
                  r={hoverIdx === i ? 5 : 3}
                  fill="#3b82f6"
                  className="transition-all duration-150"
                />
              </g>
            ))}

            {/* X-axis labels */}
            {filled.map((d, i) =>
              i % 5 === 0 || i === filled.length - 1 ? (
                <text
                  key={`xlabel-${i}`}
                  x={xScale(i)}
                  y={CHART_H - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#64748b"
                  className="font-medium"
                >
                  {d.day ? dayjs(d.day).format("DD MMM") : ""}
                </text>
              ) : null,
            )}

            {/* hover guide line */}
            {hoverIdx !== null && (
              <line
                x1={xScale(hoverIdx)}
                y1={PAD.top - 10}
                x2={xScale(hoverIdx)}
                y2={PAD.top + innerH}
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                pointerEvents="none"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
