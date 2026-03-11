import axiosClient from "./axios";

export type ReportOrder = {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  note: string;
  table_id: number;
  is_paid: boolean;
  is_exported: boolean;
  products?: {
    name: string;
    price: number;
  };
};

export type ReportMonthly = {
  day: string;
  total: number;
};

export const getTableItemsByDate = async (date: string) => {
  const [day, month, year] = date.split("/");
  const iso = `${year}-${month}-${day}`;

  const res = await axiosClient.get(
    `/table_items?select=*,products(name,price)&created_at=gte.${iso}T00:00:00&created_at=lte.${iso}T23:59:59`,
  );

  return res.data;
};

export const getMonthlyRevenue = async (month: string) => {
  const res = await axiosClient.post("/rpc/get_monthly_revenue", {
    month_input: `${month}`,
  });

  return res.data;
};
