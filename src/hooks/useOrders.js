import { useState, useEffect, useCallback } from 'react';
import ordersService from '../services/ordersService';

export function useOrders({ autoFetch = true } = {}) {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchOrders = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersService.getOrders(params);
      const items = Array.isArray(data) ? data : (data.items || []);
      setOrders(items);
      setTotal(data.total || items.length);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrder = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersService.getOrder(orderId);
      setOrder(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchOrders();
    }
  }, [autoFetch, fetchOrders]);

  return {
    orders,
    order,
    total,
    loading,
    error,
    fetchOrders,
    fetchOrder,
  };
}
