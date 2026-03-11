import { Routes, Route } from "react-router-dom";

import TablesPage from "../pages/TablesPage";
import ProductPage from "../pages/ProductPage";
import CategoryPage from "../pages/CategoryPage";
import CategoryDetailPage from "../pages/CategoryDetailPage";
import OrderTablePage from "../pages/OrderTablePage";
import { ReportDailyPage } from "../pages/ReportDailyPage";
import { ReportMonthlyPage } from "../pages/ReportMonthlyPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<TablesPage />} />
      <Route path="/tables" element={<TablesPage />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/categories/:id" element={<CategoryDetailPage />} />
      <Route path="/tables/:id" element={<OrderTablePage />} />
      <Route path="/report-daily" element={<ReportDailyPage />} />
      <Route path="/report-monthly" element={<ReportMonthlyPage />} />
    </Routes>
  );
}
