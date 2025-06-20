import { useState, useCallback, useRef } from 'react';

interface DragState {
  isDragging: boolean;
  draggedItem: any | null;
  dragOffset: { x: number; y: number };
  currentPosition: { x: number; y: number };
}

interface UseDragAndDropOptions {
  onDragStart?: (item: any) => void;
  onDragEnd?: (item: any, position: { x: number; y: number }) => void;
  onDragOver?: (position: { x: number; y: number }) => void;
  snapToGrid?: boolean;
  gridSize?: number;
}

export function useDragAndDrop(options: UseDragAndDropOptions = {}) {
  const {
    onDragStart,
    onDragEnd,
    onDragOver,
    snapToGrid = true,
    gridSize = 40
  } = options;

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dragOffset: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 }
  });

  const dragPreviewRef = useRef<HTMLDivElement | null>(null);

  const snapPosition = useCallback((x: number, y: number) => {
    if (!snapToGrid) return { x, y };
    
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }, [snapToGrid, gridSize]);

  const handleDragStart = useCallback((e: React.MouseEvent, item: any) => {
    e.preventDefault();
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    setDragState({
      isDragging: true,
      draggedItem: item,
      dragOffset: offset,
      currentPosition: { x: e.clientX - offset.x, y: e.clientY - offset.y }
    });

    onDragStart?.(item);
  }, [onDragStart]);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging) return;

    const newPosition = {
      x: e.clientX - dragState.dragOffset.x,
      y: e.clientY - dragState.dragOffset.y
    };

    const snappedPosition = snapPosition(newPosition.x, newPosition.y);

    setDragState(prev => ({
      ...prev,
      currentPosition: snappedPosition
    }));

    onDragOver?.(snappedPosition);
  }, [dragState.isDragging, dragState.dragOffset, snapPosition, onDragOver]);

  const handleDragEnd = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging) return;

    const finalPosition = snapPosition(
      e.clientX - dragState.dragOffset.x,
      e.clientY - dragState.dragOffset.y
    );

    onDragEnd?.(dragState.draggedItem, finalPosition);

    setDragState({
      isDragging: false,
      draggedItem: null,
      dragOffset: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 }
    });
  }, [dragState, snapPosition, onDragEnd]);

  return {
    dragState,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    dragPreviewRef
  };
}