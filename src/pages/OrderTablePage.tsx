import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCategoriesWithProducts,
  type ProductSelect,
} from "../api/category.api";
import "../components/order/Order.scss";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { getTableById, updateTable, type Table } from "../api/table.api";
import {
  createOrder,
  deleteOrder,
  getTableOrders,
  updateOrder,
  type Order,
} from "../api/order.api";
import OrderList from "../components/order/OrderList";

export default function OrderTablePage() {
  const { id } = useParams();
  const initialOrderData = {
    id: 0,
    product_id: 0,
    quantity: 0,
    price: 0,
    note: "",
    table_id: Number(id),
    is_paid: false,
    is_exported: false,
  };
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [table, setTable] = useState<Table | null>(null);
  const [products, setProducts] = useState<ProductSelect[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderData, setOrderData] = useState<Order>(initialOrderData);
  const [actionOrderId, setActionOrderId] = useState<number | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [table, orders, products] = await Promise.all([
          getTableById(Number(id)),
          getTableOrders(Number(id)),
          getCategoriesWithProducts(),
        ]);

        setTable(table);
        setOrders(orders);
        setProducts(products);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSaveOrder = async () => {
    if (!orderData?.product_id) return;

    if (actionOrderId) {
      await updateOrder(actionOrderId, {
        product_id: orderData.product_id,
        quantity: orderData.quantity,
        price: (orderData.product_price || 0) * orderData.quantity,
        table_id: orderData.table_id,
        note: orderData.note || "",
        is_paid: orderData.is_paid,
        is_exported: orderData.is_exported,
      });
    } else {
      await Promise.all([
        createOrder({
          product_id: orderData.product_id,
          quantity: orderData.quantity,
          price: (orderData.product_price || 0) * orderData.quantity,
          table_id: orderData.table_id,
          note: orderData.note || "",
          is_paid: false,
          is_exported: false,
        }),
        table?.status === "available" &&
          updateTable(Number(id), {
            name: table?.name || "",
            status: "occupied",
          }),
      ]);
    }

    setOrderData(initialOrderData);
    setActionOrderId(null);
    setOpen(false);

    getTableOrders(Number(id)).then((data) => setOrders(data));
  };

  const handleSelectProduct = (productId: number) => {
    const selectedProduct = products
      .flatMap((group) => group.items)
      .find((item) => item.id === productId);
    if (selectedProduct) {
      setOrderData({
        ...orderData,
        product_id: selectedProduct.id,
        product_price: selectedProduct.price || 0,
      });
    }
  };

  const handleEditOrder = (order: Order) => {
    setActionOrderId(order.id);
    setOrderData(order);
    setOpen(true);
  };

  const handleClickDeleteOrder = (orderId: number) => {
    // Implement delete order logic here
    setDeleteOrderId(orderId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDeleteOrder = async () => {
    if (deleteOrderId) {
      // Call API to delete order
      await deleteOrder(deleteOrderId);

      // Refresh order list
      getTableOrders(Number(id)).then((data) => setOrders(data));
    }
    setOpenDeleteDialog(false);
    setDeleteOrderId(null);
  };

  const handleSelectOrders = (rows: Order[]) => {
    setSelectedOrders(rows);
    const total = rows.reduce((sum, order) => sum + order.price, 0);
    setTotalPrice(total);
  };

  const handlePayment = async () => {
    // Implement payment logic here, e.g., call API to mark orders as paid
    await Promise.all(
      selectedOrders.map((order) =>
        updateOrder(order.id, {
          product_id: order.product_id,
          quantity: order.quantity,
          price: order.price,
          table_id: order.table_id,
          note: order.note,
          is_paid: true,
          is_exported: order.is_exported,
        }),
      ),
    ).then(() => getTableOrders(Number(id)).then((data) => setOrders(data)));
    setSelectedOrders([]);
    setTotalPrice(0);
  };

  const handleEmptyTable = async () => {
    // Implement empty table logic here, e.g., call API to mark table as available and delete all orders
    await Promise.all([
      updateTable(Number(id), {
        name: table?.name || "",
        status: "available",
      }),
      ...orders.map((order) =>
        updateOrder(order.id, {
          product_id: order.product_id,
          quantity: order.quantity,
          price: order.price,
          table_id: order.table_id,
          note: order.note,
          is_paid: order.is_paid,
          is_exported: true,
        }),
      ),
    ]).then(() => navigate("/tables"));
  };

  return (
    <div className="order-list-wrapper">
      <p className="order-list-title">
        <span style={{ color: "#ED1B2F" }}>{table?.name}</span>
      </p>
      <div className="add-order-btn">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Gọi món
        </Button>
        <Button variant="contained" color="primary" onClick={handleEmptyTable}>
          Đã trống
        </Button>
      </div>
      <div className="order-list">
        <OrderList
          orders={orders}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleClickDeleteOrder}
          onSelectedRows={handleSelectOrders}
        />
        <div className="total-price">
          Tổng tiền: {totalPrice.toLocaleString("vi-VN")} VND
        </div>
        <div className="payment-order-btn">
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayment}
            disabled={selectedOrders.length === 0}
          >
            Thanh toán
          </Button>
        </div>
      </div>
      {/* Dialog thêm đơn hàng */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="add-order-dialog"
      >
        <DialogTitle style={{ fontWeight: "bold" }}>
          {actionOrderId !== null ? "Chỉnh sửa" : "Thêm"} đơn hàng
        </DialogTitle>

        <DialogContent>
          <FormControl
            fullWidth
            style={{ marginTop: "16px" }}
            autoFocus={false}
          >
            <InputLabel htmlFor="grouped-select-label">Sản Phẩm</InputLabel>
            <Select
              value={orderData.product_id}
              label="Sản phẩm"
              onChange={(e) => handleSelectProduct(e.target.value)}
              fullWidth
              SelectDisplayProps={{
                "aria-labelledby": "grouped-select-label",
              }}
            >
              {products.map((group) => [
                <ListSubheader
                  key={group.group}
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#ED1B2F",
                  }}
                >
                  {group.group}
                </ListSubheader>,
                group.items.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                )),
              ])}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Số lượng"
            fullWidth
            value={orderData?.quantity || ""}
            onChange={(e) =>
              setOrderData({
                ...orderData,
                quantity: Number(e.target.value),
              } as Order)
            }
            style={{ marginTop: "16px" }}
          />
          <TextField
            margin="dense"
            label="Ghi chú"
            fullWidth
            value={orderData?.note || ""}
            onChange={(e) =>
              setOrderData({
                ...orderData,
                note: e.target.value,
              } as Order)
            }
            style={{ marginTop: "16px" }}
          />
        </DialogContent>

        <DialogActions style={{ padding: "16px 24px" }}>
          <Button
            onClick={() => {
              setOpen(false);
              setOrderData(initialOrderData);
              setActionOrderId(null);
            }}
          >
            Huỷ
          </Button>
          <Button variant="contained" onClick={handleSaveOrder}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog xác nhận xóa đơn hàng */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        className="delete-order-dialog"
      >
        <DialogTitle style={{ fontWeight: "bold" }}>
          Xác nhận xóa đơn hàng
        </DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa đơn hàng này không?</p>
        </DialogContent>
        <DialogActions style={{ padding: "16px 24px" }}>
          <Button
            onClick={() => {
              setOpenDeleteDialog(false);
              setDeleteOrderId(null);
            }}
          >
            Huỷ
          </Button>
          <Button variant="contained" onClick={handleConfirmDeleteOrder}>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
