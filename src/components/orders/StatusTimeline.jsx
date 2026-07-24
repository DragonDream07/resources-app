import React from 'react';
import checkIcon from '@/assets/icons/check.svg';
import packageIcon from '@/assets/icons/package.svg';

const STAGES = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

const STAGE_ORDER = {
  confirmed: 0,
  packed: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

function StageIcon({ completed, active }) {
  if (completed) {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500">
        <img src={checkIcon} alt="done" className="w-4 h-4 invert" />
      </span>
    );
  }
  if (active) {
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 ring-4 ring-blue-100">
        <img src={packageIcon} alt="current" className="w-4 h-4 invert" />
      </span>
    );
  }
  return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
      <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
    </span>
  );
}

function StatusTimeline({ currentStatus, stages: customStages, timestamps }) {
  const stageList = customStages || STAGES;
  const currentIndex = STAGE_ORDER[currentStatus] ?? -1;
  const isCancelled = currentStatus === 'cancelled';

  return (
    <div className="w-full">
      {isCancelled ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500">
            <img src={checkIcon} alt="cancelled" className="w-4 h-4 invert" />
          </span>
          <div>
            <p className="text-sm font-semibold text-red-800">Order Cancelled</p>
            {timestamps && timestamps.cancelled && (
              <p className="text-xs text-red-600 mt-0.5">
                {new Date(timestamps.cancelled).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>
      ) : (
        <ol className="flex items-start w-full">
          {stageList.map((stage, index) => {
            const stageIndex = STAGE_ORDER[stage.key] ?? index;
            const completed = stageIndex < currentIndex;
            const active = stageIndex === currentIndex;
            const isLast = index === stageList.length - 1;
            const timestamp =
              timestamps && timestamps[stage.key]
                ? new Date(timestamps[stage.key]).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                  })
                : null;

            return (
              <li key={stage.key} className={`flex-1 flex flex-col items-center relative ${isLast ? '' : ''}`}>
                <div className="flex items-center w-full">
                  <div className="flex flex-col items-center">
                    <StageIcon completed={completed} active={active} />
                  </div>
                  {!isLast && (
                    <div
                      className={`flex-1 h-1 mx-1 rounded ${
                        completed ? 'bg-green-400' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-xs font-medium ${
                      active
                        ? 'text-blue-700'
                        : completed
                        ? 'text-green-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {stage.label}
                  </p>
                  {timestamp && (
                    <p className="text-xs text-gray-400 mt-0.5">{timestamp}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export default StatusTimeline;
