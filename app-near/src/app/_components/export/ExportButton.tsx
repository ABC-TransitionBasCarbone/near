import { useState, type ReactNode } from "react";
import Button from "../_ui/Button";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";

interface ExportButtonProps {
  label: string;
  endPoint: string;
  icon?: ReactNode;
}

const getFilename = (contentDisposition: string | null): string => {
  const match = contentDisposition?.match(/filename="?([^"]+)"?/);
  return match?.[1] ?? "export.csv";
};

const ExportButton: React.FC<ExportButtonProps> = ({
  label,
  endPoint,
  icon = <CloudDownloadOutlinedIcon aria-hidden />,
}) => {
  const [hasError, setHasError] = useState(false);

  const handleOnClick = async () => {
    setHasError(false);
    const response = await fetch(endPoint);

    if (!response.ok) {
      setHasError(true);
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = getFilename(response.headers.get("Content-Disposition"));
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Button onClick={handleOnClick} border={false}>
        <div className="flex w-full items-center justify-center gap-2">
          {icon}
          {label}
        </div>
      </Button>
      {hasError && (
        <p className="text-sm text-error">
          Une erreur est survenue pendant l&apos;export, veuillez réessayer.
        </p>
      )}
    </div>
  );
};

export default ExportButton;
