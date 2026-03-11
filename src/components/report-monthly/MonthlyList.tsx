import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { ReportMonthly } from "../../api/report";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

interface MonthlyListProps {
  listData: ReportMonthly[];
}

export default function MonthlyList({ listData }: MonthlyListProps) {
  const navigate = useNavigate();
  const columns = [
    {
      field: "day",
      headerName: "Ngày",
      width: 200,
      renderCell: (params: { row: ReportMonthly }) => {
        const order = params.row;
        return <span>{dayjs(order.day).format("DD/MM/YYYY")}</span>;
      },
    },
    {
      field: "total",
      headerName: "Doanh thu",
      width: 200,
      renderCell: (params: { row: ReportMonthly }) => {
        const order = params.row;
        return <span>{order.total.toLocaleString("vi-VN")} VND</span>;
      },
    },
  ];

  return (
    <div className="monthly-list">
      <Paper sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={listData}
          getRowId={(row) => row.day}
          columns={columns}
          sx={{ border: 0 }}
          disableColumnFilter
          disableColumnMenu
          disableRowSelectionOnClick
          hideFooter
          onRowClick={(params) => {
            const day = params.row.day;
            navigate(`/report-daily?date=${day}`);
          }}
          localeText={{ noRowsLabel: "Không có dữ liệu" }}
        />
      </Paper>
    </div>
  );
}
