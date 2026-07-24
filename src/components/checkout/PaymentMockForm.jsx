import React, { useState } from 'react';

const OUTCOMES = [
  { value: 'success', label: '✓ Simulate Success' },
  { value: 'failure', label: '✗ Simulate Failure' },
  { value: 'pending', label: '⏳ Simulate Pending' },
];

/**
 * PaymentMockForm
 * Test-mode only payment form.
 * Props:
 *   onPaymentResult: ({ outcome: 'success' | 'failure' | 'pending', cardLast4: string }) => void
 *   loading: boolean
 */
const PaymentMockForm = ({ onPaymentResult, loading = false }) => {
  const [outcome, setOutcome] = useState('success');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const formatCardNumber = (val) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
    if (errors.cardNumber) setErrors((p) => { const n = { ...p }; delete n.cardNumber; return n; });
  };

  const handleExpiryChange = (e) => {
    setExpiry(formatExpiry(e.target.value));
    if (errors.expiry) setErrors((p) => { const n = { ...p }; delete n.expiry; return n; });
  };

  const validate = () => {
    const errs = {};
    const rawCard = cardNumber.replace(/\s/g, '');
    if (!nameOnCard.trim()) errs.nameOnCard = 'Name on card is required.';
    if (rawCard.length !== 16) errs.cardNumber = 'Enter a valid 16-digit card number.';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) errs.expiry = 'Enter expiry in MM/YY format.';
    if (!/^\d{3,4}$/.test(cvv)) errs.cvv = 'Enter a valid CVV.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
    const cardLast4 = cardNumber.replace(/\s/g, '').slice(-4);
    if (onPaymentResult) onPaymentResult({ outcome, cardLast4 });
  };

  return (
    <div className="payment-mock-form">
      <div className="payment-mock-form__test-banner">
        <span className="payment-mock-form__test-badge">TEST MODE</span>
        <span className="payment-mock-form__test-note">No real charges. Use any test card details.</span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="payment-mock-form__form">
        <div className="payment-mock-form__field">
          <label className="payment-mock-form__label" htmlFor="pmf-name">Name on Card</label>
          <input
            id="pmf-name"
            className={`payment-mock-form__input${errors.nameOnCard ? ' payment-mock-form__input--error' : ''}`}
            type="text"
            value={nameOnCard}
            onChange={(e) => {
              setNameOnCard(e.target.value);
              if (errors.nameOnCard) setErrors((p) => { const n = { ...p }; delete n.nameOnCard; return n; });
            }}
            placeholder="Full name as on card"
            autoComplete="cc-name"
            disabled={submitted && !loading}
          />
          {errors.nameOnCard && <span className="payment-mock-form__error">{errors.nameOnCard}</span>}
        </div>

        <div className="payment-mock-form__field">
          <label className="payment-mock-form__label" htmlFor="pmf-card">Card Number</label>
          <input
            id="pmf-card"
            className={`payment-mock-form__input${errors.cardNumber ? ' payment-mock-form__input--error' : ''}`}
            type="text"
            inputMode="numeric"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="0000 0000 0000 0000"
            autoComplete="cc-number"
            maxLength={19}
            disabled={submitted && !loading}
          />
          {errors.cardNumber && <span className="payment-mock-form__error">{errors.cardNumber}</span>}
        </div>

        <div className="payment-mock-form__row">
          <div className="payment-mock-form__field">
            <label className="payment-mock-form__label" htmlFor="pmf-expiry">Expiry</label>
            <input
              id="pmf-expiry"
              className={`payment-mock-form__input${errors.expiry ? ' payment-mock-form__input--error' : ''}`}
              type="text"
              inputMode="numeric"
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              autoComplete="cc-exp"
              maxLength={5}
              disabled={submitted && !loading}
            />
            {errors.expiry && <span className="payment-mock-form__error">{errors.expiry}</span>}
          </div>
          <div className="payment-mock-form__field">
            <label className="payment-mock-form__label" htmlFor="pmf-cvv">CVV</label>
            <input
              id="pmf-cvv"
              className={`payment-mock-form__input${errors.cvv ? ' payment-mock-form__input--error' : ''}`}
              type="password"
              inputMode="numeric"
              value={cvv}
              onChange={(e) => {
                setCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
                if (errors.cvv) setErrors((p) => { const n = { ...p }; delete n.cvv; return n; });
              }}
              placeholder="•••"
              autoComplete="cc-csc"
              maxLength={4}
              disabled={submitted && !loading}
            />
            {errors.cvv && <span className="payment-mock-form__error">{errors.cvv}</span>}
          </div>
        </div>

        <div className="payment-mock-form__field">
          <label className="payment-mock-form__label">Simulate Outcome</label>
          <div className="payment-mock-form__outcome-group">
            {OUTCOMES.map((opt) => (
              <label
                key={opt.value}
                className={`payment-mock-form__outcome-btn${outcome === opt.value ? ' payment-mock-form__outcome-btn--active' : ''}`}
              >
                <input
                  type="radio"
                  name="pmf-outcome"
                  value={opt.value}
                  checked={outcome === opt.value}
                  onChange={() => setOutcome(opt.value)}
                  disabled={submitted && !loading}
                  className="payment-mock-form__outcome-radio"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="payment-mock-form__submit"
          disabled={loading || (submitted && outcome !== 'pending')}
        >
          {loading ? 'Processing…' : 'Pay Now'}
        </button>
      </form>

      <style>{`
        .payment-mock-form {
          width: 100%;
        }
        .payment-mock-form__test-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef9c3;
          border: 1px solid #fde047;
          border-radius: 6px;
          padding: 8px 12px;
          margin-bottom: 16px;
        }
        .payment-mock-form__test-badge {
          font-size: 11px;
          font-weight: 700;
          background: #ca8a04;
          color: #ffffff;
          border-radius: 4px;
          padding: 2px 6px;
          letter-spacing: 0.5px;
        }
        .payment-mock-form__test-note {
          font-size: 12px;
          color: #92400e;
        }
        .payment-mock-form__form {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .payment-mock-form__field {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }
        .payment-mock-form__label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
        }
        .payment-mock-form__input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          color: #111827;
          outline: none;
          transition: border-color 0.2s;
          background: #ffffff;
        }
        .payment-mock-form__input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.15);
        }
        .payment-mock-form__input--error { border-color: #dc2626; }
        .payment-mock-form__input:disabled {
          background: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }
        .payment-mock-form__error {
          font-size: 12px;
          color: #dc2626;
          margin-top: 4px;
        }
        .payment-mock-form__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .payment-mock-form__outcome-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .payment-mock-form__outcome-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border: 1px solid #d1d5db;
          border-radius: 20px;
          font-size: 13px;
          color: #374151;
          cursor: pointer;
          user-select: none;
          transition: border-color 0.2s, background 0.2s;
          background: #ffffff;
        }
        .payment-mock-form__outcome-btn--active {
          border-color: #2563eb;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 600;
        }
        .payment-mock-form__outcome-radio {
          display: none;
        }
        .payment-mock-form__submit {
          margin-top: 8px;
          padding: 12px;
          background: #2563eb;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          width: 100%;
        }
        .payment-mock-form__submit:hover:not(:disabled) { background: #1d4ed8; }
        .payment-mock-form__submit:disabled {
          background: #93c5fd;
          cursor: not-allowed;
        }
        @media (max-width: 480px) {
          .payment-mock-form__row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default PaymentMockForm;
