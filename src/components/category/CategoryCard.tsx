import React from "react";
import { SquarePen } from "lucide-react";
import "./Category.scss";

interface CategoryCardProps {
  name?: string;
  image?: string;
  className?: string;
  onEdit?: () => void;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  image,
  className = "",
  onEdit,
  onClick,
}) => {
  return (
    <div className={`category-card ${className}`} onClick={onClick}>
      <div className="category-actions" onClick={(e) => {
        e.stopPropagation();
        onEdit?.();
      }}>
        <SquarePen />
      </div>
      <div className="category-content">
        <img
          src={image}
          alt="Category"
          width={150}
          height={150}
          className="category-image"
        />
        {name && <h3>{name}</h3>}
      </div>
    </div>
  );
};

export default CategoryCard;
