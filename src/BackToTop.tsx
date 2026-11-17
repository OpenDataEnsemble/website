'use client';

import { useEffect, useState } from 'react';
import { Icon } from './Icons';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const duration = 800;
    const start = window.scrollY;
    const startTime = performance.now();

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      window.scrollTo(0, start - start * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <button
      className={`back-to-top ${isVisible ? 'is-visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <Icon name="arrow" size="var(--icon-size-site-18)" />
    </button>
  );
}
