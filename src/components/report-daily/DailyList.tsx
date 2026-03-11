import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { ReportProduct } from "../../pages/ReportDailyPage";

interface DailyListProps {
  listData: ReportProduct[];
}

export default function DailyList({ listData }: DailyListProps) {
  const columns = [
    {
      field: "name",
      headerName: "Sản phẩm",
      width: 300,
      renderCell: (params: { row: ReportProduct }) => {
        const order = params.row;
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>{order.name}</span>
          </div>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      width: 100,
      renderCell: (params: { row: ReportProduct }) => {
        const order = params.row;
        return <span>{order.quantity}</span>;
      },
    },
    {
      field: "total",
      headerName: "Giá",
      width: 200,
      valueFormatter: (params: number) => {
        return params.toLocaleString("vi-VN") + " VND";
      },
      renderCell: (params: { row: ReportProduct }) => {
        const order = params.row;
        return <span>{order.total.toLocaleString("vi-VN")} VND</span>;
      },
    },
  ];

  return (
    <div className="order-list">
      <Paper sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={listData}
          columns={columns}
          sx={{ border: 0 }}
          disableColumnFilter
          disableColumnMenu
          disableRowSelectionOnClick
          hideFooter
          localeText={{ noRowsLabel: "Không có dữ liệu" }}
        />
      </Paper>
    </div>
  );
}
