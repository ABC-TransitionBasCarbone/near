"use client";

import { useEffect, useState } from "react";

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
