"use client";

import { type ReactNode } from "react";
import type React from "react";
import { useAutoSignOutOnExpiredSession } from "../_ui/hooks/useAutoSignOutOnExpiredSession";

interface VerifySessionProps {
  children: ReactNode;
}
const VerifySession: React.FC<VerifySessionProps> = ({ children }) => {
  useAutoSignOutOnExpiredSession();
  return children;
};

export default VerifySession;
