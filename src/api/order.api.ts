import axiosClient from "./axios";
import { getProductById } from "./product.api";

export type Order = {
  id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  product_price?: number;
  price: number;
  note: string;
  table_id: number;
  is_paid: boolean;
  is_exported: boolean;
};

export const getTableOrders = async (tableId: number) => {
  const res = await axiosClient.get(
    `/table_items?table_id=eq.${tableId}&is_exported=eq.false&order=id.asc`,
  );
  const ordersWithProductNames = await Promise.all(
    res.data.map(async (order: Order) => ({
      ...order,
      product_name: (await getProductById(order.product_id))?.name || "",
      product_price: (await getProductById(order.product_id))?.price || 0,
    })),
  );
  return ordersWithProductNames;
};

export const createOrder = async (data: { product_id: number; quantity: number; price: number; table_id: number; note: string; is_paid: boolean; is_exported: boolean }) => {
  const res = await axiosClient.post("/table_items", data);
  return res.data;
}

export const updateOrder = async (orderId: number, data: { product_id: number; quantity: number; price: number; table_id: number; note: string; is_paid: boolean; is_exported: boolean }) => {
  const res = await axiosClient.patch(`/table_items?id=eq.${orderId}`, data);
  return res.data;
}

export const deleteOrder = async (orderId: number) => {
  const res = await axiosClient.delete(`/table_items?id=eq.${orderId}`);
  return res.data;
}
