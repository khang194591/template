import React from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-cyan-500 to-indigo-500">
      <div className="w-full mx-4 md:w-[480px] p-8 rounded-xl bg-white">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
