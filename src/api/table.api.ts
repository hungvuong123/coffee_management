import axiosClient from "./axios";

export type Table = {
  id: number;
  name: string;
  status: "available" | "occupied";
};

export const getTables = async () => {
  const res = await axiosClient.get("/tables?order=id.asc");
  return res.data;
};

export const createTable = async (data: { name: string }) => {
  const res = await axiosClient.post("/tables", data);
  return res.data;
};

export const updateTable = async (tableId: number, data: { name: string, status: "available" | "occupied" }) => {
  const res = await axiosClient.patch(`/tables?id=eq.${tableId}`, data);
  return res.data;
}

export const getTableById = async (tableId: number) => {
  const res = await axiosClient.get(`/tables?id=eq.${tableId}`);
  return res.data[0];
};