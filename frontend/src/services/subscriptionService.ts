import axios from 'axios';
import { AUTH_BASE_URL } from '../config';

const API_URL = `${AUTH_BASE_URL}/subscription`;

interface SubscriptionData {
  id_event: number;
  id_visitor: number;
  id_ticket: number;
  places: number;
}

export const createSubscription = async (subscriptionData: SubscriptionData) => {
  return axios.post(API_URL, subscriptionData);
};

export const getSubscriptionsByUser = async () => {
  return axios.get(`${API_URL}/visitor/me`);
};

export const getSubscriptionsByEvent = async (id: string) => {
  return axios.get(`${API_URL}/event/${id}`);
};

export const deleteSubscription = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};

export const validateTicket = async (ticketCode: string) => {
  return axios.post(`${API_URL}/validate/${ticketCode}`);
};

export const confirmPayment = async (subscriptionId: number) => {
    return axios.post(`${API_URL}/${subscriptionId}/confirm-payment`);
};
