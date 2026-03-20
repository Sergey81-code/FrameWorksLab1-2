import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAppSelector((state) => state.auth.accessToken);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}