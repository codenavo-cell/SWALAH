import React, { useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================
// 1 & 2. TYPEWRITER & SPLIT TEXT ANIMATION
// ==========================================
export function TypewriterSplitHeading({ text }: { text: string }) {
  const isWelcome = text.toLowerCase().includes("welcome to");
  const isSwalahUnion = text.toUpperCase().includes("SWALAH UNION");
  
  if (isWelcome || isSwalahUnion) {
    const subtitleText = "WELCOME TO";
    const titleText = "SWALAH UNION WEB";
    
    const subtitleLetters = Array.from(subtitleText);
    const titleLetters = Array.from(titleText);
    
    return (
      <div 
        className="flex flex-col items-center justify-center space-y-4 py-4"
        style={{ fontSize: '21px', lineHeight: '25px' }}
      >
        {/* Subtitle: Welcome to */}
        <div className="relative inline-block overflow-hidden py-1">
          <motion.div 
            className="flex items-center justify-center gap-[0.1em] select-none text-xs md:text-sm font-sans font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-stone-400 via-stone-100 to-stone-300"
            initial="hidden"
            animate="visible"
          >
            {subtitleLetters.map((char, index) => (
              <motion.span
                key={index}
                className="inline-block animate-pulse-slow"
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.03, duration: 0.4 }
                  }
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>
          {/* Subtle shining light sweep for the subtitle */}
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-stone-300/40 to-transparent animate-light-sweep" />
        </div>

        {/* Title: SWALAH UNION WEBSITE */}
        <div className="relative inline-block py-2">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-normal leading-tight select-none relative bg-gradient-to-r from-orange-highlight via-gold to-[#ff6f00] bg-clip-text text-transparent"
            style={{ 
              fontFamily: "'Honey Bear', 'DynaPuff', 'Fredoka', 'Outfit', sans-serif",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.65)) drop-shadow(0 0 18px rgba(255,140,0,0.7)) drop-shadow(0 0 35px rgba(255,167,38,0.45))"
            }}
            initial="hidden"
            animate="visible"
          >
            {titleLetters.map((char, index) => {
              return (
                <motion.span
                  key={index}
                  className="inline-block hover:scale-110 hover:rotate-3 transition-transform duration-200 cursor-default"
                  variants={{
                    hidden: { opacity: 0, y: 25, scale: 0.7 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: {
                        type: "spring",
                        damping: 10,
                        stiffness: 90,
                        delay: (subtitleLetters.length * 0.03) + (index * 0.04)
                      }
                    }
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              );
            })}
          </motion.h1>
          {/* Golden Light Sweep overlay below title */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent animate-light-sweep" />
        </div>
      </div>
    );
  }

  const letters = Array.from(text);
  
  // Outer container for the smooth entry + Golden Light Sweep container
  return (
    <div className="relative inline-block overflow-hidden py-2">
      {/* Golden Light Sweep overlay */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent animate-light-sweep" />
      
      <motion.h1 
        className="text-3xl md:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-tight select-none relative"
        style={{ fontSize: '57px' }}
        initial="hidden"
        animate="visible"
      >
        {letters.map((char, index) => {
          const idx1 = index + 1;
          let extraStyle: React.CSSProperties = {};
          if (idx1 === 10) {
            extraStyle = { color: '#ffffff' };
          } else if (idx1 === 31) {
            extraStyle = { color: '#ffffff', fontSize: '35px' };
          } else if (idx1 === 23) {
            extraStyle = { fontSize: '59px' };
          } else if (idx1 === 24) {
            extraStyle = { borderWidth: '2px', borderStyle: 'none' };
          } else if (idx1 === 18) {
            extraStyle = { borderWidth: '5px', borderStyle: 'none' };
          } else if (idx1 === 11) {
            extraStyle = { borderWidth: '3px', borderStyle: 'none' };
          } else if (idx1 === 8) {
            extraStyle = { borderWidth: '4px', borderStyle: 'none' };
          }

          return (
            <motion.span
              key={index}
              className="inline-block"
              style={extraStyle}
              variants={{
                hidden: { opacity: 0, y: 15, scale: 0.8 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: {
                    type: "spring",
                    damping: 12,
                    stiffness: 100,
                    delay: index * 0.04
                  }
                }
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
      </motion.h1>
    </div>
  );
}

// ==========================================
// 3. GOLDEN LIGHT SWEEP (for texts and buttons)
// ==========================================
export function LightSweepWrapper({ children, className = "rounded-xl" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {children}
      {/* Light Sweep Layer */}
      <span className="absolute inset-0 block w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-sweep pointer-events-none" />
    </div>
  );
}

// ==========================================
// 4. FLOATING HERO BACKGROUND SHAPES
// ==========================================
export function FloatingHeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
      {/* Floating vector shapes moving slowly */}
      <motion.div 
        className="absolute w-72 h-72 rounded-full border border-gold/10"
        style={{ top: '10%', left: '15%' }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute w-96 h-96 rounded-full border border-orange-highlight/5"
        style={{ bottom: '5%', right: '10%' }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.05, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {/* Rotating abstract vector lines */}
      <motion.div 
        className="absolute w-[500px] h-[500px] rounded-3xl border border-gold/5"
        style={{ top: '30%', left: '35%', rotate: 45 }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

// ==========================================
// 5. ZOOM-IN ENTRANCE
// ==========================================
export function ZoomInEntrance({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 80, 
        damping: 18, 
        delay 
      }}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// 6, 7, 8, 9 & 10, 20. PREMIUM 3D TILT, BORDER GLOW, MAGNETIC, FLOATING, REFLECTION & CARD FLIP
// ==========================================
interface PremiumCardProps {
  children?: React.ReactNode;
  backContent?: React.ReactNode;
  className?: string;
  isFlipable?: boolean;
}

export function PremiumCard({ 
  children, 
  backContent, 
  className = '', 
  isFlipable = false 
}: PremiumCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt calculation & dynamic inline style assignment without causing state re-renders
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Position inside element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Relative position normalized: -0.5 to 0.5
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (xc - x) / xc; // -1 to 1
    const dy = (y - yc) / yc; // -1 to 1

    const tiltX = dy * 8; // Max 8 degrees tilt in X
    const tiltY = dx * 8; // Max 8 degrees tilt in Y

    // Bypass React state and update styles directly for massive performance wins
    cardRef.current.style.transition = 'none';
    cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    
    const borderGlow = cardRef.current.querySelector('.premium-border-glow') as HTMLDivElement;
    if (borderGlow) {
      borderGlow.style.opacity = '1';
      borderGlow.style.transform = `translate(${x - 75}px, ${y - 75}px)`;
    }

    const spotGlow = cardRef.current.querySelector('.premium-spot-glow') as HTMLDivElement;
    if (spotGlow) {
      spotGlow.style.opacity = '1';
      spotGlow.style.transform = `translate(${x - 120}px, ${y - 120}px)`;
    }

    const reflection = cardRef.current.querySelector('.premium-glass-reflection') as HTMLDivElement;
    if (reflection) {
      reflection.style.transform = 'translateX(100%)';
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    // Reset hover changes smoothly
    cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    if (isFlipped) {
      cardRef.current.style.transform = 'rotateY(180deg)';
    } else {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    }

    const borderGlow = cardRef.current.querySelector('.premium-border-glow') as HTMLDivElement;
    if (borderGlow) borderGlow.style.opacity = '0';

    const spotGlow = cardRef.current.querySelector('.premium-spot-glow') as HTMLDivElement;
    if (spotGlow) spotGlow.style.opacity = '0';

    const reflection = cardRef.current.querySelector('.premium-glass-reflection') as HTMLDivElement;
    if (reflection) reflection.style.transform = 'translateX(-100%)';
  };

  const handleCardClick = () => {
    if (isFlipable) {
      const nextFlipped = !isFlipped;
      setIsFlipped(nextFlipped);
      
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        if (nextFlipped) {
          cardRef.current.style.transform = 'rotateY(180deg)';
          const borderGlow = cardRef.current.querySelector('.premium-border-glow') as HTMLDivElement;
          const spotGlow = cardRef.current.querySelector('.premium-spot-glow') as HTMLDivElement;
          if (borderGlow) borderGlow.style.opacity = '0';
          if (spotGlow) spotGlow.style.opacity = '0';
        } else {
          cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        }
      }
    }
  };

  return (
    <div 
      className={`relative select-none ${isFlipable ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
      style={{ perspective: '1000px' }}
    >
      {/* Glow Border Light Travel Effect */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`glass-panel overflow-hidden transition-all duration-300 relative rounded-2xl border border-gold/10 ${className}`}
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {/* Glow Border Line Animation (Traveling Light border effect) */}
        {!isFlipped && (
          <div 
            className="premium-border-glow absolute rounded-full pointer-events-none bg-radial-at-c from-gold/30 via-transparent to-transparent blur-md opacity-0"
            style={{
              left: '0px',
              top: '0px',
              width: '150px',
              height: '150px',
              mixBlendMode: 'screen',
              willChange: 'transform, opacity',
              transition: 'opacity 0.3s ease'
            }}
          />
        )}

        {/* Dynamic Spotlight Glow centered on card under mouse */}
        {!isFlipped && (
          <div 
            className="premium-spot-glow absolute rounded-[15px] pointer-events-none bg-radial-at-c from-gold/5 via-transparent to-transparent opacity-0"
            style={{
              left: '0px',
              top: '0px',
              width: '240px',
              height: '240px',
              mixBlendMode: 'color-dodge',
              willChange: 'transform, opacity',
              transition: 'opacity 0.3s ease'
            }}
          />
        )}

        {/* 20. Glass Reflection overlay */}
        <div 
          className="premium-glass-reflection absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full"
          style={{
            transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
            willChange: 'transform'
          }}
        />

        {/* Flip Card Faces wrapper */}
        <div className="w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {isFlipable ? (
            <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
              {/* Front Face of Flipable Card */}
              <div 
                className={`w-full h-full transition-opacity duration-300 ${isFlipped ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                {children}
              </div>
              
              {/* Back Face of Flipable Card */}
              <div 
                className={`w-full h-full transition-opacity duration-300 bg-stone-950/95 p-5 flex flex-col justify-between rounded-2xl ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'}`}
                style={{ 
                  backfaceVisibility: 'hidden', 
                  transform: 'rotateY(180deg)'
                }}
              >
                {backContent}
              </div>
            </div>
          ) : (
            // Regular card content
            <div className="w-full h-full">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 10. Floating Wrapper (generates a slow, natural floating loop perfect for highlighting best cards)
export function FloatingCardWrapper({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0]
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// 11. LIVE STAT COUNTER ANIMATION
// ==========================================
export function AnimatedCounter({ value, suffix = '', delay = 0.1 }: { value: number, suffix?: string, delay?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 1200; // ms
    
    const timeout = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing out quad
        const easedProgress = progress * (2 - progress);
        setCount(Math.floor(easedProgress * value));

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setCount(value);
        }
      };
      
      requestAnimationFrame(step);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return <span className="font-mono">{count}{suffix}</span>;
}

// ==========================================
// 12. CIRCULAR PROGRESS RING ANIMATION
// ==========================================
export function CircularProgressRing({ percentage, size = 64, strokeWidth = 5, color = '#FFA726' }: { percentage: number, size?: number, strokeWidth?: number, color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [dashoffset, setDashoffset] = useState(circumference);

  useEffect(() => {
    // Elegant reveal delay
    const t = setTimeout(() => {
      const offset = circumference - (percentage / 100) * circumference;
      setDashoffset(offset);
    }, 200);
    return () => clearTimeout(t);
  }, [percentage, circumference]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size}>
        {/* Track */}
        <circle
          stroke="rgba(255,167,38,0.06)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Animated Progress Ring */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-1000 ease-out -rotate-90 origin-center"
        />
      </svg>
      {/* Center Percentage Display */}
      <div className="absolute font-mono text-xs font-bold text-white">
        {percentage}%
      </div>
    </div>
  );
}

// ==========================================
// 16, 17, 18. AURORA BACKGROUNDS, SHOOTING STARS & GOLD PARKS
// ==========================================

// AURORA GOLD LIGHT WAVES (Optimized translation-only layout cached in GPU)
export function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-color-dodge z-0 opacity-25">
      {/* Aurora Wave Left */}
      <motion.div 
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[70%] rounded-full bg-gradient-to-tr from-orange-highlight/15 to-gold/10 blur-[120px]"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 15, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ willChange: 'transform' }}
      />
      {/* Aurora Wave Right */}
      <motion.div 
        className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[80%] rounded-full bg-gradient-to-bl from-amber-500/10 to-[#9e5d16]/10 blur-[130px]"
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -15, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}

// SHOOTING STARS
interface Star {
  id: number;
  top: string;
  left: string;
  delay: number;
  duration: number;
}

export function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate 5 independent shooting stars cycling
    const generated: Star[] = Array.from({ length: 5 }).map((_, idx) => ({
      id: idx,
      top: `${Math.random() * 40}%`,
      left: `${Math.random() * 60}%`,
      delay: Math.random() * 12,
      duration: Math.random() * 2 + 1
    }));
    setStars(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <span 
          key={star.id}
          className="absolute bg-gradient-to-r from-white via-gold to-transparent h-[1px] w-[80px] origin-left rotate-[-40deg] opacity-0 animate-shooting-star"
          style={{
            top: star.top,
            left: star.left,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// GOLDEN SPARKS / GLITTER PARTICLES
export function GoldenSparks({ count = 12 }: { count?: number }) {
  const [sparks, setSparks] = useState<{ id: number; left: number; top: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: count }).map((_, idx) => ({
      id: idx,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1.5,
      delay: Math.random() * 5
    }));
    setSparks(generated);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {sparks.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-gold/50 animate-ping"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: `${3 + s.size}s`,
            animationDelay: `${s.delay}s`
          }}
        />
      ))}
    </div>
  );
}

// ==========================================
// 19. INTERACTIVE MOUSE SPOTLIGHT (Desktop-only tracking with requestAnimationFrame)
// ==========================================
export function MouseSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ currentX: -100, currentY: -100, targetX: -100, targetY: -100 });
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Responsive safety - check if mouse exists / not touch screen
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    if (window.innerWidth >= 1024) {
      const handleMouseMove = (e: MouseEvent) => {
        positionRef.current.targetX = e.clientX;
        positionRef.current.targetY = e.clientY;
        if (containerRef.current) {
          containerRef.current.style.opacity = '0.5';
        }
      };

      const handleMouseLeave = () => {
        if (containerRef.current) {
          containerRef.current.style.opacity = '0';
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);

      // Smooth easing with requestAnimationFrame (GPU Accelerated)
      let animFrameId: number;
      const updateLocation = () => {
        const { currentX, currentY, targetX, targetY } = positionRef.current;
        
        // Linear Interpolate: smooth delay
        const nextX = currentX + (targetX - currentX) * 0.08;
        const nextY = currentY + (targetY - currentY) * 0.08;
        
        positionRef.current.currentX = nextX;
        positionRef.current.currentY = nextY;
        
        if (spotlightRef.current) {
          spotlightRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0) translate(-50%, -50%)`;
        }
        
        animFrameId = requestAnimationFrame(updateLocation);
      };
      
      animFrameId = requestAnimationFrame(updateLocation);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        cancelAnimationFrame(animFrameId);
      };
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-10 pointer-events-none transition-opacity duration-300 mix-blend-screen opacity-0"
    >
      <div 
        ref={spotlightRef}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '350px',
          height: '350px',
          top: '0px',
          left: '0px',
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(255, 167, 38, 0.12) 0%, rgba(255, 140, 0, 0.03) 45%, transparent 70%)',
          filter: 'blur(10px)',
          willChange: 'transform'
        }}
      />
    </div>
  );
}
