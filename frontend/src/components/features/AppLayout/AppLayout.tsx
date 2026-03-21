import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthPage from "../../../pages/AuthPage";
import DashBoard from "../DashBoard/DashBoard";
import { HeaderAction } from "../Header/Header";

interface AppLayoutProps {
  sidebarTitle: string;
  sidebarLogo?: React.ReactNode;
  headerActions: HeaderAction[];
  avatar?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ sidebarTitle, headerActions, avatar }) => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route
        path="/dashboard/*"
        element={
          <DashBoard
            sidebarTitle={sidebarTitle}
            headerActions={headerActions}
            {...(avatar ? { avatar } : {})}
          />
        }
      />
    </Routes>
  );
};

export default AppLayout;
