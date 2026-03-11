import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import '../components/report-monthly/Monthly.scss';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import type { PickerValue } from '@mui/x-date-pickers/internals/models';
import dayjs, { Dayjs } from 'dayjs';
import { getMonthlyRevenue, type ReportMonthly } from '../api/report';
import MonthlyList from '../components/report-monthly/MonthlyList';
import "dayjs/locale/vi";

export function ReportMonthlyPage() {
  const today = dayjs();
  const [selectedMonth, setSelectedMonth] = useState<PickerValue | null>(today);
  const [reportData, setReportData] = useState<ReportMonthly[]>([]);

  const fetchData = async (month: dayjs.Dayjs) => {
    const formattedMonth = month.format("YYYY-MM") + "-01";
    const data = await getMonthlyRevenue(formattedMonth);
    setReportData(data);
  };

  const handleMonthChange = async (value: Dayjs | null) => {
    setSelectedMonth(value);

    if (value) {
      await fetchData(value);
    }
  };

  // load tháng hiện tại khi vào page
  useEffect(() => {
    fetchData(today);
  }, []);

  return (
    <div className="monthly-report-wrapper">
      <div className="monthly-report-title">
        Tổng kết tháng: <span>{selectedMonth?.format("MM/YYYY")}</span>
      </div>
      <div className="monthly-report-content">
        <div className="date-picker-wrapper">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='vi'>
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
          {/* Hiển thị kết quả báo cáo ở đây */}
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
