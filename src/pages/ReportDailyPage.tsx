import "../components/report-daily/Daily.scss";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState, type JSX } from "react";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import {
  getTableItemsByDate,
  getVerifyCode,
  REPORT_CODE_TYPE,
  type ReportOrder,
} from "../api/report";
import DailyList from "../components/report-daily/DailyList";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useSearchParams } from "react-router-dom";
import VerifyCode from "../components/verify";

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

  const [selectedDate, setSelectedDate] = useState<PickerValue | null>(
    date ? dayjs(date) : today,
  );

  const [reportData, setReportData] = useState<ReportProduct[]>([]);
  const [verified, setVerified] = useState<boolean>(false);
  const [verifiedErr, setVerifiedErr] = useState<boolean>(false);

  const groupProductSales = (items: ReportOrder[]) => {
    const result: Record<string, ReportProduct> = {};

    items.forEach((item) => {
      const productId = item.product_id;

      if (!result[productId]) {
        result[productId] = {
          id: productId,
          name: item.products?.name || "",
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

    if (newValue && verified) {
      await fetchData(newValue.format("DD/MM/YYYY"));
    }
  };

  const handleVerify = async (code: string) => {
    const verifyCode = await getVerifyCode(REPORT_CODE_TYPE);
    if (code === verifyCode.value) {
      setVerified(true);
    } else {
      setVerifiedErr(true);
    }
  }

  useEffect(() => {
    if (!verified) return;

    fetchData(
      selectedDate
        ? selectedDate.format("DD/MM/YYYY")
        : today.format("DD/MM/YYYY"),
    );
  }, [verified]);

  if (!verified) {
    return (
      <div className="verify-wrapper">
        <VerifyCode
          onVerify={(code) => {
            handleVerify(code);
          }}
        />
        <div className="verify-error">
          {verifiedErr ? "Mã xác thực không đúng. Vui lòng nhập lại" : null}
        </div>
      </div>
    );
  }

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
