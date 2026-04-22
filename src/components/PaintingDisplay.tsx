import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Painting } from "../types";
import { getImageUrl, getArtFallbackUrl } from "../services/artService";

interface PaintingDisplayProps {
  painting: Painting;
}

export function PaintingDisplay({ painting }: PaintingDisplayProps) {
  const [imgSrc, setImgSrc] = useState<string>(getImageUrl(painting.image_id, 800));
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset states when painting changes
  useEffect(() => {
    setImgSrc(getImageUrl(painting.image_id, 800));
    setIsLoaded(false);
    setHasError(false);
  }, [painting]);

  const handleError = () => {
    // If the AIC image fails, try the Unsplash fallback
    if (imgSrc.includes('artic.edu')) {
      setImgSrc(getArtFallbackUrl(painting.id));
    } else {
      setHasError(true);
    }
  };

  return (
    <div className="relative h-full flex flex-col justify-end p-8 pb-32">
      <motion.div 
        className="max-w-md mx-auto aspect-[3/4] rounded-lg shadow-2xl overflow-hidden mb-12 relative bg-white/5 flex items-center justify-center"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
          </div>
        )}
        
        {hasError ? (
          <div className="text-center p-6 space-y-2 opacity-30">
            <p className="text-sm font-medium tracking-widest uppercase">Visual Resting</p>
          </div>
        ) : (
          <img 
            src={imgSrc} 
            alt={painting.title}
            onLoad={() => setIsLoaded(true)}
            onError={handleError}
            className={`w-full h-full object-cover bg-black/20 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
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
