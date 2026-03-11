import '../components/report-daily/Daily.scss';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState, type JSX } from 'react';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import { getTableItemsByDate, type ReportOrder } from '../api/report';
import DailyList from '../components/report-daily/DailyList';
import dayjs from 'dayjs';
import "dayjs/locale/vi";
import { useSearchParams } from "react-router-dom";

export type ReportProduct = {
  id: number;
  name: string;
  quantity: number;
  total: number;
};

export function ReportDailyPage(): JSX.Element {
  const today = dayjs();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  console.log("date", date);
  const [selectedDate, setSelectedDate] = useState<PickerValue | null>(date ? dayjs(date) : today);
  const [reportData, setReportData] = useState<ReportProduct[]>([]);

  const groupProductSales = (items: ReportOrder[]) => {
    const result: Record<string, ReportProduct> = {};

    items.forEach((item) => {
      const productId = item.product_id;

      if (!result[productId]) {
        result[productId] = {
          id: productId,
          name: item.products?.name || '',
          quantity: 0,
          total: 0,
        };
      }

      result[productId].quantity += item.quantity;
      result[productId].total += item.price;
    });

    return Object.values(result);
  };

  const fetchData = async (date: string) => {
    const res = await getTableItemsByDate(date);
    const groupedData = groupProductSales(res);
    setReportData(groupedData);
  };

  const handleDateChange = async (newValue: PickerValue): Promise<void> => {
    setSelectedDate(newValue);
    if (newValue) {
      await fetchData(newValue.format("DD/MM/YYYY"));
    }
  };

  // load today khi vào page
  useEffect(() => {
    fetchData(selectedDate ? selectedDate.format("DD/MM/YYYY") : today.format("DD/MM/YYYY"));
  }, []);

  return (
    <div className="daily-report-wrapper">
      <div className="daily-report-title">
        Tổng kết ngày: <span>{selectedDate?.format("DD/MM/YYYY")}</span>
      </div>
      <div className="daily-report-content">
        <div className="date-picker-wrapper">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              className="date-picker"
            />
          </LocalizationProvider>
        </div>
        <div className="report-list">
          {/* Hiển thị kết quả báo cáo ở đây */}
          <DailyList listData={reportData} />
        </div>
        <div className="total-price">
          Tổng tiền:{" "}
          {reportData
            .reduce((sum, item) => sum + item.total, 0)
            .toLocaleString("vi-VN")}{" "}
          VND
        </div>
      </div>
    </div>
  );
}