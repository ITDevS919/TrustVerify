/**
 * Lazy Image Loading Hook
 * Uses Intersection Observer to load images when they enter viewport
 */

import { useState, useEffect, useRef } from 'react';

export function useLazyImage(src: string): {
  imgSrc: string;
  isLoaded: boolean;
  ref: (node: HTMLImageElement | null) => void;
} {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImgSrc(src);
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  return {
    imgSrc,
    isLoaded,
    ref: (node: HTMLImageElement | null) => {
      imgRef.current = node;
    },
  };
}

