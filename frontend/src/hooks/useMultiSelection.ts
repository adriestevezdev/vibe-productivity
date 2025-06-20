import { useState, useCallback, useRef } from 'react';

interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface UseMultiSelectionOptions {
  onSelectionChange?: (selectedIds: Set<string>) => void;
  enableMarquee?: boolean;
}

export function useMultiSelection(options: UseMultiSelectionOptions = {}) {
  const {
    onSelectionChange,
    enableMarquee = true
  } = options;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  const toggleSelection = useCallback((id: string, multiSelect = false) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      
      if (!multiSelect) {
        // Single selection - clear others
        next.clear();
        next.add(id);
      } else {
        // Multi-select toggle
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }
      
      onSelectionChange?.(next);
      return next;
    });
  }, [onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    onSelectionChange?.(new Set());
  }, [onSelectionChange]);

  const selectAll = useCallback((ids: string[]) => {
    const next = new Set(ids);
    setSelectedIds(next);
    onSelectionChange?.(next);
  }, [onSelectionChange]);

  const selectRange = useCallback((startId: string, endId: string, allIds: string[]) => {
    const startIndex = allIds.indexOf(startId);
    const endIndex = allIds.indexOf(endId);
    
    if (startIndex === -1 || endIndex === -1) return;
    
    const [min, max] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];
    const rangeIds = allIds.slice(min, max + 1);
    
    const next = new Set(rangeIds);
    setSelectedIds(next);
    onSelectionChange?.(next);
  }, [onSelectionChange]);

  const startMarqueeSelection = useCallback((e: React.MouseEvent) => {
    if (!enableMarquee) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    setIsSelecting(true);
    setSelectionBox({
      startX,
      startY,
      endX: startX,
      endY: startY
    });
  }, [enableMarquee]);

  const updateMarqueeSelection = useCallback((e: MouseEvent, containerRect: DOMRect) => {
    if (!isSelecting || !selectionBox) return;
    
    const endX = e.clientX - containerRect.left;
    const endY = e.clientY - containerRect.top;
    
    setSelectionBox({
      ...selectionBox,
      endX,
      endY
    });
  }, [isSelecting, selectionBox]);

  const endMarqueeSelection = useCallback(() => {
    setIsSelecting(false);
    setSelectionBox(null);
  }, []);

  const isInSelectionBox = useCallback((
    elementBounds: { x: number; y: number; width: number; height: number },
    box: SelectionBox
  ) => {
    const boxLeft = Math.min(box.startX, box.endX);
    const boxRight = Math.max(box.startX, box.endX);
    const boxTop = Math.min(box.startY, box.endY);
    const boxBottom = Math.max(box.startY, box.endY);

    const elementRight = elementBounds.x + elementBounds.width;
    const elementBottom = elementBounds.y + elementBounds.height;

    return !(
      elementBounds.x > boxRight ||
      elementRight < boxLeft ||
      elementBounds.y > boxBottom ||
      elementBottom < boxTop
    );
  }, []);

  return {
    selectedIds,
    isSelecting,
    selectionBox,
    toggleSelection,
    clearSelection,
    selectAll,
    selectRange,
    startMarqueeSelection,
    updateMarqueeSelection,
    endMarqueeSelection,
    isInSelectionBox,
    marqueeRef
  };
}