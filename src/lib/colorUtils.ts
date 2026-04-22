export async function extractPalette(imageUrl: string): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.referrerPolicy = 'no-referrer';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(['#1a1a1a', '#3a3a3a']);
        
        canvas.width = 50; // Small size for performance
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);
        
        const imageData = ctx.getImageData(0, 0, 50, 50).data;
        const colors = new Map<string, number>();
        
        // Sample pixels
        for (let i = 0; i < imageData.length; i += 20) { // Step to speed up
          const r = imageData[i];
          const g = imageData[i+1];
          const b = imageData[i+2];
          const rgb = `${r},${g},${b}`;
          colors.set(rgb, (colors.get(rgb) || 0) + 1);
        }
        
        // Sort and get top colors
        const sorted = Array.from(colors.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([rgb]) => `rgb(${rgb})`);
          
        resolve(sorted.length > 0 ? sorted : ['#1a1a1a', '#3a3a3a']);
      } catch (e) {
        console.error("Color extraction failed", e);
        resolve(['#1a1a1a', '#3a3a3a']);
      }
    };

    img.onerror = () => {
      resolve(['#1a1a1a', '#3a3a3a']);
    };

    img.src = imageUrl;
  });
}
