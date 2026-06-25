import React, { useEffect, useState } from 'react';
import { AuroraBackground, ShootingStars } from './PremiumEffects';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  delay: number;
}

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate static/dynamic gold floaters
    const generated: Particle[] = Array.from({ length: 40 }).map((_, idx) => ({
      id: idx,
      x: Math.random() * 100, // percentage x
      y: Math.random() * 100, // percentage y
      size: Math.random() * 3 + 1, // px size
      speedY: Math.random() * 0.04 + 0.015, // float speed
      delay: Math.random() * 5
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Black and Dark Brown gradient background */}
      <div className="absolute inset-0 bg-[#0d0704] bg-radial-at-t from-[#20110a] via-[#090503] to-black" />

      {/* Grid Pattern Layer */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 167, 38, 0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 167, 38, 0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Radial Premium Glowing Orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-orange-highlight/10 blur-[130px] mix-blend-screen animate-glowing-glow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gold/5 blur-[150px] mix-blend-screen animate-glowing-glow" style={{ animationDelay: '3s' }} />

      {/* Premium Aurora Wave Gradients */}
      <AuroraBackground />

      {/* Cinematic Shooting Stars */}
      <ShootingStars />

      {/* Floating Gold Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-t from-gold to-orange-highlight opacity-40 animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            filter: 'blur(0.5px)',
            animationDuration: `${12 + p.size * 3}s`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
}
