import React, { useEffect, useRef } from 'react';
import { Particle, ColorTheme, Stage } from '../types';

interface ParticleHeartProps {
  theme: ColorTheme;
  stage: Stage;
}

interface Star {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  opacity: number;
}

const ParticleHeart: React.FC<ParticleHeartProps> = ({ theme, stage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>();
  const scaleRef = useRef<number>(10);

  const PARTICLE_COUNT = 2200;
  const STAR_COUNT = 80;

  const getHeartPoint = (t: number) => {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y };
  };

  const initParticles = (width: number, height: number) => {
    const scale = Math.min(width, height) / 45;
    scaleRef.current = scale;

    const particles: Particle[] = [];
    const centerY = height * 0.5; // Centralized background position
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = (i / PARTICLE_COUNT) * Math.PI * 2;
      const point = getHeartPoint(t);
      const targetX = width / 2 + point.x * scale;
      const targetY = centerY + point.y * scale;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX,
        targetY,
        vx: 0,
        vy: 0,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }
    particlesRef.current = particles;

    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05 - 0.03,
        opacity: Math.random() * 0.3,
      });
    }
    starsRef.current = stars;
  };

  const update = (width: number, height: number) => {
    const particles = particlesRef.current;
    const stars = starsRef.current;
    const time = Date.now() * 0.0018;
    const scaleFactor = scaleRef.current;
    const centerY = height * 0.5;

    particles.forEach((p, i) => {
      let tx = p.targetX;
      let ty = p.targetY;

      if (stage === 'scattered') {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        tx = width / 2 + Math.cos(angle + time) * (width * 0.45);
        ty = height / 2 + Math.sin(angle * 1.2 + time) * (height * 0.45);
      } else {
        const pulse = (stage === 'stable' || stage === 'forming') ? 1 : (1 + Math.sin(time * 2.5) * 0.06);
        const t = (i / PARTICLE_COUNT) * Math.PI * 2;
        const point = getHeartPoint(t);
        tx = width / 2 + point.x * scaleFactor * pulse;
        ty = centerY + point.y * scaleFactor * pulse;
      }

      const dx = tx - p.x;
      const dy = ty - p.y;
      const force = 0.08;

      p.vx += dx * force;
      p.vy += dy * force;
      p.vx *= 0.82; 
      p.vy *= 0.82;
      p.x += p.vx;
      p.y += p.vy;
    });

    stars.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    starsRef.current.forEach(s => {
      ctx.globalAlpha = s.opacity;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (stage !== 'scattered') {
      const centerY = height * 0.5;
      const grad = ctx.createRadialGradient(width / 2, centerY, 0, width / 2, centerY, width * 0.6);
      const glowColor = theme.color === 'multi' ? 'rgba(255,100,200,0.08)' : theme.glow.replace('0.5', '0.08');
      grad.addColorStop(0, glowColor);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    particlesRef.current.forEach((p, i) => {
      let color = theme.color;
      
      if (color === 'multi') {
        const hue = (i / PARTICLE_COUNT) * 360 + (Date.now() * 0.04);
        color = `hsl(${hue % 360}, 85%, 75%)`;
      } else if (theme.secondaryColor) {
        const yBias = (p.y - (height * 0.5)) / (scaleRef.current * 13);
        if (yBias < -0.2) {
          color = theme.secondaryColor;
        }
      }

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = color;
      ctx.shadowBlur = stage === 'pulse' ? 8 : 3;
      ctx.shadowColor = color;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        initParticles(canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const loop = () => {
      update(canvas.width, canvas.height);
      draw(ctx, canvas.width, canvas.height);
      animationRef.current = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [theme, stage]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

export default ParticleHeart;