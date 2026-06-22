import { Navigate, useLocation } from "react-router";
import { isAuthenticated } from "../lib/auth-store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}
