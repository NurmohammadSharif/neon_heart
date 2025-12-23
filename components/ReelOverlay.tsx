import React from 'react';
import { Stage, ColorTheme } from '../types';

interface ReelOverlayProps {
  stage: Stage;
  activeTheme: ColorTheme;
}

const USER_PHOTO = "/photo.jpeg";

const ReelOverlay: React.FC<ReelOverlayProps> = ({ stage, activeTheme }) => {
  const showContent =
    stage === 'forming' ||
    stage === 'stable' ||
    stage === 'pulse' ||
    stage === 'birthday';

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none select-none overflow-hidden">

      {/* Text + Heart container */}
      <div
        className={`w-full flex flex-col items-center pt-24 transition-all duration-[2000ms] ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}
      >

        {/* Text */}
        <div className="text-center px-6">
          <h1
            className="font-romantic text-5xl md:text-7xl mb-0 tracking-tight drop-shadow-[0_8px_15px_rgba(0,0,0,0.8)] transition-colors duration-1000"
            style={{
              color:
                activeTheme.color === 'multi'
                  ? '#fff'
                  : activeTheme.secondaryColor || '#fff',
              textShadow: `0 0 30px ${
                activeTheme.color === 'multi'
                  ? 'rgba(255,255,255,0.7)'
                  : activeTheme.glow
              }`,
            }}
          >
            Happy Birthday
          </h1>

          <p className="font-romantic text-2xl md:text-4xl text-white/90 italic tracking-[0.2em] opacity-90 drop-shadow-xl mb-4">
            My Love
          </p>
        </div>

        {/* Heart moved DOWN so it does not touch head */}
        <div className="relative mt-8">

          {/* Background glow (behind heart only) */}
          <div
            className="absolute inset-0 blur-[60px] opacity-30 animate-pulse scale-150 transition-colors duration-1000"
            style={{
              backgroundColor:
                activeTheme.color === 'multi'
                  ? '#ff3366'
                  : activeTheme.color,
            }}
          />

          <div className="relative w-[200px] h-[200px] md:w-[240px] md:h-[240px] flex items-center justify-center animate-[cinematic-breathe_8s_infinite_ease-in-out]">

            {/* Heart clip */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
                  <path d="M0.5,0.95 C0.48,0.93,0.25,0.7,0.1,0.5 C0,0.35,0,0.25,0.1,0.1 C0.25,-0.05,0.45,0.05,0.5,0.2 C0.55,0.05,0.75,-0.05,0.9,0.1 C1,0.25,1,0.35,0.9,0.5 C0.75,0.7,0.52,0.93,0.5,0.95 Z" />
                </clipPath>
              </defs>
            </svg>

            {/* Photo (UNCHANGED) */}
            <div
              className="w-full h-full relative z-20 transition-all duration-1000"
              style={{
                clipPath: 'url(#heartClip)',
                filter: `drop-shadow(0 0 30px ${
                  activeTheme.color === 'multi'
                    ? 'rgba(255,50,100,0.4)'
                    : activeTheme.glow
                })`,
              }}
            >
              <img
                src={USER_PHOTO}
                alt="Birthday Girl"
                className="w-full h-full object-cover scale-110"
                style={{
                  objectPosition: 'center 15%',
                  filter: 'contrast(1.1) brightness(1.05)',
                }}
              />
            </div>

            {/* Heart border glow (reduced opacity) */}
            <div
              className="absolute inset-[-2px] z-30 opacity-30 pointer-events-none transition-all duration-1000"
              style={{
                clipPath: 'url(#heartClip)',
                background: `linear-gradient(
                  135deg,
                  ${activeTheme.secondaryColor || 'white'} 0%,
                  ${
                    activeTheme.color === 'multi'
                      ? '#ff3366'
                      : activeTheme.color
                  } 50%,
                  transparent 100%
                )`,
              }}
            >
              <div
                className="w-full h-full border-[3px] border-white/30"
                style={{ clipPath: 'url(#heartClip)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes cinematic-breathe {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.03); filter: brightness(1.06); }
        }
      `}</style>
    </div>
  );
};

export default ReelOverlay;
