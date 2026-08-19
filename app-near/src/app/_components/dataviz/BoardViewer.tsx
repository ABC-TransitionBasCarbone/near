"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

interface BoardViewerProps {
  children: React.ReactNode;
  isZoneSelectMode?: boolean;
  onZoneCapture?: (canvas: HTMLCanvasElement, zoneLabel?: string) => void;
  onBoardReady?: (ready: boolean) => void;
}

interface HighlightBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

const BoardViewer: React.FC<BoardViewerProps> = ({
  children,
  isZoneSelectMode = false,
  onZoneCapture,
  onBoardReady,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState<HighlightBox | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);
  const [overlayHeight, setOverlayHeight] = useState<number | undefined>();

  const onBoardReadyRef = useRef(onBoardReady);
  useEffect(() => {
    onBoardReadyRef.current = onBoardReady;
  }, [onBoardReady]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const checkReady = () => {
      const svgs = wrapper.querySelectorAll<SVGSVGElement>("svg");
      const ready = Array.from(svgs).some((svg) => svg.childElementCount > 0);
      onBoardReadyRef.current?.(ready);
    };

    const observer = new MutationObserver(checkReady);
    observer.observe(wrapper, { childList: true, subtree: true });
    checkReady();

    return () => observer.disconnect();
  }, []);

  const measureVisualHeight = useCallback((wrapper: HTMLElement): number => {
    const wrapperTop = wrapper.getBoundingClientRect().top;
    const scrollTop = wrapper.scrollTop;
    let maxH = wrapper.scrollHeight;
    const candidates = wrapper.querySelectorAll<HTMLElement>(
      ".board-content, .other-board, .demographie-board, .board-grid, .dv-container",
    );
    for (const el of candidates) {
      const r = el.getBoundingClientRect();
      const absBottom = r.bottom - wrapperTop + scrollTop;
      if (absBottom > maxH) maxH = absBottom;
    }
    return Math.ceil(maxH) + 30;
  }, []);

  useEffect(() => {
    if (isZoneSelectMode && wrapperRef.current) {
      setOverlayHeight(measureVisualHeight(wrapperRef.current));
    } else {
      setOverlayHeight(undefined);
    }
  }, [isZoneSelectMode, measureVisualHeight]);

  const getRelativeBox = (
    el: HTMLElement,
    wrapper: HTMLElement,
  ): HighlightBox => {
    const elRect = el.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    return {
      top: elRect.top - wrapperRect.top + wrapper.scrollTop,
      left: elRect.left - wrapperRect.left,
      width: elRect.width,
      height: elRect.height,
    };
  };

  const findTarget = useCallback((x: number, y: number): HTMLElement | null => {
    const overlay = overlayRef.current;
    const wrapper = wrapperRef.current;
    if (!overlay || !wrapper) return null;

    overlay.style.pointerEvents = "none";
    const el = document.elementFromPoint(x, y);
    overlay.style.pointerEvents = "auto";

    if (!el) return null;

    let node: HTMLElement | null = el as HTMLElement;
    while (node && node !== wrapper) {
      if (
        node.classList.contains("dv-container") ||
        node.classList.contains("zone-target")
      )
        return node;
      node = node.parentElement;
    }

    const boardContent = wrapper.querySelector<HTMLElement>(".board-content");
    return boardContent ?? wrapper;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoneSelectMode || isCapturing) return;
      const target = findTarget(e.clientX, e.clientY);
      if (!target || !wrapperRef.current) return;
      targetRef.current = target;
      setHighlight(getRelativeBox(target, wrapperRef.current));
    },
    [isZoneSelectMode, isCapturing, findTarget],
  );

  const handleMouseLeave = useCallback(() => {
    if (!isCapturing) {
      setHighlight(null);
      targetRef.current = null;
    }
  }, [isCapturing]);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoneSelectMode || isCapturing || !onZoneCapture) return;
      e.stopPropagation();

      const target = findTarget(e.clientX, e.clientY);
      const wrapper = wrapperRef.current;
      if (!target || !wrapper) return;

      setIsCapturing(true);
      setHighlight(null);

      try {
        const { default: html2canvasRaw } = await import("html2canvas");
        const html2canvas = html2canvasRaw as (
          element: HTMLElement,
          options?: unknown,
        ) => Promise<HTMLCanvasElement>;
        const scale =
          window.devicePixelRatio && window.devicePixelRatio > 1
            ? window.devicePixelRatio
            : 2;

        const boardContent =
          wrapper.querySelector<HTMLElement>(".board-content") ?? wrapper;

        const captureHeight = measureVisualHeight(wrapper);

        const fullCanvas = await html2canvas(boardContent, {
          useCORS: true,
          backgroundColor: "#ffffff",
          scale,
          logging: false,
          width: boardContent.offsetWidth,
          height: captureHeight,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          onclone: (_doc: Document, clonedEl: HTMLElement) => {
            let node: HTMLElement | null = clonedEl.parentElement;
            while (node && node.tagName !== "BODY") {
              if (node === clonedEl.parentElement) {
                node.style.height = `${captureHeight}px`;
              }
              node.style.overflow = "visible";
              node.style.overflowX = "visible";
              node.style.overflowY = "visible";
              node.style.minHeight = `${captureHeight}px`;
              node = node.parentElement;
            }
            clonedEl
              .querySelectorAll<HTMLElement>(".other-board, .demographie-board")
              .forEach((b) => {
                b.style.height = "auto";
                b.style.minHeight = `${captureHeight}px`;
              });
          },
        });

        let resultCanvas: HTMLCanvasElement;

        if (target === boardContent || target === wrapper) {
          resultCanvas = fullCanvas;
        } else {
          const boardRect = boardContent.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();

          const cropX = Math.round((targetRect.left - boardRect.left) * scale);
          const cropY = Math.round((targetRect.top - boardRect.top) * scale);
          const cropW = Math.round(targetRect.width * scale);
          const cropH = Math.round(targetRect.height * scale);

          const croppedCanvas = document.createElement("canvas");
          croppedCanvas.width = cropW;
          croppedCanvas.height = cropH;
          const ctx = croppedCanvas.getContext("2d");
          ctx?.drawImage(
            fullCanvas,
            cropX,
            cropY,
            cropW,
            cropH,
            0,
            0,
            cropW,
            cropH,
          );
          resultCanvas = croppedCanvas;
        }

        let zoneLabel: string | undefined;
        if (target !== boardContent && target !== wrapper) {
          const heading = target.querySelector<HTMLElement>(
            'h1,h2,h3,h4,[class*="title"],text',
          );
          const headingText = heading?.textContent?.trim();
          if (headingText && headingText.length < 60) {
            zoneLabel = headingText;
          } else {
            const areaClass = Array.from(target.classList).find(
              (c) => c !== "dv-container" && c !== "zone-target",
            );
            if (areaClass) zoneLabel = areaClass.replace(/-dist$/, "");
          }
        }

        onZoneCapture(resultCanvas, zoneLabel);
      } catch (err) {
        console.error("Erreur lors de la capture de zone", err);
      } finally {
        setIsCapturing(false);
      }
    },
    [
      isZoneSelectMode,
      isCapturing,
      onZoneCapture,
      findTarget,
      measureVisualHeight,
    ],
  );

  return (
    <div className="relative h-full w-full" ref={wrapperRef}>
      <div className="board-content h-full">{children}</div>

      {isZoneSelectMode && (
        <>
          <div
            ref={overlayRef}
            className="absolute inset-0 z-10 cursor-crosshair"
            style={
              overlayHeight !== undefined
                ? { height: overlayHeight }
                : undefined
            }
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
              void handleClick(e);
            }}
          />

          {highlight && !isCapturing && (
            <div
              className="pointer-events-none absolute rounded border-2 border-blue bg-blue/10"
              style={{
                top: highlight.top,
                left: highlight.left,
                width: highlight.width,
                height: highlight.height,
              }}
            />
          )}

          {isCapturing && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 text-white">
              <span>Capture en cours…</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BoardViewer;
