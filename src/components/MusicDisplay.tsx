import { motion } from "motion/react";
import { MusicState } from "../types";
import { Music, Play, Pause } from "lucide-react";

interface MusicDisplayProps {
  music: MusicState;
  onTogglePlay: () => void;
}

export function MusicDisplay({ music, onTogglePlay }: MusicDisplayProps) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center p-8">
      <motion.div 
        className="relative group cursor-pointer"
        onClick={onTogglePlay}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="w-64 h-64 md:w-80 md:h-80 rounded-2xl shadow-2xl overflow-hidden relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img 
            src={music.albumArt || "https://picsum.photos/seed/album/400/400"} 
            alt={music.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            {music.isPlaying ? (
              <Pause className="w-16 h-16 text-white fill-white" />
            ) : (
              <Play className="w-16 h-16 text-white fill-white ml-2" />
            )}
          </div>
        </motion.div>
        
        {/* Animated rings when playing */}
        {music.isPlaying && (
          <motion.div 
            className="absolute -inset-4 rounded-[2.5rem] border-2 border-white/20 -z-10"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>

      <motion.div 
        className="mt-12 text-center space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">
          {music.title || "Unknown Track"}
        </h2>
        <p className="text-white/60 text-lg">
          {music.artist || "Unknown Artist"}
        </p>
      </motion.div>

      {/* Floating music vibes */}
      <div className="absolute bottom-12 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="w-1 bg-white/40 rounded-full"
            animate={{ 
              height: music.isPlaying ? [12, 32, 16, 24, 12] : 4 
            }}
            transition={{ 
              duration: 0.4 + i * 0.1, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        ))}
      </div>
    </div>
  );
}
