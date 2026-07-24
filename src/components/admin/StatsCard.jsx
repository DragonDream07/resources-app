import React from 'react';

/**
 * StatsCard — Dashboard KPI tile
 * Props:
 *   label    {string}  — metric label
 *   value    {string|number} — metric value
 *   trend    {number}  — positive/negative percentage change
 *   prefix   {string}  — optional prefix (e.g. '$')
 */
const StatsCard = ({ label, value, trend, prefix = '' }) => {
  const isPositive = trend >= 0;

  return (
    <div className="stats-card">
      <p className="stats-card__label">{label}</p>
      <p className="stats-card__value">
        {prefix}{value}
      </p>
      {trend !== undefined && trend !== null && (
        <span
          className={`stats-card__trend stats-card__trend--${
            isPositive ? 'up' : 'down'
          }`}
        >
          {isPositive ? '▲' : '▼'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  );
};

export default StatsCard;
