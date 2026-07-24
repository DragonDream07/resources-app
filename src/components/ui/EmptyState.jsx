import React from 'react';
import emptyStateImg from '@/assets/images/empty-state.svg';
import Button from './Button';

const EmptyState = ({
  title = 'Nothing here yet',
  description,
  image,
  ctaLabel,
  onCta,
  ctaVariant = 'primary',
  className = '',
}) => {
  const imgSrc = image !== undefined ? image : emptyStateImg;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 text-center ${className}`}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          className="h-36 w-auto object-contain opacity-80"
        />
      )}
      <div className="max-w-xs space-y-1">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      {ctaLabel && onCta && (
        <Button variant={ctaVariant} onClick={onCta}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
