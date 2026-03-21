import React, { useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, Header } from "../../index";
import { HeaderAction } from "../Header/Header";
import RegisterProductsPage from "../../../pages/RegisterUpdateProductsPage";
import ProductsTablePage from "../../../pages/ProductsTablePage";
import { BASE_API } from "../../../utils/constants";

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

const DashBoard: React.FC<DashboardProps> = ({
  sidebarTitle,
  headerActions,
  avatar,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    try {
      await fetch(`${BASE_API}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">
      <Sidebar
        title={sidebarTitle}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen md:ml-[270px]">
        <Header
          actions={headerActions}
          userName={userName}
          onLogout={handleLogout}
          {...(avatar ? { avatar } : {})}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
              <Routes>
                <Route index element={<ProductsTablePage />} />
                <Route path="form" element={<RegisterProductsPage />} />
                <Route path="form/:id" element={<RegisterProductsPage />} />
                <Route path="table" element={<ProductsTablePage />} />
              </Routes>
            </div>
          </div>
        </main>

        <footer className="px-4 pb-6 pt-2 text-center text-sm text-slate-400">
          &copy; Derechos reservados
        </footer>
      </div>
    </div>
  );
};

export default DashBoard;
