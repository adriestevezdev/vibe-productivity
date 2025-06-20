'use client';

import React, { useState, useRef, useEffect } from 'react';
import { VoxelBlock } from './VoxelBlock';
import { cn } from '@/lib/utils';

interface VoxelData {
  id: string;
  x: number;
  y: number;
  z: number;
  color?: string;
  priority?: 'low' | 'medium' | 'high';
  metadata?: any;
}

interface VoxelGridProps {
  voxels: VoxelData[];
  gridSize?: { width: number; height: number; depth: number };
  onVoxelClick?: (voxel: VoxelData) => void;
  selectedVoxelId?: string;
  className?: string;
}

export const VoxelGrid: React.FC<VoxelGridProps> = ({
  voxels,
  gridSize = { width: 10, height: 10, depth: 5 },
  onVoxelClick,
  selectedVoxelId,
  className,
}) => {
  const [cameraRotation, setCameraRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setCameraRotation({
        x: cameraRotation.x + deltaY * 0.5,
        y: cameraRotation.y + deltaX * 0.5,
      });

      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, cameraRotation]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const cameraStyle: React.CSSProperties = {
    transform: `rotateX(${cameraRotation.x}deg) rotateY(${cameraRotation.y}deg)`,
  };

  return (
    <div className={cn('voxel-viewport', className)}>
      <div
        className="voxel-camera"
        style={cameraStyle}
        onMouseDown={handleMouseDown}
        ref={gridRef}
      >
        <div className="voxel-grid">
          {voxels.map((voxel) => (
            <VoxelBlock
              key={voxel.id}
              x={voxel.x}
              y={voxel.y}
              z={voxel.z}
              color={voxel.color}
              priority={voxel.priority}
              isSelected={selectedVoxelId === voxel.id}
              onClick={() => onVoxelClick?.(voxel)}
              animateIn
            />
          ))}
        </div>
      </div>
    </div>
  );
};