"use client";

import { useEffect, useState } from "react";

// Tracks the width/height of a container div via ResizeObserver, replacing the
// window-resize-listener + manual re-measure pattern duplicated across every Dv* chart.
export const useChartDimensions = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setWidth(entry.contentRect.width);
        setHeight(entry.contentRect.height);
      }
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [container]);

  return { containerRef: setContainer, container, width, height };
};
