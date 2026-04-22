import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface FluidAuraProps {
  colors: string[];
  blur?: number;
  intensity?: number;
}

export function FluidAura({ colors, blur = 100, intensity = 1 }: FluidAuraProps) {
  const [blobs, setBlobs] = useState<{ id: number; color: string; x: number; y: number; scale: number }[]>([]);

  useEffect(() => {
    // Fill blobs if we have colors
    if (colors.length > 0) {
      const newBlobs = colors.map((color, i) => ({
        id: i,
        color,
        // Distribute blobs randomly but spread out
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: 1 + Math.random() * 2,
      }));
      setBlobs(newBlobs);
    }
  }, [colors]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-black">
      <AnimatePresence>
        <motion.div 
          className="absolute inset-0 opacity-80"
          style={{ filter: `blur(${blur}px)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
        >
          {blobs.map((blob) => (
            <motion.div
              key={blob.id}
              className="absolute w-[80vw] h-[80vw] rounded-full"
              style={{
                backgroundColor: blob.color,
                left: `${blob.x}%`,
                top: `${blob.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                x: [Math.random() * 50 - 25, Math.random() * 50 - 25, Math.random() * 50 - 25],
                y: [Math.random() * 50 - 25, Math.random() * 50 - 25, Math.random() * 50 - 25],
                scale: [blob.scale, blob.scale * 1.5, blob.scale],
              }}
              transition={{
                duration: (20 + Math.random() * 10) / intensity,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
