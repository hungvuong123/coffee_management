import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { createCategory, getCategories, updateCategory, type Category } from "../api/category.api";
import '../components/category/Category.scss';
import { uploadCategoryImage } from "../api/storage.api";
import CategoryCard from "../components/category/CategoryCard";

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [actionCategoryId, setActionCategoryId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) return;

    let imageUrl = preview;

    if (imageFile) {
      imageUrl = await uploadCategoryImage(imageFile);
    }

    if (actionCategoryId) {
      await updateCategory(actionCategoryId, {
        name: categoryName,
        image: imageUrl,
      });
    } else {
      await createCategory({
        name: categoryName,
        image: imageUrl,
      });
    }

    setCategoryName("");
    setImageFile(null);
    setPreview("");
    setActionCategoryId(null);
    setOpen(false);

    fetchCategories();
  };

  const handleClickEdit = (category: Category) => {
    setActionCategoryId(category.id);
    setCategoryName(category.name);
    setPreview(category.image);
    setOpen(true);
  };

  const handleClickCategory = (categoryId: number) => {
    navigate(`/categories/${categoryId}`);
  }

  return (
    <div className="category-wrapper">
      <p className="category-list-title">Danh sách danh mục</p>

      <div className="add-category-btn">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Thêm danh mục
        </Button>
      </div>

      <div className="category-list">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            image={category.image}
            onEdit={() => handleClickEdit(category)}
            onClick={() => handleClickCategory(category.id)}
          />
        ))}
      </div>

      {/* Dialog thêm danh mục */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="add-category-dialog"
      >
        <DialogTitle style={{ fontWeight: "bold" }}>
          {actionCategoryId !== null ? "Chỉnh sửa" : "Thêm"} danh mục
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên danh mục"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            style={{ width: "400px" }}
          />

          <div style={{ marginTop: "16px" }}>
            <input type="file" accept="image/*" onChange={handleSelectImage} />
          </div>

          {preview && (
            <div style={{ marginTop: "12px" }}>
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          )}
        </DialogContent>

        <DialogActions style={{ padding: "16px 24px" }}>
          <Button
            onClick={() => {
              setOpen(false);
              setCategoryName("");
              setImageFile(null);
              setPreview("");
              setActionCategoryId(null);
            }}
          >
            Huỷ
          </Button>
          <Button variant="contained" onClick={handleSaveCategory}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
