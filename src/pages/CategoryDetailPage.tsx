import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, type Category } from "../api/category.api";
import "../components/product/Product.scss";
import { createProduct, getProducts, updateProduct, type Product } from "../api/product.api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  TextField,
} from "@mui/material";
import ProductCard from "../components/product/ProductCard";
import { uploadProductImage } from "../api/storage.api";

export default function CategoryDetailPage() {
  const { id } = useParams();
  const initialProductData = {
    id: 0,
    name: "",
    image: "",
    price: 0,
    is_available: true,
    category_id: Number(id),
  };
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productData, setProductData] = useState<Product>(initialProductData);
  const [actionProductId, setActionProductId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

useEffect(() => {
  const categoryId = Number(id);
  if (!categoryId) return;

  const fetchData = async () => {
    try {
      const [category, products] = await Promise.all([
        getCategoryById(categoryId),
        getProducts(categoryId),
      ]);

      setCategory(category);
      setProducts(products);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  fetchData();
}, [id]);

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setProductData({
      ...productData,
      image: URL.createObjectURL(file),
    });
  };

  const handleSaveProduct = async () => {
    if (!productData?.name.trim()) return;

    let imageUrl = productData.image;

    if (imageFile) {
      imageUrl = await uploadProductImage(imageFile);
    }

    if (actionProductId) {
      await updateProduct(actionProductId, {
        name: productData.name,
        image: imageUrl,
        price: productData.price,
        is_available: productData.is_available,
        category_id: Number(id),
      });
    } else {
      await createProduct({
        name: productData.name,
        image: imageUrl,
        price: productData.price,
        is_available: productData.is_available,
        category_id: Number(id),
      });
    }

    setProductData(initialProductData);
    setImageFile(null);
    setActionProductId(null);
    setOpen(false);

    await getProducts(Number(id)).then((data) => setProducts(data));
  };

  const handleClickEdit = (product: Product) => {
    setActionProductId(product.id);
    setProductData(product);
    setOpen(true);
  };

  const handleClickProduct = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="product-list-wrapper">
      <p className="product-list-title">
        Danh sách sản phẩm trong danh mục:{" "}
        <span style={{ color: "#ED1B2F" }}>{category?.name}</span>
      </p>
      <div className="add-product-btn">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Thêm sản phẩm
        </Button>
      </div>
      <div className="product-list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={() => {
              handleClickEdit(product);
            }}
            onClick={() => handleClickProduct(product.id)}
          />
        ))}
      </div>
      {/* Dialog thêm sản phẩm */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="add-product-dialog"
      >
        <DialogTitle style={{ fontWeight: "bold" }}>
          {actionProductId !== null ? "Chỉnh sửa" : "Thêm"} sản phẩm
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên sản phẩm"
            fullWidth
            value={productData?.name || ""}
            onChange={(e) =>
              setProductData({
                ...productData,
                name: e.target.value,
              } as Product)
            }
            // style={{ width: "400px" }}
          />

          <TextField
            margin="dense"
            label="Giá"
            fullWidth
            value={productData?.price || ""}
            onChange={(e) =>
              setProductData({
                ...productData,
                price: Number(e.target.value),
              } as Product)
            }
            // style={{ width: "400px" }}
          />

          <Switch
            title="Có hàng"
            checked={productData?.is_available}
            onChange={(e) =>
              setProductData({
                ...productData,
                is_available: e.target.checked,
              } as Product)
            }
          />

          <div style={{ marginTop: "16px" }}>
            <input type="file" accept="image/*" onChange={handleSelectImage} />
          </div>

          {productData.image && (
            <div style={{ marginTop: "12px" }}>
              <img
                src={productData.image}
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
              setProductData(initialProductData);
              setImageFile(null);
              setActionProductId(null);
            }}
          >
            Huỷ
          </Button>
          <Button variant="contained" onClick={handleSaveProduct}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
