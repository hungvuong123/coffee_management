import { NavLink } from "react-router-dom";
import Logo from "../../assets/images/logo.jpg";
import "./Header.scss";
import { Button } from "@mui/material";

export default function Header() {
  return (
    <div className="header-wrapper">
      <div className="header-left">
        <img src={Logo} alt="Logo" width={120} height={72} />
      </div>

      <div className="header-center">
        <NavLink
          to="/tables"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Bàn
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Danh Mục Sản Phẩm
        </NavLink>

        <NavLink
          to="/report-daily"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Tổng Kết Ngày
        </NavLink>

        <NavLink
          to="/report-monthly"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Tổng Kết Tháng
        </NavLink>
      </div>

      <div className="header-right">
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Tải lại trang
        </Button>
      </div>
    </div>
  );
}
