"use client";

import React, { useEffect, useCallback } from "react";

interface ExportModalProps {
  canvas: HTMLCanvasElement;
  onClose: () => void;
  onChangeVisualization: () => void;
  boardName?: string;
  suLabel?: string;
  zoneLabel?: string;
}

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ExportModal: React.FC<ExportModalProps> = ({
  canvas,
  onClose,
  onChangeVisualization,
  boardName,
  suLabel,
  zoneLabel,
}) => {
  const previewUrl = canvas.toDataURL("image/png");

  const handleDownloadPng = () => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const ts = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const parts = ["near-dataviz"];
      if (suLabel) parts.push(slugify(suLabel));
      if (boardName) parts.push(slugify(boardName));
      if (zoneLabel) parts.push(slugify(zoneLabel));
      parts.push(ts);
      link.href = url;
      link.download = `${parts.join("_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Exporter la visualisation"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-grayLight px-5 py-4">
          <div className="flex flex-col">
            <span className="font-semibold text-black">
              Aperçu de l&apos;export
            </span>
            {(suLabel ?? boardName ?? zoneLabel) && (
              <span className="text-xs text-gray">
                {[suLabel, boardName, zoneLabel].filter(Boolean).join(" · ")}
              </span>
            )}
          </div>
          <button
            className="text-xl leading-none text-gray hover:text-black"
            onClick={onClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-grayExtraLight p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Aperçu de la zone sélectionnée"
            className="mx-auto max-w-full rounded shadow"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-grayLight px-5 py-4">
          <button
            className="rounded-lg border border-blue px-4 py-2 text-sm font-semibold text-blue transition hover:bg-blue/5"
            onClick={onChangeVisualization}
          >
            Changer de visualisation
          </button>
          <button
            className="rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            onClick={handleDownloadPng}
          >
            ⬇️ Télécharger PNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
