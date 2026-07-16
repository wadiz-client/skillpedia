'use client';

import { useEffect, useRef } from 'react';

import { useColorMode } from '@/shared/theme';

import styles from './SpotlightCanvas.module.scss';

interface SpotlightDot {
  velocityX: number;
  velocityY: number;
  x: number;
  y: number;
}

const INK_RGB_LIGHT = '31, 35, 40'; // #1f2328
const INK_RGB_DARK = '240, 246, 252'; // #f0f6fc
// 심벌마크 비율: 점 지름(6px)이 선 굵기(3px)의 2배입니다.
const LINE_WIDTH = 3;
const DOT_RADIUS = LINE_WIDTH;
const DOT_COUNT = 34;
const DRIFT_SPEED = 0.012;
const LINK_THRESHOLD_RATIO = 0.22;
const SPOTLIGHT_RADIUS_SCALE = 1.6;

const generateRandomValue = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
};

const createDots = (): SpotlightDot[] => {
  return Array.from({ length: DOT_COUNT }, (): SpotlightDot => {
    return {
      velocityX: generateRandomValue(-1, 1),
      velocityY: generateRandomValue(-1, 1),
      x: Math.random(),
      y: Math.random(),
    };
  });
};

export const SpotlightCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    const container = canvas.parentElement;
    const context = canvas.getContext('2d');

    if (container === null || context === null) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const inkRgb = colorMode === 'dark' ? INK_RGB_DARK : INK_RGB_LIGHT;
    const dots = createDots();
    const mouse = { isInside: false, x: 0, y: 0 };
    let width = 0;
    let height = 0;
    let lastTime = performance.now();
    let animationFrameId = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      if (rect.width === 0) {
        return;
      }

      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(rect.width * devicePixelRatio);
      canvas.height = Math.round(rect.height * devicePixelRatio);
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const updateDots = (deltaTime: number) => {
      const aspectRatio = width / height;

      dots.forEach((dot) => {
        dot.x += dot.velocityX * DRIFT_SPEED * deltaTime;
        dot.y += dot.velocityY * DRIFT_SPEED * deltaTime * aspectRatio;

        if (dot.x < 0.02) {
          dot.x = 0.02;
          dot.velocityX = Math.abs(dot.velocityX);
        }

        if (dot.x > 0.98) {
          dot.x = 0.98;
          dot.velocityX = -Math.abs(dot.velocityX);
        }

        if (dot.y < 0.02) {
          dot.y = 0.02;
          dot.velocityY = Math.abs(dot.velocityY);
        }

        if (dot.y > 0.98) {
          dot.y = 0.98;
          dot.velocityY = -Math.abs(dot.velocityY);
        }
      });
    };

    const drawSpotlight = () => {
      context.clearRect(0, 0, width, height);

      const threshold = Math.min(width, height) * LINK_THRESHOLD_RATIO;
      const spotlightRadius = threshold * SPOTLIGHT_RADIUS_SCALE;
      const points = dots.map((dot) => {
        return { x: dot.x * width, y: dot.y * height };
      });

      context.lineCap = 'round';
      context.lineWidth = LINE_WIDTH;

      // 근접한 점 사이에 거리 비례 투명도의 연결선을 그립니다.
      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const distance = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);

          if (distance < threshold) {
            context.strokeStyle = `rgba(${inkRgb}, ${(1 - distance / threshold) * 0.3})`;
            context.beginPath();
            context.moveTo(points[i].x, points[i].y);
            context.lineTo(points[j].x, points[j].y);
            context.stroke();
          }
        }
      }

      // 커서와 근접한 점 사이에 연결선을 그립니다.
      if (mouse.isInside) {
        points.forEach((point) => {
          const distance = Math.hypot(point.x - mouse.x, point.y - mouse.y);

          if (distance < spotlightRadius) {
            context.strokeStyle = `rgba(${inkRgb}, ${(1 - distance / spotlightRadius) * 0.55})`;
            context.beginPath();
            context.moveTo(mouse.x, mouse.y);
            context.lineTo(point.x, point.y);
            context.stroke();
          }
        });
      }

      // 커서 근처 점은 밝게, 그 밖의 점은 옅게 그립니다.
      points.forEach((point) => {
        let alpha = 0.6;

        if (mouse.isInside) {
          const distance = Math.hypot(point.x - mouse.x, point.y - mouse.y);
          alpha = distance < spotlightRadius ? 0.6 + 0.4 * (1 - distance / spotlightRadius) : 0.45;
        }

        context.fillStyle = `rgba(${inkRgb}, ${alpha})`;
        context.beginPath();
        context.arc(point.x, point.y, DOT_RADIUS, 0, Math.PI * 2);
        context.fill();
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      mouse.isInside = true;
    };

    const handleMouseLeave = () => {
      mouse.isInside = false;
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    if (prefersReducedMotion) {
      drawSpotlight();

      return () => {
        resizeObserver.disconnect();
      };
    }

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const tick = (time: number) => {
      const deltaTime = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      updateDots(deltaTime);
      drawSpotlight();
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [colorMode]);

  return (
    <canvas
      aria-hidden
      className={styles.container}
      ref={canvasRef}
    />
  );
};
