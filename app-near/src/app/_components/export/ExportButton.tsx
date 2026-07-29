import { type ReactNode } from "react";
import Button from "../_ui/Button";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";

interface ExportButtonProps {
  label: string;
  endPoint: string;
  icon?: ReactNode;
}
const ExportButton: React.FC<ExportButtonProps> = ({
  label,
  endPoint,
  icon = <CloudDownloadOutlinedIcon aria-hidden />,
}) => {
  const handleOnClick = () => {
    window.location.href = endPoint;
  };

  return (
    <Button onClick={handleOnClick} border={false}>
      <div className="flex w-full items-center justify-center gap-2">
        {icon}
        {label}
      </div>
    </Button>
  );
};

export default ExportButton;
