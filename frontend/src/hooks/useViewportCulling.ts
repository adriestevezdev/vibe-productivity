import { useEffect, useRef, useState, useCallback } from 'react';

interface UseViewportCullingOptions {
  rootMargin?: string;
  threshold?: number | number[];
  enabled?: boolean;
}

export function useViewportCulling<T extends HTMLElement>(
  options: UseViewportCullingOptions = {}
) {
  const {
    rootMargin = '50px',
    threshold = 0,
    enabled = true
  } = options;

  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<string, T>>(new Map());

  const registerElement = useCallback((id: string, element: T | null) => {
    if (!enabled) return;

    if (element) {
      elementsRef.current.set(id, element);
      observerRef.current?.observe(element);
    } else {
      const existingElement = elementsRef.current.get(id);
      if (existingElement) {
        observerRef.current?.unobserve(existingElement);
        elementsRef.current.delete(id);
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setVisibleElements(new Set());
      return;
    }

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      setVisibleElements(prev => {
        const next = new Set(prev);
        
        entries.forEach(entry => {
          const id = entry.target.getAttribute('data-voxel-id');
          if (!id) return;

          if (entry.isIntersecting) {
            next.add(id);
          } else {
            next.delete(id);
          }
        });

        return next;
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold
    });

    // Observe all existing elements
    elementsRef.current.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [rootMargin, threshold, enabled]);

  const isVisible = useCallback((id: string) => {
    return !enabled || visibleElements.has(id);
  }, [enabled, visibleElements]);

  return {
    registerElement,
    isVisible,
    visibleElements: enabled ? visibleElements : null
  };
}