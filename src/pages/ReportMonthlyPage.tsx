import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "../components/report-monthly/Monthly.scss";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import type { PickerValue } from "@mui/x-date-pickers/internals/models";
import dayjs, { Dayjs } from "dayjs";
import {
  getMonthlyRevenue,
  getVerifyCode,
  REPORT_CODE_TYPE,
  type ReportMonthly,
} from "../api/report";
import MonthlyList from "../components/report-monthly/MonthlyList";
import "dayjs/locale/vi";
import VerifyCode from "../components/verify";

export function ReportMonthlyPage() {
  const today = dayjs();
  const [selectedMonth, setSelectedMonth] = useState<PickerValue | null>(today);
  const [reportData, setReportData] = useState<ReportMonthly[]>([]);
  const [verified, setVerified] = useState<boolean>(false);
  const [verifiedErr, setVerifiedErr] = useState<boolean>(false);

  const fetchData = async (month: dayjs.Dayjs) => {
    const formattedMonth = month.format("YYYY-MM") + "-01";
    const data = await getMonthlyRevenue(formattedMonth);
    setReportData(data);
  };

  const handleMonthChange = async (value: Dayjs | null) => {
    setSelectedMonth(value);

    if (value && verified) {
      await fetchData(value);
    }
  };

  const handleVerify = async (code: string) => {
    const verifyCode = await getVerifyCode(REPORT_CODE_TYPE);
    if (code === verifyCode.value) {
      setVerified(true);
    } else {
      setVerifiedErr(true);
    }
  };

  useEffect(() => {
    if (!verified) return;
    fetchData(today);
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
    <div className="monthly-report-wrapper">
      <div className="monthly-report-title">
        Tổng kết tháng: <span>{selectedMonth?.format("MM/YYYY")}</span>
      </div>
      <div className="monthly-report-content">
        <div className="date-picker-wrapper">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <DatePicker
              label="Chọn tháng"
              views={["year", "month"]}
              value={selectedMonth}
              onChange={handleMonthChange}
              format="MM/YYYY"
            />
          </LocalizationProvider>
        </div>
        <div className="report-list">
          <MonthlyList listData={reportData} />
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
