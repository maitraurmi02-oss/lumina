import { Painting } from "../types";

const AIC_BASE_URL = "https://api.artic.edu/api/v1/artworks";
const AIC_IMAGE_URL = "https://www.artic.edu/iiif/2";

const FALLBACK_PAINTINGS: Painting[] = [
  {
    id: 129884,
    title: "Starry Night and the Astronauts",
    artist_display: "Alma Thomas",
    image_id: "e9645ae9-ad95-059d-ef71-9ecf33739cc3",
    date_display: "1972",
    medium_display: "Acrylic on canvas",
    place_of_origin: "United States",
    is_public_domain: true
  },
  {
    id: 111440,
    title: "A Sunday on La Grande Jatte — 1884",
    artist_display: "Georges Seurat",
    image_id: "2d484387-22e8-7101-e744-9ad57ae6cfca",
    date_display: "1884/86",
    medium_display: "Oil on canvas",
    place_of_origin: "France",
    is_public_domain: true
  },
  {
    id: 27992,
    title: "The Old Guitarist",
    artist_display: "Pablo Picasso",
    image_id: "cc350db2-4aa8-927b-2321-df399c0ec9a4",
    date_display: "late 1903–early 1904",
    medium_display: "Oil on panel",
    place_of_origin: "Spain",
    is_public_domain: true
  }
];

export async function fetchDailyPainting(): Promise<Painting | null> {
  try {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    
    const response = await fetch(`${AIC_BASE_URL}/search?q=painting&query[term][is_public_domain]=true&limit=100&fields=id,title,artist_display,image_id,date_display,medium_display,dimensions,place_of_origin,is_public_domain`);
    
    if (!response.ok) throw new Error("API response not ok");
    
    const data = await response.json();
    
    if (data && data.data && data.data.length > 0) {
      const artworks = data.data.filter((a: any) => a.image_id && a.is_public_domain);
      if (artworks.length > 0) {
        const index = seed % artworks.length;
        return artworks[index];
      }
    }
    
    // Fallback to static selection if API returns nothing
    return FALLBACK_PAINTINGS[seed % FALLBACK_PAINTINGS.length];
  } catch (error) {
    console.error("Error fetching daily painting:", error);
    // Return a random fallback on total failure
    return FALLBACK_PAINTINGS[Math.floor(Math.random() * FALLBACK_PAINTINGS.length)];
  }
}

export function getImageUrl(imageId: string, size: number = 843): string {
  // Use a more robust image source if IIIF is failing
  // AIC direct image endpoint is often more reliable than IIIF in frames
  return `https://www.artic.edu/iiif/2/${imageId}/full/,${size}/0/default.jpg`;
}

/**
 * Secondary fallback if AIC is totally blocked
 */
export function getArtFallbackUrl(seed: number): string {
  const collections = [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5', // Abstract Art
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab', // Vibrant Colors
    'https://images.unsplash.com/photo-1549490349-8643362247b5', // Modern Art
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9', // Classical
  ];
  return `${collections[seed % collections.length]}?auto=format&fit=crop&w=800&q=80`;
}
