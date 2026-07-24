import { useState, useCallback } from 'react';
import checkoutService from '../services/checkoutService';
import paymentsService from '../services/paymentsService';

const STEPS = ['address', 'payment', 'review'];

const INITIAL_ADDRESS = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
};

const INITIAL_PAYMENT = {
  method: '',
  details: {},
};

export function useCheckout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [addressData, setAddressData] = useState(INITIAL_ADDRESS);
  const [paymentData, setPaymentData] = useState(INITIAL_PAYMENT);
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderResult, setOrderResult] = useState(null);

  const stepName = STEPS[currentStep];

  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < STEPS.length) {
      setCurrentStep(stepIndex);
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const updateAddress = useCallback((fields) => {
    setAddressData((prev) => ({ ...prev, ...fields }));
  }, []);

  const updatePayment = useCallback((fields) => {
    setPaymentData((prev) => ({ ...prev, ...fields }));
  }, []);

  const submitAddress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await checkoutService.submitAddress(addressData);
      nextStep();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [addressData, nextStep]);

  const fetchReview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await checkoutService.getReview();
      setReviewData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const initiatePayment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await paymentsService.initiatePayment(paymentData);
      nextStep();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [paymentData, nextStep]);

  const placeOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await checkoutService.placeOrder();
      setOrderResult(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setAddressData(INITIAL_ADDRESS);
    setPaymentData(INITIAL_PAYMENT);
    setReviewData(null);
    setOrderResult(null);
    setError(null);
  }, []);

  return {
    steps: STEPS,
    currentStep,
    stepName,
    goToStep,
    nextStep,
    prevStep,
    addressData,
    updateAddress,
    submitAddress,
    paymentData,
    updatePayment,
    initiatePayment,
    reviewData,
    fetchReview,
    placeOrder,
    orderResult,
    loading,
    error,
    reset,
  };
}
