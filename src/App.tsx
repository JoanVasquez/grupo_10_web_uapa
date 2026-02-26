import React from "react";
import AppLayout from "./components/features/AppLayout/AppLayout";
import { HEADER_ACTIONS } from "./components/common/Icons/iconsData";

const App: React.FC = () => {
  return (
    <AppLayout
      sidebarTitle="SETTINGS"
      headerActions={HEADER_ACTIONS}
      avatar="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"
    />
  );
};

export default App;
