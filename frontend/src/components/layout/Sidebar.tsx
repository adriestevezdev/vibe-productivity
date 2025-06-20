'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import {
  Home,
  CheckSquare,
  Timer,
  Trophy,
  Settings,
  Menu,
  X,
  Plus,
  LayoutGrid,
  List,
  Columns,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/pomodoro', label: 'Pomodoro', icon: Timer },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, viewMode, setViewMode, tasks } = useAppStore();

  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 z-40',
          'w-64 p-6',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Vibe Productivity
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Build your productivity world
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <button className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
              <Plus size={20} />
              <span>New Task</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      )}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                      {item.label === 'Tasks' && pendingTasksCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {pendingTasksCount}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* View Mode Switcher */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">View Mode</p>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('3d')}
                className={cn(
                  'flex-1 p-2 rounded-lg transition-colors',
                  viewMode === '3d'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}
                title="3D View"
              >
                <LayoutGrid size={20} className="mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex-1 p-2 rounded-lg transition-colors',
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}
                title="List View"
              >
                <List size={20} className="mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={cn(
                  'flex-1 p-2 rounded-lg transition-colors',
                  viewMode === 'kanban'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}
                title="Kanban View"
              >
                <Columns size={20} className="mx-auto" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};