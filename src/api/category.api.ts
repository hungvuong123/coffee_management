import axiosClient from "./axios";

export type Category = {
  id: number;
  name: string;
  image: string;
};

export type CategoryWithProducts = Category & {
  products: Array<{
    id: number;
    name: string;
    price: number;
  }>;
};

export type ProductSelect = {
  group: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
  }>;
}

export const getCategories = async () => {
  const res = await axiosClient.get("/categories");
  return res.data;
};

export const createCategory = async (data: { name: string; image: string }) => {
  const res = await axiosClient.post("/categories", data);
  return res.data;
};

export const updateCategory = async (categoryId: number, data: { name: string; image: string }) => {
  const res = await axiosClient.patch(`/categories?id=eq.${categoryId}`, data);
  return res.data;
};

export const getCategoryById = async (categoryId: number) => {
  const res = await axiosClient.get(`/categories?id=eq.${categoryId}`);
  return res.data[0];
};

export const getCategoriesWithProducts = async () => {
  const res = await axiosClient.get(
    `/categories?select=name,products(id,name,price)&order=id.asc`,
  );

  const data = res.data.map((category: CategoryWithProducts) => ({
    group: category.name,
    items: category.products || [],
  }));

  return data;
};
