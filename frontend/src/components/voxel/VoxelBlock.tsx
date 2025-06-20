'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface VoxelBlockProps {
  id: string;
  x: number;
  y: number;
  z: number;
  color?: string;
  priority?: 'low' | 'medium' | 'high';
  theme?: 'ocean' | 'forest' | 'sunset' | 'lavender' | 'rose' | 'slate';
  material?: 'default' | 'glass' | 'metal' | 'neon';
  isSelected?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  size?: number;
  animateIn?: boolean;
  onVisibilityChange?: (id: string, element: HTMLDivElement | null) => void;
  isVisible?: boolean;
  isDraggable?: boolean;
  onDragStart?: (e: React.MouseEvent, voxel: any) => void;
  isDragging?: boolean;
}

export const VoxelBlock: React.FC<VoxelBlockProps> = ({
  id,
  x,
  y,
  z,
  color,
  priority = 'medium',
  theme,
  material = 'default',
  isSelected = false,
  isCompleted = false,
  onClick,
  onMouseDown: onMouseDownProp,
  size = 40,
  animateIn = false,
  onVisibilityChange,
  isVisible = true,
  isDraggable = false,
  onDragStart,
  isDragging = false,
}) => {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(id, blockRef.current);
    }
    return () => {
      if (onVisibilityChange) {
        onVisibilityChange(id, null);
      }
    };
  }, [id, onVisibilityChange]);
  const style: React.CSSProperties = {
    '--block-x': String(x),
    '--block-y': String(y),
    '--block-z': String(z),
    '--voxel-size': `${size}px`,
    '--voxel-color': color || undefined,
    display: isVisible ? 'block' : 'none',
    opacity: String(isDragging ? 0.5 : 1),
    cursor: isDraggable ? 'move' : onClick ? 'pointer' : 'default',
  } as React.CSSProperties;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onMouseDownProp) {
      onMouseDownProp(e);
    }
    if (isDraggable && onDragStart) {
      e.stopPropagation();
      onDragStart(e, { id, x, y, z });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <div
      ref={blockRef}
      className={cn(
        'voxel-block',
        !color && !theme && `voxel-priority-${priority}`,
        theme && `voxel-theme-${theme}`,
        material !== 'default' && `voxel-material-${material}`,
        {
          'selected': isSelected,
          'completed': isCompleted,
          'animate-in': animateIn,
          'interactive': onClick || isDraggable,
          'dragging': isDragging,
        }
      )}
      style={style}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      data-x={String(x)}
      data-y={String(y)}
      data-z={String(z)}
      data-voxel-id={id}
    >
      <div className="voxel-face voxel-face-top" />
      <div className="voxel-face voxel-face-front" />
      <div className="voxel-face voxel-face-right" />
      <div className="voxel-face voxel-face-left" />
      <div className="voxel-face voxel-face-back" />
      <div className="voxel-face voxel-face-bottom" />
    </div>
  );
};