/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fetchDailyPainting } from "./services/artService";
import { extractPalette } from "./lib/colorUtils";
import { Painting, MusicState, WallpaperSource } from "./types";
import { FluidAura } from "./components/FluidAura";
import { PaintingDisplay } from "./components/PaintingDisplay";
import { MusicDisplay } from "./components/MusicDisplay";
import { Settings, Music as MusicIcon, Palette, Lock, Unlock, Clock } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility to get current time in IST as a Date object for display
const getISTTime = () => {
  const d = new Date();
  const istStr = d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  return new Date(istStr);
};

const DEMO_TRACKS = [
  {
    title: "After Hours",
    artist: "The Weeknd",
    albumArt: "https://picsum.photos/seed/afterhours/800/800",
  },
  {
    title: "Currents",
    artist: "Tame Impala",
    albumArt: "https://picsum.photos/seed/currents/800/800",
  },
  {
    title: "Discovery",
    artist: "Daft Punk",
    albumArt: "https://picsum.photos/seed/discovery/800/800",
  },
];

export default function App() {
  const [source, setSource] = useState<WallpaperSource>("painting");
  const [painting, setPainting] = useState<Painting | null>(null);
  const [music, setMusic] = useState<MusicState>({ isPlaying: false });
  const [colors, setColors] = useState<string[]>(["#1a1a1a", "#2a2a2a", "#0a0a0a"]);
  const [isLocked, setIsLocked] = useState(true);
  const [time, setTime] = useState(getISTTime());
  const [blurAmount, setBlurAmount] = useState(100);
  const [fluidIntensity, setFluidIntensity] = useState(1);
  const [currentDate, setCurrentDate] = useState(getISTTime().toDateString());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const nowIST = getISTTime();
      setTime(nowIST);
      
      // Daily refresh check (IST based)
      if (nowIST.toDateString() !== currentDate) {
        setCurrentDate(nowIST.toDateString());
        window.location.reload();
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [currentDate]);

  // Fetch painting
  useEffect(() => {
    const loadPainting = async () => {
      const art = await fetchDailyPainting();
      if (art) {
        setPainting(art);
        // Only update colors if we are in painting mode
        if (!music.isPlaying) {
          const artColors = await extractPalette(`https://www.artic.edu/iiif/2/${art.image_id}/full/400,/0/default.jpg`);
          setColors(artColors);
        }
      }
    };
    loadPainting();
  }, []);

  // Sync colors when music changes
  useEffect(() => {
    const syncMusicColors = async () => {
      if (music.isPlaying && music.albumArt) {
        const musicColors = await extractPalette(music.albumArt);
        setColors(musicColors);
        setSource("music");
      } else {
        setSource("painting");
        if (painting) {
          const artColors = await extractPalette(`https://www.artic.edu/iiif/2/${painting.image_id}/full/400,/0/default.jpg`);
          setColors(artColors);
        }
      }
    };
    syncMusicColors();
  }, [music, painting]);

  const togglePlay = () => {
    if (music.isPlaying) {
      setMusic(prev => ({ ...prev, isPlaying: false }));
    } else {
      const track = music.title ? music : { ...DEMO_TRACKS[0], isPlaying: true };
      setMusic({ ...track, isPlaying: true });
    }
  };

  const selectTrack = (track: typeof DEMO_TRACKS[0]) => {
    setMusic({ ...track, isPlaying: true });
  };

  return (
    <div className="flex bg-[#0c0c0e] text-[#e0e0e0] h-screen w-full overflow-hidden font-sans">
      <FluidAura colors={colors} blur={blurAmount} intensity={fluidIntensity} />

      {/* Left Sidebar: App Identity - Dashboard Aesthetic */}
      <aside className="hidden lg:flex w-72 border-r border-white/10 flex-col p-8 z-50">
        <div className="mb-12">
          <h1 className="text-2xl font-light tracking-widest text-white font-serif italic uppercase">Lumina</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1">Wallpaper Engine</p>
        </div>

        <nav className="space-y-12 flex-grow">
          <div className="space-y-6">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Wallpaper Mode</p>
            <ul className="space-y-4">
              <li 
                className={cn(
                  "flex items-center space-x-3 cursor-pointer transition-colors",
                  source === 'music' ? "text-white" : "text-white/50"
                )}
                onClick={() => setSource('music')}
              >
                <div className={cn("w-1 h-1 rounded-full", source === 'music' ? "bg-white" : "bg-transparent")} />
                <span className="text-sm tracking-wide">Music Reactive</span>
              </li>
              <li 
                className={cn(
                  "flex items-center space-x-3 cursor-pointer transition-colors",
                  source === 'painting' ? "text-white" : "text-white/50"
                )}
                onClick={() => setSource('painting')}
              >
                <div className={cn("w-1 h-1 rounded-full", source === 'painting' ? "bg-white" : "bg-transparent")} />
                <span className="text-sm tracking-wide">Daily Masterpiece</span>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Vibe Settings</p>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                  <span>Surface Blur</span>
                  <span>{blurAmount}px</span>
                </div>
                <input 
                  type="range" min="20" max="200" value={blurAmount} 
                  onChange={(e) => setBlurAmount(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                  <span>Fluid Intensity</span>
                  <span>{fluidIntensity.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.1" max="5" step="0.1" value={fluidIntensity} 
                  onChange={(e) => setFluidIntensity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>
          </div>
        </nav>

        <div className="mt-auto">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-medium">System Status</p>
            <p className="text-xs text-white flex items-center gap-2">
              <span className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                music.isPlaying ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-white/20"
              )} />
              {music.isPlaying ? "Signal Captured" : "Ambient Monitoring"}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Preview Container */}
      <main className="flex-1 relative flex items-center justify-center p-4 lg:p-12">
        {/* Device Wrapper for desktop dashboard look */}
        <div className="w-full h-full lg:max-w-[400px] lg:max-h-[850px] lg:aspect-[9/19.5] relative lg:border-[8px] lg:border-[#1a1a1c] lg:rounded-[56px] lg:shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden lg:bg-black group transition-all duration-700">
          
          {/* Lockscreen layer */}
          <AnimatePresence>
            {isLocked && (
              <motion.div 
                className="absolute inset-0 z-50 flex flex-col items-center justify-between py-24 bg-black/30 backdrop-blur-[4px] cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -100 }}
                onClick={() => setIsLocked(false)}
              >
                <div className="text-center space-y-4">
                  <Clock className="w-10 h-10 mx-auto opacity-30 mb-4" />
                  <h1 className="text-8xl font-extralight tracking-tighter">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </h1>
                  <p className="text-white/50 tracking-[0.4em] uppercase text-[10px] font-semibold">
                    {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                  <motion.div 
                    animate={{ y: [0, -12, 0] }} 
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="opacity-30"
                  >
                    <Lock className="w-5 h-5" />
                  </motion.div>
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-30 font-medium">Slide to focus</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actual Wallpaper Content */}
          <div className="h-full w-full">
            <AnimatePresence mode="wait">
              {source === "painting" && painting ? (
                <motion.div 
                  key="painting"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1 }}
                  className="h-full"
                >
                  <PaintingDisplay painting={painting} />
                </motion.div>
              ) : (
                <motion.div 
                  key="music"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1 }}
                  className="h-full"
                >
                  <MusicDisplay music={music} onTogglePlay={togglePlay} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Android Home Bar Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-40" />
        </div>

        {/* Right Settings Rail - Dashboard Aesthetic */}
        <div className="hidden lg:flex flex-col ml-12 space-y-8 h-[850px] items-center py-8">
          <div 
            onClick={() => setIsLocked(true)}
            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer group"
          >
            <Unlock className="w-5 h-5 text-white/40 group-hover:text-white group-hover:scale-110 transition-all" />
          </div>

          <div 
            onClick={() => setSource(prev => prev === "painting" ? "music" : "painting")}
            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer group"
          >
            {source === "painting" ? 
              <MusicIcon className="w-5 h-5 text-white/40 group-hover:text-white" /> : 
              <Palette className="w-5 h-5 text-white/40 group-hover:text-white" />
            }
          </div>

          <div className="relative group">
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer">
              <Settings className="w-5 h-5 text-white/40 group-hover:text-white" />
            </div>
            
            <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col gap-2 p-3 glass rounded-3xl w-56 animate-in fade-in slide-in-from-right-4 duration-300">
              <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 px-3 mt-2 font-bold">Sound Profiles</p>
              {DEMO_TRACKS.map((track) => (
                <button
                  key={track.title}
                  onClick={() => selectTrack(track)}
                  className="flex items-center gap-3 p-2.5 hover:bg-white/10 rounded-2xl transition-all text-left"
                >
                  <img src={track.albumArt} className="w-12 h-12 rounded-xl object-cover shadow-lg" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold truncate text-white">{track.title}</p>
                    <p className="text-[10px] text-white/40 truncate mt-0.5">{track.artist}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow flex items-center justify-center">
            <div className="h-48 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>
          </div>

          <div className="text-[9px] uppercase tracking-[0.4em] text-white/30 vertical-rl transform rotate-180 mb-4 font-bold whitespace-nowrap">
            Build 1.0.4-LMN - Ready
          </div>
        </div>
      </main>

      {/* Settings trigger for mobile */}
      <button 
        className="lg:hidden absolute top-6 right-6 z-50 p-4 glass rounded-full"
        onClick={() => setSource(prev => prev === "painting" ? "music" : "painting")}
      >
        {source === "painting" ? <MusicIcon className="w-6 h-6" /> : <Palette className="w-6 h-6" />}
      </button>
    </div>
  );
}
