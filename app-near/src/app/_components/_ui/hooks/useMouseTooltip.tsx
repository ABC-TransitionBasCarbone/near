import { useCallback, useRef, useState } from "react";

export interface MouseTooltipState {
  x: number;
  y: number;
  text: string;
}

export const useMouseTooltip = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<MouseTooltipState | null>(null);

  const showTooltip = useCallback((event: MouseEvent, text: string) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const x = rect ? event.clientX - rect.left : event.offsetX;
    const y = rect ? event.clientY - rect.top : event.offsetY;
    setTooltip({ x, y, text });
  }, []);

  const hideTooltip = useCallback(() => setTooltip(null), []);

  return { containerRef, tooltip, showTooltip, hideTooltip };
};
