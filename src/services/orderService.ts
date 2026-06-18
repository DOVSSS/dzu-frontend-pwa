import api from './api';
import {type CreateOrderRequest,type Order } from '../types/api.types';

export const createOrder = async (payload: CreateOrderRequest): Promise<Order> => {
  const response = await api.post('/orders', payload);
  return response.data;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await api.get('/orders/my-orders');
  return response.data;
};