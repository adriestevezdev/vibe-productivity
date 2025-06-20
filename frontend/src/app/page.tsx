'use client';

import { VoxelGrid } from '@/components/voxel/VoxelGrid';
import { useAppStore } from '@/store/useAppStore';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

// Demo voxel data
const demoVoxels = [
  { id: '1', x: 0, y: 0, z: 0, priority: 'high' as const, color: '#ef4444' },
  { id: '2', x: 1, y: 0, z: 0, priority: 'medium' as const, color: '#f59e0b' },
  { id: '3', x: 2, y: 0, z: 0, priority: 'low' as const, color: '#10b981' },
  { id: '4', x: 0, y: 1, z: 0, priority: 'high' as const, color: '#ef4444' },
  { id: '5', x: 1, y: 1, z: 1, priority: 'medium' as const, color: '#f59e0b' },
  { id: '6', x: 2, y: 1, z: 0, priority: 'low' as const, color: '#10b981' },
];

export default function HomePage() {
  const { viewMode, tasks } = useAppStore();

  return (
    <div className="p-6">
      <SignedOut>
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Welcome to Vibe Productivity
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Build your productivity world, one block at a time
          </p>
          <SignInButton mode="modal">
            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
              Get Started
            </button>
          </SignInButton>
          
          {/* Demo voxel grid */}
          <div className="mt-12 h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <VoxelGrid
              voxels={demoVoxels}
              gridSize={{ width: 5, height: 5, depth: 3 }}
              className="h-full"
            />
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Your Productivity Space
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View mode: {viewMode}
            </p>
          </div>

          {viewMode === '3d' ? (
            <div className="h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <VoxelGrid
                voxels={tasks.map((task, index) => ({
                  id: task.id,
                  x: task.position.x,
                  y: task.position.y,
                  z: task.position.z,
                  color: task.color,
                  priority: task.priority,
                  metadata: task,
                }))}
                gridSize={{ width: 10, height: 10, depth: 5 }}
                className="h-full"
              />
            </div>
          ) : viewMode === 'list' ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Task List</h2>
                {tasks.length === 0 ? (
                  <p className="text-gray-500">No tasks yet. Create your first task!</p>
                ) : (
                  <ul className="space-y-2">
                    {tasks.map((task) => (
                      <li
                        key={task.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Kanban Board</h2>
              <p className="text-gray-500">Kanban view coming soon...</p>
            </div>
          )}
        </div>
      </SignedIn>
    </div>
  );
}