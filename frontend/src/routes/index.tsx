import { createBrowserRouter } from "react-router-dom";
import authRoutes from "../modules/auth/routes";

const router = createBrowserRouter([
  {
    path: "/",
  },
  authRoutes,
]);

export default router;
