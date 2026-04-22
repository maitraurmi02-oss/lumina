import { motion } from "motion/react";
import { Painting } from "../types";
import { getImageUrl } from "../services/artService";

interface PaintingDisplayProps {
  painting: Painting;
}

export function PaintingDisplay({ painting }: PaintingDisplayProps) {
  return (
    <div className="relative h-full flex flex-col justify-end p-8 pb-32">
      <motion.div 
        className="max-w-md mx-auto aspect-[3/4] rounded-lg shadow-2xl overflow-hidden mb-12"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <img 
          src={getImageUrl(painting.image_id, 800)} 
          alt={painting.title}
          className="w-full h-full object-contain bg-black/20"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <motion.div 
        className="space-y-2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h1 className="font-serif text-3xl md:text-5xl font-normal leading-tight">
          {painting.title}
        </h1>
        <p className="text-white/60 text-sm tracking-widest uppercase font-medium">
          {painting.artist_display.split('\n')[0]}
          {painting.place_of_origin && ` • ${painting.place_of_origin}`}
        </p>
        <p className="text-white/40 text-xs italic font-serif mt-4">
          {painting.medium_display}, {painting.date_display}
        </p>
        {painting.dimensions && (
          <p className="text-white/20 text-[10px] uppercase tracking-widest mt-2">
            {painting.dimensions}
          </p>
        )}
      </motion.div>
    </div>
  );
}
