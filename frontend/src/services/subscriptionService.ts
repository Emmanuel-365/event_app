import axios from 'axios';

const API_URL = 'http://localhost:8080/subscription';

interface SubscriptionData {
  id_event: number;
  id_visitor: number;
  id_ticket: number;
  places: number;
}

export const createSubscription = async (subscriptionData: SubscriptionData) => {
  return axios.post(API_URL, subscriptionData);
};
