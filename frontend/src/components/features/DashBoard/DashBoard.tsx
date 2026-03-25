import React, { useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, Header } from "../../index";
import { HeaderAction } from "../Header/Header";
import RegisterProductsPage from "../../../pages/RegisterUpdateProductsPage";
import ProductsTablePage from "../../../pages/ProductsTablePage";
import { useLogoutMutation } from "../../../stores/slices/api/authApi";

interface DashboardProps {
  sidebarTitle: string;
  sidebarLogo?: React.ReactNode;
  headerActions: HeaderAction[];
  avatar?: string;
}

const getUserNameFromToken = (token: string | null): string => {
  if (!token) return "";

  try {
    const [, payload] = token.split(".");
    if (!payload) return "";

    const decoded = JSON.parse(window.atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof decoded.userName === "string" ? decoded.userName : "";
  } catch {
    return "";
  }
};

const DashBoard: React.FC<DashboardProps> = ({ sidebarTitle, headerActions, avatar }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const userName = useMemo(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) return storedName;

    const decodedName = getUserNameFromToken(localStorage.getItem("token"));
    if (decodedName) {
      localStorage.setItem("username", decodedName);
    }

    return decodedName;
  }, []);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-100">
      <Sidebar title={sidebarTitle} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen md:ml-[250px] lg:ml-[270px]">
        <Header
          actions={headerActions}
          userName={userName}
          onLogout={handleLogout}
          {...(avatar ? { avatar } : {})}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="px-3 py-4 sm:px-5 sm:py-5 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <div className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm sm:rounded-[28px] sm:p-5 lg:p-8">
              <Routes>
                <Route index element={<ProductsTablePage />} />
                <Route path="form" element={<RegisterProductsPage />} />
                <Route path="form/:id" element={<RegisterProductsPage />} />
                <Route path="table" element={<ProductsTablePage />} />
              </Routes>
            </div>
          </div>
        </main>

        <footer className="px-4 pb-6 pt-2 text-center text-xs text-slate-400 sm:text-sm">
          &copy; Derechos reservados
        </footer>
      </div>
    </div>
  );
};

export default DashBoard;
