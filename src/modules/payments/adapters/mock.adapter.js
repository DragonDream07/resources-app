const PaymentAdapterInterface = require('./payment.adapter.interface');

/**
 * MockPaymentAdapter
 *
 * Test-mode adapter that returns configurable success or failure responses
 * without making any real network calls.
 *
 * Configuration (all optional, set via constructor options or environment variables):
 *
 *   MOCK_PAYMENT_SHOULD_FAIL          - set to "true" to make every call fail
 *   MOCK_PAYMENT_INITIATE_FAIL        - set to "true" to fail only initiatePayment
 *   MOCK_PAYMENT_VERIFY_FAIL          - set to "true" to fail only verifyPayment
 *   MOCK_PAYMENT_REFUND_FAIL          - set to "true" to fail only refundPayment
 *   MOCK_PAYMENT_STATUS_FAIL          - set to "true" to fail only getPaymentStatus
 *   MOCK_PAYMENT_LATENCY_MS           - artificial latency in milliseconds (default 0)
 */
class MockPaymentAdapter extends PaymentAdapterInterface {
  /**
   * @param {object} [options]
   * @param {boolean} [options.shouldFail=false]          - Force every method to fail
   * @param {boolean} [options.initiatePaymentFail=false] - Force initiatePayment to fail
   * @param {boolean} [options.verifyPaymentFail=false]   - Force verifyPayment to fail
   * @param {boolean} [options.refundPaymentFail=false]   - Force refundPayment to fail
   * @param {boolean} [options.getPaymentStatusFail=false]- Force getPaymentStatus to fail
   * @param {number}  [options.latencyMs=0]               - Artificial delay in ms
   */
  constructor(options = {}) {
    super();

    const env = (key, fallback) => {
      const v = process.env[key];
      if (v === undefined || v === null) return fallback;
      return v === 'true';
    };

    const envNum = (key, fallback) => {
      const v = parseInt(process.env[key], 10);
      return Number.isFinite(v) ? v : fallback;
    };

    this._shouldFail =
      options.shouldFail !== undefined
        ? Boolean(options.shouldFail)
        : env('MOCK_PAYMENT_SHOULD_FAIL', false);

    this._initiatePaymentFail =
      options.initiatePaymentFail !== undefined
        ? Boolean(options.initiatePaymentFail)
        : env('MOCK_PAYMENT_INITIATE_FAIL', false);

    this._verifyPaymentFail =
      options.verifyPaymentFail !== undefined
        ? Boolean(options.verifyPaymentFail)
        : env('MOCK_PAYMENT_VERIFY_FAIL', false);

    this._refundPaymentFail =
      options.refundPaymentFail !== undefined
        ? Boolean(options.refundPaymentFail)
        : env('MOCK_PAYMENT_REFUND_FAIL', false);

    this._getPaymentStatusFail =
      options.getPaymentStatusFail !== undefined
        ? Boolean(options.getPaymentStatusFail)
        : env('MOCK_PAYMENT_STATUS_FAIL', false);

    this._latencyMs =
      options.latencyMs !== undefined
        ? Number(options.latencyMs)
        : envNum('MOCK_PAYMENT_LATENCY_MS', 0);

    /** Incrementing counter used to generate deterministic fake ids */
    this._counter = 0;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  _nextId(prefix) {
    this._counter += 1;
    return `${prefix}_mock_${String(this._counter).padStart(6, '0')}`;
  }

  async _delay() {
    if (this._latencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this._latencyMs));
    }
  }

  _shouldFailFor(methodFlag) {
    return this._shouldFail || methodFlag;
  }

  // ---------------------------------------------------------------------------
  // Interface implementation
  // ---------------------------------------------------------------------------

  /**
   * Initiate a payment.
   *
   * @param {object} params
   * @returns {Promise<object>}
   */
  async initiatePayment(params) {
    await this._delay();

    if (this._shouldFailFor(this._initiatePaymentFail)) {
      const err = new Error('MockPaymentAdapter: initiatePayment failed (configured failure)');
      err.code = 'MOCK_PAYMENT_INITIATE_FAILURE';
      err.statusCode = 502;
      throw err;
    }

    const providerOrderId = this._nextId('po');
    const providerSessionToken = this._nextId('tok');

    return {
      providerOrderId,
      providerSessionToken,
      paymentUrl: `https://mock.payment.test/pay/${providerOrderId}`,
      raw: {
        mock: true,
        orderId: params.orderId,
        amount: params.amount,
        currency: params.currency,
        providerOrderId,
        providerSessionToken,
      },
    };
  }

  /**
   * Verify a payment.
   *
   * @param {object} params
   * @returns {Promise<object>}
   */
  async verifyPayment(params) {
    await this._delay();

    if (this._shouldFailFor(this._verifyPaymentFail)) {
      const err = new Error('MockPaymentAdapter: verifyPayment failed (configured failure)');
      err.code = 'MOCK_PAYMENT_VERIFY_FAILURE';
      err.statusCode = 502;
      throw err;
    }

    const providerPaymentId = params.providerPaymentId || this._nextId('pay');

    return {
      success: true,
      providerPaymentId,
      providerOrderId: params.providerOrderId,
      status: 'captured',
      raw: {
        mock: true,
        providerPaymentId,
        providerOrderId: params.providerOrderId,
        providerSignature: params.providerSignature,
      },
    };
  }

  /**
   * Refund a payment.
   *
   * @param {object} params
   * @returns {Promise<object>}
   */
  async refundPayment(params) {
    await this._delay();

    if (this._shouldFailFor(this._refundPaymentFail)) {
      const err = new Error('MockPaymentAdapter: refundPayment failed (configured failure)');
      err.code = 'MOCK_PAYMENT_REFUND_FAILURE';
      err.statusCode = 502;
      throw err;
    }

    const refundId = this._nextId('ref');

    return {
      success: true,
      refundId,
      status: 'processed',
      raw: {
        mock: true,
        refundId,
        providerPaymentId: params.providerPaymentId,
        amount: params.amount,
        reason: params.reason || null,
      },
    };
  }

  /**
   * Get payment status.
   *
   * @param {object} params
   * @returns {Promise<object>}
   */
  async getPaymentStatus(params) {
    await this._delay();

    if (this._shouldFailFor(this._getPaymentStatusFail)) {
      const err = new Error('MockPaymentAdapter: getPaymentStatus failed (configured failure)');
      err.code = 'MOCK_PAYMENT_STATUS_FAILURE';
      err.statusCode = 502;
      throw err;
    }

    return {
      status: 'captured',
      providerPaymentId: this._nextId('pay'),
      raw: {
        mock: true,
        providerOrderId: params.providerOrderId,
      },
    };
  }
}

module.exports = MockPaymentAdapter;
