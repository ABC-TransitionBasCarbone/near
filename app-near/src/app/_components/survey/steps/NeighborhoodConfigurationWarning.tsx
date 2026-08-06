import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { type ReactNode } from "react";

interface NeighborhoodConfigurationWarningProps {
  children: ReactNode;
}
const NeighborhoodConfigurationWarning: React.FC<
  NeighborhoodConfigurationWarningProps
> = ({ children }) => (
  <div
    id="neighborhood-config-prerequisite"
    className="mt-5 flex items-start gap-3 rounded-lg bg-error/10 p-4 text-error"
  >
    <ErrorOutlineOutlinedIcon aria-hidden className="mt-0.5 shrink-0" />
    <div>{children}</div>
  </div>
);

export default NeighborhoodConfigurationWarning;
