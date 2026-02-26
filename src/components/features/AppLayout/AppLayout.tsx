import React, { useState } from "react";
import { Sidebar } from "../../index";
import { Header } from "../../index";
import styles from "./AppLayout.module.css";
import { Route, Routes } from "react-router-dom";
import RegisterProductsPage from "../../../pages/RegisterProductsPage";
import { HeaderAction } from "../Header/Header";

interface AppLayoutProps {
  sidebarTitle: string;
  sidebarLogo?: React.ReactNode;
  headerActions: HeaderAction[];
  avatar?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ sidebarTitle, headerActions, avatar }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar title={sidebarTitle} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.content}>
        <Header
          actions={headerActions}
          avatar={avatar}
          onMenuClick={() => setSidebarOpen((o) => !o)}
        />
        <main id="main-content" className={styles.main}>
          <Routes>
            <Route path="/" element={<RegisterProductsPage />} />
          </Routes>
          <footer>&copy;Derechos reservados</footer>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
