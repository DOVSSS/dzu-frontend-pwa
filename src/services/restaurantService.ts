import api from './api';
import {type Restaurant } from '../types/api.types';

export const getRestaurants = async (): Promise<Restaurant[]> => {
  const response = await api.get('/restaurants');
  return response.data;
};