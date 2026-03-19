import { useEffect, useState } from "react";
import { createTable, getTables, updateTable, type Table } from "../api/table.api";
import TableCard from "../components/table/TableCard";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [open, setOpen] = useState(false);
  const [tableName, setTableName] = useState("");
  const [tableStatus, setTableStatus] = useState<"available" | "occupied">("available");
  const [actionTableId, setActionTableId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchTables = async () => {
    const data = await getTables();
    setTables(data);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleSaveTable = async () => {
    if (!tableName.trim()) return;

    if (actionTableId) {
      // TODO: gọi API chỉnh sửa bàn
      await updateTable(actionTableId, {
        name: tableName,
        status: tableStatus,
      });
    } else {
      // TODO: gọi API thêm bàn
      await createTable({ name: tableName })
    }

    setActionTableId(null);
    setTableName("");
    setOpen(false);

    fetchTables();
  };

  const handleClickEdit = (table: Table) => {
    setActionTableId(table.id);
    setTableName(table.name);
    setTableStatus(table.status);
    setOpen(true);
  };

  const handleClickTable = (tableId: number) => {
    navigate(`/tables/${tableId}`);
  };

  return (
    <div className="tables-wrapper">
      <p className="table-list-title">Danh sách bàn</p>

      <div className="add-table-btn">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Thêm Bàn
        </Button>
      </div>

      <div className="table-list">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            name={table.name}
            status={table.status}
            onEdit={() => handleClickEdit(table)}
            onClick={() => handleClickTable(table.id)}
          />
        ))}
      </div>

      {/* Dialog thêm bàn */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="add-table-dialog"
      >
        <DialogTitle style={{ fontWeight: "bold" }}>
          {actionTableId !== null ? "Chỉnh sửa" : "Thêm"} bàn
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên bàn"
            fullWidth
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            style={{ width: "400px" }}
            defaultValue={tableName || ''}
          />
        </DialogContent>

        <DialogActions style={{ padding: "16px 24px" }}>
          <Button onClick={() => {
            setOpen(false);
            setTableName("");
            setActionTableId(null);
          }}>Huỷ</Button>
          <Button variant="contained" onClick={handleSaveTable}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
