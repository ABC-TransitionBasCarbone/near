import React from "react";

type DvAsyncStatus = "loading" | "error" | "empty";

type DvAsyncProps = {
  loading: boolean;
  error: unknown;
  isEmpty: boolean;
  messages?: Partial<Record<DvAsyncStatus, string>>;
  centered?: boolean;
  children: React.ReactNode;
};

const DEFAULT_MESSAGES: Record<DvAsyncStatus, string> = {
  loading: "Chargement des données…",
  error: "Impossible de charger les données",
  empty: "Aucune donnée disponible",
};

const DvAsync: React.FC<DvAsyncProps> = ({
  loading,
  error,
  isEmpty,
  messages,
  centered = false,
  children,
}) => {
  const status: DvAsyncStatus | null = loading
    ? "loading"
    : error
      ? "error"
      : isEmpty
        ? "empty"
        : null;

  if (!status) return <>{children}</>;

  return (
    <div
      className={
        centered
          ? `flex h-64 items-center justify-center ${status === "error" ? "text-error" : "text-gray"}`
          : `p-3 ${status === "error" ? "text-error" : "text-gray"}`
      }
    >
      {messages?.[status] ?? DEFAULT_MESSAGES[status]}
    </div>
  );
};

export default DvAsync;
