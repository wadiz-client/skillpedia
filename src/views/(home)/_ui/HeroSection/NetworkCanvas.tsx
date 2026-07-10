'use client';

import { useEffect, useRef } from 'react';

import { useColorMode } from '@/shared/theme';

import styles from './NetworkCanvas.module.scss';

export type HeroVariant = 'float' | 'parallax' | 'orbit';

interface NetworkCanvasProps {
  variant: HeroVariant;
}

interface NetworkNode {
  angle: number;
  barLength: number;
  delay: number;
  isAccent: boolean;
  kind: 'bar' | 'dot';
  spin: number;
  velocityX: number;
  velocityY: number;
  x: number;
  y: number;
}

const INK_RGB_LIGHT = '31, 35, 40'; // #1f2328
const INK_RGB_DARK = '240, 246, 252'; // #f0f6fc
const LINE_WIDTH = 4;
const DOT_RADIUS = LINE_WIDTH;
const BAR_LENGTHS = [0.13, 0.1, 0.11, 0.09, 0.12, 0.1, 0.11, 0.09];
const ACCENT_DOT_COUNT = 6;
const NETWORK_DOT_COUNT = 44;
const DRIFT_SPEED = 0.018;
const ORBIT_SPEED = 0.06;
const ENTRANCE_SPREAD_SECONDS = 3;
const ENTRANCE_NODE_SECONDS = 1.1;

const generateRandomValue = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
};

const easeOutCubic = (value: number): number => {
  return 1 - (1 - value) ** 3;
};

const createNodes = (): NetworkNode[] => {
  const bars = BAR_LENGTHS.map((barLength): NetworkNode => {
    return {
      // 심벌마크처럼 막대 각도를 0도·90도 부근으로 유지합니다.
      angle: (Math.random() < 0.5 ? 0 : Math.PI / 2) + generateRandomValue(-0.35, 0.35),
      barLength,
      delay: 0,
      isAccent: false,
      kind: 'bar',
      spin: generateRandomValue(-0.12, 0.12),
      velocityX: generateRandomValue(-1, 1),
      velocityY: generateRandomValue(-1, 1),
      x: generateRandomValue(0.14, 0.86),
      y: generateRandomValue(0.14, 0.86),
    };
  });
  const dots = Array.from({ length: ACCENT_DOT_COUNT + NETWORK_DOT_COUNT }, (unused, index): NetworkNode => {
    return {
      angle: 0,
      barLength: 0,
      delay: 0,
      isAccent: index < ACCENT_DOT_COUNT,
      kind: 'dot',
      spin: 0,
      velocityX: generateRandomValue(-1, 1),
      velocityY: generateRandomValue(-1, 1),
      x: generateRandomValue(0.06, 0.94),
      y: generateRandomValue(0.06, 0.94),
    };
  });
  const nodes = [...bars, ...dots];

  // 왼쪽에서 오른쪽으로 순차 등장하도록 x 좌표 비례 지연을 부여합니다.
  nodes.forEach((node) => {
    node.delay = node.x * ENTRANCE_SPREAD_SECONDS + generateRandomValue(-0.05, 0.05);
  });

  return nodes;
};

export const NetworkCanvas = ({ variant }: NetworkCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    const context = canvas.getContext('2d');

    if (context === null) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const inkRgb = colorMode === 'dark' ? INK_RGB_DARK : INK_RGB_LIGHT;
    const nodes = createNodes();
    const mouse = { isInside: false, x: 0, y: 0 };
    let width = 0;
    let height = 0;
    let orbitAngle = 0;
    let entranceTime = prefersReducedMotion ? ENTRANCE_SPREAD_SECONDS + ENTRANCE_NODE_SECONDS : 0;
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

    // orbit 변형의 중심 회전을 반영해 정규화 좌표를 픽셀 좌표로 변환합니다.
    const convertNodeToPoint = (node: NetworkNode) => {
      let normalizedX = node.x - 0.5;
      let normalizedY = node.y - 0.5;

      if (variant === 'orbit' && orbitAngle) {
        const rotatedX = normalizedX * Math.cos(orbitAngle) - normalizedY * Math.sin(orbitAngle);
        const rotatedY = normalizedX * Math.sin(orbitAngle) + normalizedY * Math.cos(orbitAngle);
        normalizedX = rotatedX;
        normalizedY = rotatedY;
      }

      return { x: (normalizedX + 0.5) * width, y: (normalizedY + 0.5) * height };
    };

    const updateNodes = (deltaTime: number) => {
      entranceTime += deltaTime;

      if (variant === 'orbit') {
        orbitAngle += deltaTime * ORBIT_SPEED;
      }

      const aspectRatio = width / height;

      nodes.forEach((node) => {
        if (node.kind === 'bar') {
          node.angle += node.spin * deltaTime;
        }

        node.x += node.velocityX * DRIFT_SPEED * deltaTime;
        node.y += node.velocityY * DRIFT_SPEED * deltaTime * aspectRatio;

        if (node.x < 0.04) {
          node.x = 0.04;
          node.velocityX = Math.abs(node.velocityX);
        }

        if (node.x > 0.96) {
          node.x = 0.96;
          node.velocityX = -Math.abs(node.velocityX);
        }

        if (node.y < 0.05) {
          node.y = 0.05;
          node.velocityY = Math.abs(node.velocityY);
        }

        if (node.y > 0.95) {
          node.y = 0.95;
          node.velocityY = -Math.abs(node.velocityY);
        }
      });

      // parallax 변형의 경우 커서 근접 노드를 커서 방향으로 끌어당깁니다.
      if (variant === 'parallax' && mouse.isInside) {
        const mouseX = mouse.x / width;
        const mouseY = mouse.y / height;

        nodes.forEach((node) => {
          const deltaX = mouseX - node.x;
          const deltaY = mouseY - node.y;
          const distance = Math.hypot(deltaX, deltaY);

          if (distance < 0.28 && distance > 0.001) {
            const force = (0.28 - distance) * 0.12;
            node.x += deltaX * force;
            node.y += deltaY * force;
          }
        });
      }
    };

    const drawNetwork = () => {
      context.clearRect(0, 0, width, height);

      const threshold = Math.min(width, height) * 0.34;
      const points = nodes.map((node) => {
        return convertNodeToPoint(node);
      });
      const reveals = nodes.map((node) => {
        if (prefersReducedMotion) {
          return 1;
        }

        return easeOutCubic(Math.max(0, Math.min(1, (entranceTime - node.delay) / ENTRANCE_NODE_SECONDS)));
      });

      context.lineCap = 'round';
      context.lineWidth = LINE_WIDTH;

      // 근접 노드 사이에 거리 비례 투명도의 연결선을 그립니다.
      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const distance = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);

          if (distance < threshold) {
            const reveal = Math.min(reveals[i], reveals[j]);

            if (reveal > 0.01) {
              context.strokeStyle = `rgba(${inkRgb}, ${(1 - distance / threshold) * 0.36 * reveal})`;
              context.beginPath();
              context.moveTo(points[i].x, points[i].y);
              context.lineTo(points[j].x, points[j].y);
              context.stroke();
            }
          }
        }
      }

      // 커서와 근접 노드 사이에 연결선을 그립니다.
      if (mouse.isInside && !prefersReducedMotion) {
        points.forEach((point, index) => {
          const distance = Math.hypot(point.x - mouse.x, point.y - mouse.y);

          if (distance < threshold * 1.1) {
            context.strokeStyle = `rgba(${inkRgb}, ${(1 - distance / (threshold * 1.1)) * 0.6 * reveals[index]})`;
            context.beginPath();
            context.moveTo(mouse.x, mouse.y);
            context.lineTo(point.x, point.y);
            context.stroke();
          }
        });
      }

      nodes.forEach((node, index) => {
        const point = points[index];
        const reveal = reveals[index];

        if (reveal <= 0.01) {
          return;
        }

        if (node.kind === 'bar') {
          let barAngle = node.angle;

          if (variant === 'orbit') {
            barAngle += orbitAngle;
          }

          const halfLength = ((node.barLength * Math.min(width, height)) / 2) * (0.4 + 0.6 * reveal);
          const deltaX = Math.cos(barAngle) * halfLength;
          const deltaY = Math.sin(barAngle) * halfLength;
          context.lineWidth = LINE_WIDTH * (0.5 + 0.5 * reveal);
          context.strokeStyle = `rgba(${inkRgb}, ${0.92 * reveal})`;
          context.beginPath();
          context.moveTo(point.x - deltaX, point.y - deltaY);
          context.lineTo(point.x + deltaX, point.y + deltaY);
          context.stroke();

          return;
        }

        // 등장 중에는 점이 살짝 커졌다 돌아오는 팝 효과를 줍니다.
        const overshoot = reveal < 1 ? 1 + Math.sin(reveal * Math.PI) * 0.18 : 1;
        context.fillStyle = `rgba(${inkRgb}, ${(node.isAccent ? 1 : 0.8) * reveal})`;
        context.beginPath();
        context.arc(point.x, point.y, DOT_RADIUS * overshoot * (0.3 + 0.7 * reveal), 0, Math.PI * 2);
        context.fill();
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouse.x = x;
      mouse.y = y;
      mouse.isInside = x >= -40 && x <= rect.width + 40 && y >= -40 && y <= rect.height + 40;
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    if (prefersReducedMotion) {
      drawNetwork();

      return () => {
        resizeObserver.disconnect();
      };
    }

    window.addEventListener('mousemove', handleMouseMove);

    const tick = (time: number) => {
      const deltaTime = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      updateNodes(deltaTime);
      drawNetwork();
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [colorMode, variant]);

  return (
    <canvas
      aria-hidden
      className={styles.container}
      ref={canvasRef}
    />
  );
};
