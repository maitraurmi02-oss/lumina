export interface Painting {
  id: number;
  title: string;
  artist_display: string;
  image_id: string;
  date_display: string;
  medium_display: string;
  dimensions?: string;
  place_of_origin?: string;
  is_public_domain?: boolean;
}

export interface MusicState {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumArt?: string;
  dominantColors?: string[];
}

export type WallpaperSource = 'painting' | 'music';
