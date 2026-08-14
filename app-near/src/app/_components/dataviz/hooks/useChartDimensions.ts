"use client";

import { useEffect, useRef, useState } from "react";

// Tracks the width/height of a container div via ResizeObserver, replacing the
// window-resize-listener + manual re-measure pattern duplicated across every Dv* chart.
export const useChartDimensions = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setWidth(entry.contentRect.width);
        setHeight(entry.contentRect.height);
      }
    });
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return { containerRef, width, height };
};
