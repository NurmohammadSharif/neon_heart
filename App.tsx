import React, { useState, useEffect } from 'react';
import { THEMES } from './constants';
import { Stage, ColorTheme } from './types';
import ParticleHeart from './components/ParticleHeart';
import ReelOverlay from './components/ReelOverlay';

const App: React.FC = () => {
  const [stage, setStage] = useState<Stage>('forming');
  const [activeTheme, setActiveTheme] = useState<ColorTheme>(THEMES[2]); // Default changed to index 2 (Emerald)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('stable');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-0 font-sans text-white overflow-hidden">
      {/* Immersive background glow */}
      <div 
        className="absolute inset-0 transition-all duration-[2000ms] opacity-30"
        style={{ 
          background: `radial-gradient(circle at 50% 40%, ${activeTheme.color === 'multi' ? '#ff3366' : activeTheme.color} 0%, transparent 80%)`,
          filter: 'blur(100px)' 
        }}
      />

      {/* Cinematic Frame */}
      <div className="relative w-full max-w-[430px] h-full md:h-[94vh] md:aspect-[9/19.5] bg-black rounded-none md:rounded-[60px] shadow-[0_0_120px_rgba(0,0,0,1)] overflow-hidden border-0 md:border-[12px] border-zinc-900/40 vignette group">
        
        {/* Animated Background Particles (First Love) */}
        <div className="absolute inset-0 scale-[1.1] md:scale-100 opacity-90 transition-transform duration-1000">
          <ParticleHeart theme={activeTheme} stage={stage} />
        </div>

        {/* Central Heart Photo & Text (Second Love & Writing) */}
        <ReelOverlay 
          stage={stage}
          activeTheme={activeTheme}
        />

        {/* Page Theme Switcher */}
        <div className="absolute bottom-12 left-0 right-0 z-50 px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-auto">
          <div className="flex items-center justify-center gap-3 py-3.5 bg-black/60 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl">
            {THEMES.map((theme) => (
              <button
                key={theme.name}
                onClick={() => setActiveTheme(theme)}
                className={`w-7 h-7 rounded-full border-2 transition-all duration-300 hover:scale-125 ${
                  activeTheme.name === theme.name ? 'border-white scale-110 shadow-[0_0_15px_white]' : 'border-transparent'
                }`}
                style={{ 
                  background: theme.color === 'multi' 
                    ? 'linear-gradient(45deg, #ff3366, #ffcc00, #33ccff)' 
                    : theme.color 
                }}
                aria-label={`Switch to ${theme.name} theme`}
              />
            ))}
          </div>
          <p className="text-center text-[9px] uppercase tracking-[0.25em] text-white/40 mt-3 font-bold">Atmosphere Selection</p>
        </div>

        {/* Cinematic Masks - adjusted to prevent cutting top text */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
        
        {/* Film Static/Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_40%)]"></div>
      </div>
    </div>
  );
};

export default App;