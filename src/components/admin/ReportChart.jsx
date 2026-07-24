import React, { useEffect, useRef } from 'react';

/**
 * ReportChart — Wrapper around a charting library for consolidated reports.
 *
 * This component uses the native Canvas API / a lightweight built-in renderer
 * so the project has zero extra chart dependencies. For a real project this
 * wrapper's internals can be swapped for Chart.js / Recharts etc.
 *
 * Props:
 *   type     {'bar'|'line'|'pie'}   chart type
 *   data     { labels: string[], datasets: [{ label, data: number[], color? }] }
 *   title    {string}
 *   height   {number}   canvas height in px, default 300
 */

const COLORS = [
  '#4f46e5',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#8b5cf6',
];

function drawBar(ctx, data, width, height) {
  const { labels, datasets } = data;
  if (!labels || !datasets || datasets.length === 0) return;

  const padding = 50;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const allValues = datasets.flatMap((ds) => ds.data);
  const maxVal = Math.max(...allValues, 1);
  const groupCount = labels.length;
  const groupWidth = chartWidth / groupCount;
  const barCount = datasets.length;
  const barWidth = Math.max(4, (groupWidth / barCount) * 0.7);

  ctx.clearRect(0, 0, width, height);

  // Axes
  ctx.strokeStyle = '#d1d5db';
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, padding + chartHeight);
  ctx.lineTo(padding + chartWidth, padding + chartHeight);
  ctx.stroke();

  // Bars
  datasets.forEach((ds, dsIdx) => {
    ctx.fillStyle = ds.color || COLORS[dsIdx % COLORS.length];
    ds.data.forEach((val, i) => {
      const barH = (val / maxVal) * chartHeight;
      const x =
        padding +
        i * groupWidth +
        dsIdx * barWidth +
        (groupWidth - barCount * barWidth) / 2;
      const y = padding + chartHeight - barH;
      ctx.fillRect(x, y, barWidth - 2, barH);
    });
  });

  // Labels
  ctx.fillStyle = '#6b7280';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((lbl, i) => {
    const x = padding + i * groupWidth + groupWidth / 2;
    ctx.fillText(lbl, x, padding + chartHeight + 16);
  });
}

function drawLine(ctx, data, width, height) {
  const { labels, datasets } = data;
  if (!labels || !datasets || datasets.length === 0) return;

  const padding = 50;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const allValues = datasets.flatMap((ds) => ds.data);
  const maxVal = Math.max(...allValues, 1);
  const step = chartWidth / Math.max(labels.length - 1, 1);

  ctx.clearRect(0, 0, width, height);

  // Axes
  ctx.strokeStyle = '#d1d5db';
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, padding + chartHeight);
  ctx.lineTo(padding + chartWidth, padding + chartHeight);
  ctx.stroke();

  datasets.forEach((ds, dsIdx) => {
    const color = ds.color || COLORS[dsIdx % COLORS.length];
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ds.data.forEach((val, i) => {
      const x = padding + i * step;
      const y = padding + chartHeight - (val / maxVal) * chartHeight;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Dots
    ctx.fillStyle = color;
    ds.data.forEach((val, i) => {
      const x = padding + i * step;
      const y = padding + chartHeight - (val / maxVal) * chartHeight;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  // Labels
  ctx.fillStyle = '#6b7280';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((lbl, i) => {
    ctx.fillText(lbl, padding + i * step, padding + chartHeight + 16);
  });
}

function drawPie(ctx, data, width, height) {
  const { labels, datasets } = data;
  if (!labels || !datasets || datasets[0]?.data?.length === 0) return;

  ctx.clearRect(0, 0, width, height);

  const values = datasets[0].data;
  const total = values.reduce((s, v) => s + v, 0) || 1;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 30;
  let startAngle = -Math.PI / 2;

  values.forEach((val, i) => {
    const slice = (val / total) * 2 * Math.PI;
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fill();

    // Label
    const midAngle = startAngle + slice / 2;
    const lx = cx + (radius * 0.65) * Math.cos(midAngle);
    const ly = cy + (radius * 0.65) * Math.sin(midAngle);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round((val / total) * 100)}%`, lx, ly);

    startAngle += slice;
  });

  // Legend
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  labels.forEach((lbl, i) => {
    const legendY = 20 + i * 18;
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fillRect(10, legendY - 10, 12, 12);
    ctx.fillStyle = '#374151';
    ctx.font = '11px sans-serif';
    ctx.fillText(lbl, 28, legendY);
  });
}

const ReportChart = ({ type = 'bar', data, title, height = 300 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth || canvas.width;
    canvas.width = width;
    canvas.height = height;

    if (type === 'bar') drawBar(ctx, data, width, height);
    else if (type === 'line') drawLine(ctx, data, width, height);
    else if (type === 'pie') drawPie(ctx, data, width, height);
  }, [type, data, height]);

  return (
    <div className="report-chart">
      {title && <h3 className="report-chart__title">{title}</h3>}
      <canvas
        ref={canvasRef}
        className="report-chart__canvas"
        style={{ width: '100%', height: `${height}px` }}
      />
    </div>
  );
};

export default ReportChart;
