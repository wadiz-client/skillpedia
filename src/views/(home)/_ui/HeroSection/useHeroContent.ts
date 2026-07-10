'use client';

import { useEffect, useRef, useState } from 'react';

import type { HeroVariant } from './NetworkCanvas';

const HERO_VARIANTS: HeroVariant[] = ['float', 'parallax', 'orbit'];
const ENTRANCE_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
const HEADING_ORDER = '2';

// orbit 변형의 글자 단위 등장을 위해 줄 텍스트를 글자 span으로 분해합니다.
const createCharacterSpans = (lines: HTMLElement[]): HTMLElement[] => {
  return lines.flatMap((line) => {
    const text = line.textContent ?? '';
    line.textContent = '';

    return [...text].map((character) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.whiteSpace = 'pre';
      span.textContent = character;
      line.appendChild(span);

      return span;
    });
  });
};

export const useHeroContent = <T extends HTMLElement = HTMLElement>() => {
  const rootRef = useRef<T>(null);
  const [variant, setVariant] = useState<HeroVariant | null>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (root === null) {
      return;
    }

    const selectedVariant = HERO_VARIANTS[Math.floor(Math.random() * HERO_VARIANTS.length)];
    setVariant(selectedVariant);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    const heroItems = [...root.querySelectorAll<HTMLElement>('[data-hero]')].sort((a, b) => {
      return Number(a.dataset.hero) - Number(b.dataset.hero);
    });
    const lines = [...root.querySelectorAll<HTMLElement>('[data-hero-line]')];
    const animations: Animation[] = [];

    const animate = (element: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      animations.push(element.animate(keyframes, options));
    };

    const riseKeyframes: Keyframe[] = [
      { opacity: 0, transform: 'translateY(24px)' },
      { opacity: 1, transform: 'none' },
    ];

    if (selectedVariant === 'float') {
      heroItems.forEach((element, index) => {
        animate(element, riseKeyframes, { duration: 1400, delay: 180 + index * 240, easing: ENTRANCE_EASING, fill: 'backwards' });
      });
    }

    if (selectedVariant === 'parallax') {
      heroItems.forEach((element, index) => {
        if (element.dataset.hero === HEADING_ORDER) {
          return;
        }

        animate(element, riseKeyframes, { duration: 1400, delay: 250 + index * 220, easing: ENTRANCE_EASING, fill: 'backwards' });
      });
      lines.forEach((line, index) => {
        animate(
          line,
          [{ transform: 'translateY(115%)' }, { transform: 'none' }],
          { duration: 1500, delay: 360 + index * 300, easing: ENTRANCE_EASING, fill: 'backwards' },
        );
      });
    }

    if (selectedVariant === 'orbit') {
      heroItems.forEach((element, index) => {
        if (element.dataset.hero === HEADING_ORDER) {
          return;
        }

        animate(element, riseKeyframes, { duration: 1300, delay: 700 + index * 200, easing: ENTRANCE_EASING, fill: 'backwards' });
      });
      createCharacterSpans(lines).forEach((characterSpan, index) => {
        animate(
          characterSpan,
          [{ opacity: 0, transform: 'translateY(28px) rotate(6deg)' }, { opacity: 1, transform: 'none' }],
          { duration: 1040, delay: 200 + index * 64, easing: ENTRANCE_EASING, fill: 'backwards' },
        );
      });
    }

    return () => {
      animations.forEach((animation) => {
        animation.cancel();
      });
    };
  }, []);

  return { rootRef, variant };
};
