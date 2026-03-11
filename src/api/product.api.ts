import axiosClient from "./axios";

export type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  is_available: boolean;
  category_id: number;
};

export const getProducts = async (categoryId: number) => {
  const res = await axiosClient.get(`/products?category_id=eq.${categoryId}&is_available=eq.true`);
  return res.data;
};

export const createProduct = async (data: { name: string; image: string; price: number; is_available: boolean; category_id: number }) => {
  const res = await axiosClient.post("/products", data);
  return res.data;
};

export const updateProduct = async (productId: number, data: { name: string; image: string; price: number; is_available: boolean; category_id: number }) => {
  const res = await axiosClient.patch(`/products?id=eq.${productId}`, data);
  return res.data;
};

export const getProductById = async (productId: number) => {
  const res = await axiosClient.get(`/products?id=eq.${productId}`);
  return res.data[0];
};
