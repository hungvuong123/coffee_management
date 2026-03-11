import axiosClient from "./axios";

const SUPABASE_URL = "https://puiiqwoajgvphezrshmc.supabase.co";
const BUCKET = "coffee-images";

export const uploadCategoryImage = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const formData = new FormData();
  formData.append("file", file);

  await axiosClient.post(
    "https://puiiqwoajgvphezrshmc.supabase.co/storage/v1/object/coffee-images/" +
      fileName,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;

  return imageUrl;
};

export const uploadProductImage = async (file: File) => {
  const fileName = `product-${Date.now()}-${file.name}`;
  const formData = new FormData();
  formData.append("file", file);

  await axiosClient.post(
    "https://puiiqwoajgvphezrshmc.supabase.co/storage/v1/object/coffee-images/" +
      fileName,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;

  return imageUrl;
};

