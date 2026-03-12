import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { Order } from "../../api/order.api";
import { SquarePen, Trash2 } from "lucide-react";

interface OrderListProps {
  orders: Order[];
  onEditOrder?: (order: Order) => void;
  onDeleteOrder?: (orderId: number) => void;
  onSelectedRows?: (rows: Order[]) => void;
}

export default function OrderList({ orders, onEditOrder, onDeleteOrder, onSelectedRows }: OrderListProps) {
  const columns = [
    {
      field: "product_name",
      headerName: "Sản phẩm",
      width: 300,
      renderCell: (params: { row: Order }) => {
        const order = params.row;
        return (
          <div
            style={{ display: "flex", flexDirection: "column" }}
            className={order.is_paid ? "disable" : ""}
          >
            <span>{order.product_name}</span>
          </div>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      width: 100,
      renderCell: (params: { row: Order }) => {
        const order = params.row;
        return (
          <span className={order.is_paid ? "disable" : ""}>
            {order.quantity}
          </span>
        );
      },
    },
    {
      field: "product_price",
      headerName: "Đơn giá",
      width: 150,
      renderCell: (params: { row: Order }) => {
        const order = params.row;
        return (
          <span className={order.is_paid ? "disable" : ""}>
            {order.product_price?.toLocaleString("vi-VN")} VND
          </span>
        );
      },
    },
    {
      field: "price",
      headerName: "Giá",
      width: 150,
      valueFormatter: (params: number) => {
        return params.toLocaleString("vi-VN") + " VND";
      },
      renderCell: (params: { row: Order }) => {
        const order = params.row;
        return (
          <span className={order.is_paid ? "disable" : ""}>
            {order.price.toLocaleString("vi-VN")} VND
          </span>
        );
      },
    },
    {
      field: "note",
      headerName: "Ghi chú",
      width: 250,
      renderCell: (params: { row: Order }) => {
        const order = params.row;
        return (
          <span className={order.is_paid ? "disable" : ""}>{order.note}</span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Chức năng",
      width: 150,
      sortable: false,
      renderCell: (params: { row: Order }) => {
        const order = params.row;
        return (
          <div
            className={
              order.is_paid ? "disable order-actions" : "order-actions"
            }
          >
            <SquarePen
              style={{ cursor: "pointer", marginRight: "8px" }}
              onClick={() => onEditOrder && onEditOrder(order)}
            />
            <Trash2
              style={{ cursor: "pointer" }}
              onClick={() => onDeleteOrder && onDeleteOrder(order.id)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="order-list">
      <Paper sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={orders}
          columns={columns}
          checkboxSelection
          sx={{ border: 0 }}
          disableColumnFilter
          disableColumnMenu
          disableRowSelectionOnClick
          hideFooterPagination
          isRowSelectable={(params) => !params.row.is_paid}
          localeText={{ noRowsLabel: "Không có dữ liệu" }}
          onRowSelectionModelChange={(selection) => {
            const selectedIDs = Array.from(selection.ids);
            const selectedRows = orders.filter((row) =>
              selectedIDs.includes(row.id),
            );
            onSelectedRows?.(selectedRows);
          }}
        />
      </Paper>
    </div>
  );
}
