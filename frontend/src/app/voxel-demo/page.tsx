'use client';

import React, { useState } from 'react';
import { VoxelGrid } from '@/components/voxel/VoxelGrid';

const generateDemoVoxels = () => {
  const voxels = [];
  const themes = ['ocean', 'forest', 'sunset', 'lavender', 'rose', 'slate'] as const;
  const materials = ['default', 'glass', 'metal', 'neon'] as const;
  
  // Create a spiral pattern
  let id = 0;
  for (let i = 0; i < 20; i++) {
    const angle = i * 0.5;
    const radius = i * 0.3;
    const x = Math.floor(radius * Math.cos(angle) + 5);
    const y = Math.floor(radius * Math.sin(angle) + 5);
    const z = Math.floor(i / 4);
    
    voxels.push({
      id: `voxel-${id++}`,
      x,
      y,
      z,
      theme: themes[i % themes.length],
      material: materials[Math.floor(i / 5) % materials.length],
      metadata: { index: i }
    });
  }
  
  // Add some deterministic scattered voxels with priorities
  const positions = [
    [2, 3], [7, 1], [4, 8], [9, 2], [1, 6],
    [8, 4], [3, 9], [6, 5], [0, 7], [5, 0],
    [9, 9], [2, 2], [7, 7], [4, 4], [6, 6]
  ];
  
  for (let i = 0; i < 15; i++) {
    voxels.push({
      id: `priority-${id++}`,
      x: positions[i][0],
      y: positions[i][1],
      z: 0,
      priority: (['low', 'medium', 'high'] as const)[i % 3],
      metadata: { type: 'priority' }
    });
  }
  
  return voxels;
};

export default function VoxelDemoPage() {
  const [voxels] = useState(generateDemoVoxels());
  const [selectedVoxelIds, setSelectedVoxelIds] = useState<Set<string>>(new Set());
  const [clickedVoxel, setClickedVoxel] = useState<any>(null);
  
  const handleVoxelClick = (voxel: any) => {
    setClickedVoxel(voxel);
  };
  
  const handleSelectionChange = (newSelection: Set<string>) => {
    setSelectedVoxelIds(newSelection);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Voxel System Demo</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Interactive 3D voxel visualization with CSS transforms
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4" style={{ height: '600px' }}>
              <VoxelGrid
                voxels={voxels}
                onVoxelClick={handleVoxelClick}
                selectedVoxelIds={selectedVoxelIds}
                onSelectionChange={handleSelectionChange}
                gridSize={{ width: 15, height: 15, depth: 10 }}
                enableMultiSelect={true}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-3">Controls</h2>
              <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Click and drag to rotate</li>
                <li>• Hold Shift + drag to pan</li>
                <li>• Scroll to zoom in/out</li>
                <li>• Click voxels to select</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-3">Selection</h2>
              <div className="text-sm space-y-2">
                <p><span className="font-medium">Selected:</span> {selectedVoxelIds.size} voxels</p>
                {clickedVoxel && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="font-medium mb-1">Last clicked:</p>
                    <p>ID: {clickedVoxel.id}</p>
                    <p>Position: ({clickedVoxel.x}, {clickedVoxel.y}, {clickedVoxel.z})</p>
                    {clickedVoxel.theme && <p>Theme: {clickedVoxel.theme}</p>}
                    {clickedVoxel.material && <p>Material: {clickedVoxel.material}</p>}
                    {clickedVoxel.priority && <p>Priority: {clickedVoxel.priority}</p>}
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-3">Features</h2>
              <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                <li>✓ Isometric 3D view</li>
                <li>✓ Multiple themes & materials</li>
                <li>✓ Smooth animations</li>
                <li>✓ Interactive controls</li>
                <li>✓ Priority-based colors</li>
                <li>✓ Visual effects</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}