import client from './client';

export const getMyPurchases = async () => {
  const res = await client.get('/purchases/my');
  return res.data;
};

export const getAllPurchases = async () => {
  const res = await client.get('/purchases/all');
  return res.data;
};
