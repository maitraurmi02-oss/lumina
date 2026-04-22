import { Painting } from "../types";

const AIC_BASE_URL = "https://api.artic.edu/api/v1/artworks";
const AIC_IMAGE_URL = "https://www.artic.edu/iiif/2";

export async function fetchDailyPainting(): Promise<Painting | null> {
  try {
    // Get current date string in IST (YYYY-MM-DD)
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // en-CA gives YYYY-MM-DD
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    
    // Fetch a list of famous artworks
    // Art Institute of Chicago API allows search/filtering. 
    // We'll pick one from a broad query of famous pieces.
    const response = await fetch(`${AIC_BASE_URL}/search?q=painting&limit=100&fields=id,title,artist_display,image_id,date_display,medium_display,dimensions,place_of_origin`);
    const data = await response.json();
    
    if (data && data.data && data.data.length > 0) {
      const artworks = data.data.filter((a: any) => a.image_id);
      const index = seed % artworks.length;
      return artworks[index];
    }
    return null;
  } catch (error) {
    console.error("Error fetching daily painting:", error);
    return null;
  }
}

export function getImageUrl(imageId: string, size: number = 843): string {
  return `${AIC_IMAGE_URL}/${imageId}/full/843,/0/default.jpg`;
}
