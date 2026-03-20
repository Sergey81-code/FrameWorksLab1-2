import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import React from "react";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((state) => state.auth.accessToken);

  if (token) {
    return <Navigate to="/catalog" replace />;
  }

  return <>{children}</>;
}