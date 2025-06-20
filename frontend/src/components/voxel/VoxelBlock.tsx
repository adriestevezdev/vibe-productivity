'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface VoxelBlockProps {
  x: number;
  y: number;
  z: number;
  color?: string;
  priority?: 'low' | 'medium' | 'high';
  isSelected?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
  size?: number;
  animateIn?: boolean;
}

export const VoxelBlock: React.FC<VoxelBlockProps> = ({
  x,
  y,
  z,
  color,
  priority = 'medium',
  isSelected = false,
  isCompleted = false,
  onClick,
  size = 40,
  animateIn = false,
}) => {
  const style: React.CSSProperties = {
    left: `${x * (size + 2)}px`,
    top: `${y * (size + 2)}px`,
    transform: `translateZ(${z * size}px)`,
    '--voxel-size': `${size}px`,
    '--voxel-color': color || undefined,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        'voxel-block',
        `voxel-priority-${priority}`,
        {
          'selected': isSelected,
          'completed': isCompleted,
          'animate-in': animateIn,
          'cursor-pointer hover:scale-105': onClick,
        }
      )}
      style={style}
      onClick={onClick}
    >
      <div className="voxel-face voxel-face-top" />
      <div className="voxel-face voxel-face-front" />
      <div className="voxel-face voxel-face-right" />
    </div>
  );
};