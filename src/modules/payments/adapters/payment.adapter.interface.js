/**
 * PaymentAdapterInterface
 *
 * Duck-type contract that every payment provider adapter must satisfy.
 * All methods are async and must return the shapes documented below.
 */
class PaymentAdapterInterface {
  /**
   * Initiate a payment session / order with the provider.
   *
   * @param {object} params
   * @param {string} params.orderId        - Internal order identifier
   * @param {number} params.amount         - Amount in the smallest currency unit (e.g. paise)
   * @param {string} params.currency       - ISO 4217 currency code (e.g. "INR")
   * @param {string} params.customerEmail  - Customer e-mail address
   * @param {string} params.customerPhone  - Customer phone number
   * @param {object} [params.metadata]     - Arbitrary key/value pairs forwarded to the provider
   *
   * @returns {Promise<{
   *   providerOrderId: string,
   *   providerSessionToken: string,
   *   paymentUrl: string|null,
   *   raw: object
   * }>}
   */
  // eslint-disable-next-line no-unused-vars
  async initiatePayment(params) {
    throw new Error('PaymentAdapterInterface.initiatePayment() must be implemented by subclass');
  }

  /**
   * Verify / capture a payment after the provider callback.
   *
   * @param {object} params
   * @param {string} params.providerOrderId    - Provider-side order / session id
   * @param {string} params.providerPaymentId  - Provider-side payment / transaction id
   * @param {string} params.providerSignature  - Signature / hash returned by the provider
   * @param {object} [params.raw]              - Full raw payload from the provider webhook/redirect
   *
   * @returns {Promise<{
   *   success: boolean,
   *   providerPaymentId: string,
   *   providerOrderId: string,
   *   status: string,
   *   raw: object
   * }>}
   */
  // eslint-disable-next-line no-unused-vars
  async verifyPayment(params) {
    throw new Error('PaymentAdapterInterface.verifyPayment() must be implemented by subclass');
  }

  /**
   * Refund a previously captured payment (fully or partially).
   *
   * @param {object} params
   * @param {string} params.providerPaymentId - Provider-side payment id to refund
   * @param {number} params.amount            - Amount to refund in smallest currency unit
   * @param {string} [params.reason]          - Human-readable reason for the refund
   * @param {object} [params.metadata]        - Arbitrary key/value pairs
   *
   * @returns {Promise<{
   *   success: boolean,
   *   refundId: string,
   *   status: string,
   *   raw: object
   * }>}
   */
  // eslint-disable-next-line no-unused-vars
  async refundPayment(params) {
    throw new Error('PaymentAdapterInterface.refundPayment() must be implemented by subclass');
  }

  /**
   * Fetch the current status of a payment from the provider.
   *
   * @param {object} params
   * @param {string} params.providerOrderId - Provider-side order / session id
   *
   * @returns {Promise<{
   *   status: string,
   *   providerPaymentId: string|null,
   *   raw: object
   * }>}
   */
  // eslint-disable-next-line no-unused-vars
  async getPaymentStatus(params) {
    throw new Error('PaymentAdapterInterface.getPaymentStatus() must be implemented by subclass');
  }
}

module.exports = PaymentAdapterInterface;
