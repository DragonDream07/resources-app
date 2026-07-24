import React from 'react';
import '@/assets/icons/check.svg';

const STEPS = [
  { id: 'address', label: 'Address' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

/**
 * CheckoutStepper
 * Props:
 *   currentStep: 'address' | 'payment' | 'review'
 */
const CheckoutStepper = ({ currentStep }) => {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Checkout steps" className="checkout-stepper">
      <ol className="checkout-stepper__list">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          let statusClass = 'checkout-stepper__step';
          if (isCompleted) statusClass += ' checkout-stepper__step--completed';
          else if (isActive) statusClass += ' checkout-stepper__step--active';
          else statusClass += ' checkout-stepper__step--upcoming';

          return (
            <li key={step.id} className={statusClass}>
              <span className="checkout-stepper__indicator" aria-hidden="true">
                {isCompleted ? (
                  <img src="/src/assets/icons/check.svg" alt="completed" className="checkout-stepper__check-icon" />
                ) : (
                  <span className="checkout-stepper__number">{index + 1}</span>
                )}
              </span>
              <span
                className="checkout-stepper__label"
                aria-current={isActive ? 'step' : undefined}
              >
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <span
                  className={`checkout-stepper__connector${isCompleted ? ' checkout-stepper__connector--completed' : ''}`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      <style>{`
        .checkout-stepper {
          width: 100%;
          padding: 16px 0;
        }
        .checkout-stepper__list {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .checkout-stepper__step {
          display: flex;
          align-items: center;
          flex: 1;
          position: relative;
        }
        .checkout-stepper__indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #d1d5db;
          background: #ffffff;
          flex-shrink: 0;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          transition: border-color 0.2s, background 0.2s;
        }
        .checkout-stepper__step--completed .checkout-stepper__indicator {
          background: #16a34a;
          border-color: #16a34a;
          color: #ffffff;
        }
        .checkout-stepper__step--active .checkout-stepper__indicator {
          border-color: #2563eb;
          background: #2563eb;
          color: #ffffff;
        }
        .checkout-stepper__check-icon {
          width: 16px;
          height: 16px;
          filter: brightness(0) invert(1);
        }
        .checkout-stepper__label {
          margin-left: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          white-space: nowrap;
        }
        .checkout-stepper__step--upcoming .checkout-stepper__label {
          color: #9ca3af;
        }
        .checkout-stepper__step--active .checkout-stepper__label {
          color: #2563eb;
          font-weight: 600;
        }
        .checkout-stepper__connector {
          flex: 1;
          height: 2px;
          background: #d1d5db;
          margin: 0 8px;
        }
        .checkout-stepper__connector--completed {
          background: #16a34a;
        }
      `}</style>
    </nav>
  );
};

export default CheckoutStepper;
