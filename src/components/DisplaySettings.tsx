import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Sparkles, SlidersHorizontal, RotateCcw, Plus, Minus, X, Eye, EyeOff } from 'lucide-react';

interface DisplaySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  brightness: number;
  setBrightness: (b: number) => void;
  highContrast: boolean;
  setHighContrast: (c: boolean) => void;
}

export default function DisplaySettings({
  isOpen,
  onClose,
  brightness,
  setBrightness,
  highContrast,
  setHighContrast,
}: DisplaySettingsProps) {

  // Methods to adjust brightness
  const handleIncrease = () => {
    setBrightness(Math.min(150, brightness + 5));
  };

  const handleDecrease = () => {
    setBrightness(Math.max(30, brightness - 5));
  };

  const handleReset = () => {
    setBrightness(75); // Reset to 75% which is standard Normal
    setHighContrast(false);
  };

  // Predefined modes
  const modes = [
    { name: 'Dim Mode', value: 50, icon: Moon, desc: 'Reduced brightness for night use' },
    { name: 'Normal Mode', value: 75, icon: Sun, desc: 'Default website brightness' },
    { name: 'Bright Mode', value: 100, icon: Sparkles, desc: 'Enhanced visibility' },
    { name: 'Extra Bright', value: 125, icon: Sun, desc: 'Maximum light output' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Settings Panel Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-6 md:right-8 w-[calc(100vw-3rem)] max-w-sm z-50 rounded-2xl border border-gold/25 bg-stone-950/90 shadow-[0_15px_50px_rgba(255,167,38,0.15)] backdrop-blur-xl p-5 overflow-hidden text-white"
            id="display-settings-panel"
            style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
          >
            {/* Background Accent Gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-highlight/5 rounded-full blur-3xl pointer-events-none" />

            {/* Panel Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-gold animate-pulse" />
                <h3 className="text-sm font-display font-black tracking-wider uppercase text-white">
                  Display Settings
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-all cursor-pointer"
                title="Close Settings"
              >
                <X size={15} />
              </button>
            </div>

            <div className="relative z-10 space-y-5">
              {/* Presets Grid */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                  Presets & Modes
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {modes.map((m) => {
                    const ModeIcon = m.icon;
                    const isActive = brightness === m.value;
                    return (
                      <button
                        key={m.name}
                        onClick={() => setBrightness(m.value)}
                        className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gold/15 border-gold shadow-[0_0_15px_rgba(218,165,32,0.15)]'
                            : 'bg-white/5 border-white/5 hover:border-gold/20 hover:bg-white/10'
                        }`}
                        title={m.desc}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={`text-[11px] font-bold ${isActive ? 'text-gold' : 'text-stone-300'}`}>
                            {m.name}
                          </span>
                          <ModeIcon size={12} className={isActive ? 'text-gold' : 'text-stone-400'} />
                        </div>
                        <span className="text-[9px] text-stone-400 font-mono">
                          {m.value}% Bright
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider Controller */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                    Brightness Control
                  </label>
                  <span className="text-xs font-mono font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                    {brightness}%
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-[#160d08]/60 p-3 rounded-xl border border-white/5">
                  {/* Decrease Button */}
                  <button
                    onClick={handleDecrease}
                    disabled={brightness <= 30}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-stone-300 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Decrease Brightness (-5%)"
                  >
                    <Minus size={13} />
                  </button>

                  {/* Golden Slider Range input */}
                  <input
                    type="range"
                    min="30"
                    max="150"
                    step="1"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="flex-1 accent-gold cursor-pointer h-1.5 bg-stone-800 rounded-lg appearance-none outline-none"
                    title="Drag to adjust website brightness"
                  />

                  {/* Increase Button */}
                  <button
                    onClick={handleIncrease}
                    disabled={brightness >= 150}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-stone-300 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Increase Brightness (+5%)"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* High Contrast Option */}
              <div className="flex items-center justify-between bg-[#160d08]/60 p-3 rounded-xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white flex items-center gap-1">
                    {highContrast ? <Eye size={13} className="text-gold" /> : <EyeOff size={13} className="text-stone-400" />}
                    High Contrast Layout
                  </span>
                  <span className="text-[9px] text-stone-400">
                    Enhance text clarity and readability
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-gold ${
                    highContrast ? 'bg-gold' : 'bg-stone-800'
                  }`}
                  aria-label="Toggle High Contrast"
                >
                  <div
                    className={`bg-stone-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      highContrast ? 'translate-x-4 bg-white' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Miniature Mock Preview */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                  Live Preview
                </label>
                <div 
                  className="p-3 rounded-xl border bg-stone-900 border-white/5 relative overflow-hidden transition-all duration-300"
                  style={{ 
                    filter: `brightness(${brightness}%) ${highContrast ? 'contrast(125%)' : ''}`, 
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-highlight to-gold" />
                    <span className="text-[9px] font-bold tracking-widest text-gold uppercase">SWALAH</span>
                  </div>
                  <div className="h-1.5 w-3/4 bg-white/20 rounded mb-1" />
                  <div className="h-1 w-1/2 bg-white/10 rounded" />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded-lg text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Reset to normal default settings"
                >
                  <RotateCcw size={11} />
                  Reset Defaults
                </button>
                <span className="text-[9px] text-stone-500 font-mono">
                  Pref saved automatically
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
