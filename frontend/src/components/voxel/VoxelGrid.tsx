'use client';

import React, { useState, useRef, useEffect } from 'react';
import { VoxelBlock } from './VoxelBlock';
import { cn } from '@/lib/utils';
import { useViewportCulling } from '@/hooks/useViewportCulling';
import { useMultiSelection } from '@/hooks/useMultiSelection';

interface VoxelData {
  id: string;
  x: number;
  y: number;
  z: number;
  color?: string;
  priority?: 'low' | 'medium' | 'high';
  theme?: 'ocean' | 'forest' | 'sunset' | 'lavender' | 'rose' | 'slate';
  material?: 'default' | 'glass' | 'metal' | 'neon';
  metadata?: any;
}

interface VoxelGridProps {
  voxels: VoxelData[];
  gridSize?: { width: number; height: number; depth: number };
  onVoxelClick?: (voxel: VoxelData) => void;
  selectedVoxelIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  className?: string;
  enableViewportCulling?: boolean;
  enableMultiSelect?: boolean;
}

export const VoxelGrid: React.FC<VoxelGridProps> = ({
  voxels,
  gridSize = { width: 10, height: 10, depth: 5 },
  onVoxelClick,
  selectedVoxelIds: externalSelectedIds,
  onSelectionChange,
  className,
  enableViewportCulling = true,
  enableMultiSelect = true,
}) => {
  const [cameraRotation, setCameraRotation] = useState({ x: 35, y: 45 });
  const [cameraPan, setCameraPan] = useState({ x: 0, y: 0 });
  const [cameraZoom, setCameraZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragMode, setDragMode] = useState<'rotate' | 'pan'>('rotate');
  const gridRef = useRef<HTMLDivElement>(null);
  
  const { registerElement, isVisible } = useViewportCulling<HTMLDivElement>({
    rootMargin: '100px',
    threshold: 0,
    enabled: enableViewportCulling
  });

  const {
    selectedIds,
    isSelecting,
    selectionBox,
    toggleSelection,
    clearSelection,
    startMarqueeSelection,
    updateMarqueeSelection,
    endMarqueeSelection
  } = useMultiSelection({
    onSelectionChange,
    enableMarquee: enableMultiSelect
  });

  // Use external selection if provided, otherwise use internal
  const activeSelectedIds = externalSelectedIds || selectedIds;

  // Handle marquee selection mouse events
  useEffect(() => {
    if (!isSelecting) return;

    const handleMarqueeMove = (e: MouseEvent) => {
      const viewport = gridRef.current?.parentElement;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      updateMarqueeSelection(e, rect);
    };

    const handleMarqueeEnd = () => {
      endMarqueeSelection();
    };

    document.addEventListener('mousemove', handleMarqueeMove);
    document.addEventListener('mouseup', handleMarqueeEnd);

    return () => {
      document.removeEventListener('mousemove', handleMarqueeMove);
      document.removeEventListener('mouseup', handleMarqueeEnd);
    };
  }, [isSelecting, updateMarqueeSelection, endMarqueeSelection]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      if (dragMode === 'rotate') {
        setCameraRotation(prev => ({
          x: prev.x + deltaY * 0.5,
          y: prev.y + deltaX * 0.5,
        }));
      } else {
        setCameraPan(prev => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }));
      }

      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      setCameraZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setDragMode('pan');
      }
      if (e.key === 'Escape' && enableMultiSelect) {
        clearSelection();
      }
      if (e.key === 'a' && (e.ctrlKey || e.metaKey) && enableMultiSelect) {
        e.preventDefault();
        const allIds = voxels.map(v => v.id);
        toggleSelection(allIds[0], false);
        allIds.slice(1).forEach(id => toggleSelection(id, true));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setDragMode('rotate');
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    const viewport = gridRef.current?.parentElement;
    if (viewport) {
      viewport.addEventListener('wheel', handleWheel, { passive: false });
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      if (viewport) {
        viewport.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isDragging, dragStart, dragMode, clearSelection, enableMultiSelect, voxels, toggleSelection]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.voxel-control-btn')) return;
    if ((e.target as HTMLElement).closest('.voxel-block')) return;
    
    if (enableMultiSelect && !e.shiftKey) {
      startMarqueeSelection(e);
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleVoxelClick = (voxel: VoxelData) => {
    onVoxelClick?.(voxel);
  };

  const handleVoxelMouseDown = (e: React.MouseEvent, voxel: VoxelData) => {
    e.stopPropagation();
    if (enableMultiSelect) {
      toggleSelection(voxel.id, e.ctrlKey || e.metaKey);
    }
  };

  const handleZoomIn = () => {
    setCameraZoom(prev => Math.min(3, prev + 0.2));
  };

  const handleZoomOut = () => {
    setCameraZoom(prev => Math.max(0.5, prev - 0.2));
  };

  const handleResetView = () => {
    setCameraRotation({ x: 35, y: 45 });
    setCameraPan({ x: 0, y: 0 });
    setCameraZoom(1);
  };

  const cameraStyle: React.CSSProperties = {
    '--camera-pan-x': `${cameraPan.x}px`,
    '--camera-pan-y': `${cameraPan.y}px`,
    '--camera-zoom': cameraZoom,
  } as React.CSSProperties;

  const gridStyle: React.CSSProperties = {
    transform: `rotateX(${cameraRotation.x}deg) rotateY(${cameraRotation.y}deg)`,
  };

  return (
    <div className={cn('voxel-viewport', dragMode === 'pan' ? 'cursor-move' : '', className)}>
      <div
        className="voxel-camera"
        style={cameraStyle}
        ref={gridRef}
      >
        <div 
          className="voxel-grid isometric-transform"
          style={gridStyle}
          onMouseDown={handleMouseDown}
        >
          <div className="voxel-grid-floor" />
          {voxels.map((voxel) => (
            <VoxelBlock
              key={voxel.id}
              id={voxel.id}
              x={voxel.x}
              y={voxel.y}
              z={voxel.z}
              color={voxel.color}
              priority={voxel.priority}
              theme={voxel.theme}
              material={voxel.material}
              isSelected={activeSelectedIds.has(voxel.id)}
              onClick={() => handleVoxelClick(voxel)}
              onMouseDown={(e) => handleVoxelMouseDown(e, voxel)}
              animateIn
              onVisibilityChange={registerElement}
              isVisible={isVisible(voxel.id)}
            />
          ))}
        </div>
      </div>
      
      <div className="voxel-controls">
        <button
          className="voxel-control-btn"
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button
          className="voxel-control-btn"
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button
          className="voxel-control-btn"
          onClick={handleResetView}
          title="Reset View"
          aria-label="Reset View"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10a6 6 0 1 1 10.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 14l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      
      <div className="absolute bottom-5 left-5 text-sm text-gray-500">
        <p>Hold Shift + Drag to pan</p>
        <p>Scroll to zoom</p>
        {enableMultiSelect && (
          <>
            <p>Ctrl/Cmd + Click for multi-select</p>
            <p>Drag to select area</p>
          </>
        )}
      </div>
      
      {isSelecting && selectionBox && (
        <div
          className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.endX),
            top: Math.min(selectionBox.startY, selectionBox.endY),
            width: Math.abs(selectionBox.endX - selectionBox.startX),
            height: Math.abs(selectionBox.endY - selectionBox.startY),
          }}
        />
      )}
    </div>
  );
};