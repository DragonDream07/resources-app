import { useState, useEffect, useCallback } from 'react';
import addressesService from '../services/addressesService';

export function useAddresses({ autoFetch = true } = {}) {
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressesService.getAddresses();
      setAddresses(Array.isArray(data) ? data : (data.items || []));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAddress = useCallback(async (addressId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressesService.getAddress(addressId);
      setAddress(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAddress = useCallback(async (payload) => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressesService.createAddress(payload);
      setAddresses((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAddress = useCallback(async (addressId, payload) => {
    try {
      setLoading(true);
      setError(null);
      const data = await addressesService.updateAddress(addressId, payload);
      setAddresses((prev) =>
        prev.map((a) => (a.id === addressId ? data : a))
      );
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (addressId) => {
    try {
      setLoading(true);
      setError(null);
      await addressesService.deleteAddress(addressId);
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchAddresses();
    }
  }, [autoFetch, fetchAddresses]);

  return {
    addresses,
    address,
    loading,
    error,
    fetchAddresses,
    fetchAddress,
    createAddress,
    updateAddress,
    deleteAddress,
  };
}
