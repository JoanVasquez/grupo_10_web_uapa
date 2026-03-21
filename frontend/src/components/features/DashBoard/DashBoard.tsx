import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Sidebar, Header } from "../../index";
import { HeaderAction } from "../Header/Header";
import RegisterProductsPage from "../../../pages/RegisterUpdateProductsPage";
import ProductsTablePage from "../../../pages/ProductsTablePage";

interface DashboardProps {
  sidebarTitle: string;
  sidebarLogo?: React.ReactNode;
  headerActions: HeaderAction[];
  avatar?: string;
}

const DashBoard: React.FC<DashboardProps> = ({
  sidebarTitle,
  headerActions,
  avatar,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

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
          {...(avatar ? { avatar } : {})}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<ProductsTablePage />} />
                <Route path="/form" element={<RegisterProductsPage />} />
                <Route path="/form/:id" element={<RegisterProductsPage />} />
                <Route path="/table" element={<ProductsTablePage />} />
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
