import React from 'react';
import { SquarePen } from 'lucide-react';
import './Table.scss';

interface TableCardProps {
  name?: string;
  status?: "available" | "occupied";
  className?: string;
  onEdit?: () => void;
  onClick?: () => void;
}

const TableCard: React.FC<TableCardProps> = ({
  name,
  status = "available",
  className = "",
  onEdit,
  onClick,
}) => {
  return (
    <div className={`table-card ${className} ${status}`} onClick={onClick}>
      <div className="table-actions" onClick={(e) => {
        e.stopPropagation();
        onEdit?.();
      }}>
        <SquarePen />
      </div>
      {name && <h3>{name}</h3>}
    </div>
  );
};

export default TableCard;
