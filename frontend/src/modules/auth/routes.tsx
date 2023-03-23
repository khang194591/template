import { RouteObject } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import LoginView from "./views/LoginView";

export default {
  path: "/auth",
  element: <AuthLayout />,
  children: [
    {
      path: "login",
      element: <LoginView />,
    },
  ],
} as RouteObject;
