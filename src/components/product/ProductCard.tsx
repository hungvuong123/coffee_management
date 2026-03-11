import React from "react";
import { SquarePen } from "lucide-react";
import "./Product.scss";
import type { Product } from "../../api/product.api";

interface CategoryCardProps {
  product?: Product;
  className?: string;
  onEdit?: () => void;
  onClick?: () => void;
}

const ProductCard: React.FC<CategoryCardProps> = ({
  product,
  className = "",
  onEdit,
  onClick,
}) => {
  return (
    <div className={`product-card ${className}`} onClick={onClick}>
      <div className="product-actions" onClick={(e) => {
        e.stopPropagation();
        onEdit?.();
      }}>
        <SquarePen />
      </div>
      <div className="product-content">
        <img
          src={product?.image}
          alt="Product"
          width={150}
          height={150}
          className="product-image"
        />
        {product?.name && <div style={{ padding: "0" }}>{product.name}</div>}
        {product?.price !== undefined && (
          <div style={{ padding: "0" }}>
            {product.price.toLocaleString()} VND
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
