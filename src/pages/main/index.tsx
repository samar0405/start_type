import React from "react";
import Sidebar from "../../components/ui/sidebar/index";
import { Outlet } from "react-router-dom";

const Index: React.FC = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

export default Index;
