import React from 'react';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import packageIcon from '@/assets/icons/package.svg';
import externalLinkIcon from '@/assets/icons/external-link.svg';

function TrackingEvent({ event }) {
  const { timestamp, description, location } = event;
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-blue-500 mt-1" />
        <span className="flex-1 w-px bg-gray-200" />
      </div>
      <div className="pb-4 min-w-0">
        <p className="text-sm font-medium text-gray-900">{description}</p>
        {location && (
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <img src={mapPinIcon} alt="location" className="w-3 h-3" />
            {location}
          </p>
        )}
        {formattedTime && (
          <p className="text-xs text-gray-400 mt-0.5">{formattedTime}</p>
        )}
      </div>
    </li>
  );
}

function TrackingInfo({ tracking }) {
  if (!tracking) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-sm text-gray-500">
        Tracking information is not available yet.
      </div>
    );
  }

  const {
    trackingNumber,
    carrier,
    carrierUrl,
    estimatedDelivery,
    currentStatus,
    events = [],
  } = tracking;

  const formattedEta = estimatedDelivery
    ? new Date(estimatedDelivery).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-blue-50 flex items-center gap-3">
        <img src={packageIcon} alt="tracking" className="w-5 h-5 text-blue-600" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-blue-900">
            {carrier ? `${carrier} Tracking` : 'Shipment Tracking'}
          </p>
          {trackingNumber && (
            <p className="text-xs text-blue-700 font-mono mt-0.5">{trackingNumber}</p>
          )}
        </div>
        {carrierUrl && (
          <a
            href={carrierUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline flex-shrink-0"
            aria-label="Track on carrier website"
          >
            Track
            <img src={externalLinkIcon} alt="" className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="p-4 flex flex-wrap gap-4 border-b border-gray-100">
        {currentStatus && (
          <div>
            <p className="text-xs text-gray-500">Current Status</p>
            <p className="text-sm font-medium text-gray-900 mt-0.5 capitalize">{currentStatus}</p>
          </div>
        )}
        {formattedEta && (
          <div>
            <p className="text-xs text-gray-500">Estimated Delivery</p>
            <p className="text-sm font-medium text-gray-900 mt-0.5">{formattedEta}</p>
          </div>
        )}
      </div>

      {events.length > 0 ? (
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Tracking History
          </p>
          <ul className="space-y-0">
            {events.map((event, index) => (
              <TrackingEvent key={index} event={event} />
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 text-sm text-gray-500">
          No tracking events recorded yet.
        </div>
      )}
    </div>
  );
}

export default TrackingInfo;
