/**
 * Image Optimization Utilities
 * Provides WebP conversion and image optimization
 */

import React from 'react';
/**
 * Convert image to WebP format if supported
 */
export function getOptimizedImageUrl(
  originalUrl: string,
  format: 'webp' | 'original' = 'webp'
): string {
  // Check if browser supports WebP
  if (format === 'webp' && supportsWebP()) {
    // If URL already has extension, replace it
    if (originalUrl.match(/\.(jpg|jpeg|png)$/i)) {
      return originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    // Otherwise append .webp
    return `${originalUrl}.webp`;
  }
  
  return originalUrl;
}

/**
 * Check if browser supports WebP
 */
function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1920]
): string {
  return widths
    .map((width) => `${baseUrl}?w=${width} ${width}w`)
    .join(', ');
}

/**
 * Lazy load image with intersection observer
 */
export function useLazyImage(src: string): {
  imgSrc: string;
  isLoaded: boolean;
  ref: (node: HTMLImageElement | null) => void;
} {
  const [imgSrc, setImgSrc] = React.useState<string>('');
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
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

