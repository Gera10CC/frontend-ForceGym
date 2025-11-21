export type VideoCategory = 
  'gluteos' | 'femoral' | 'cuadriceps' | 'pecho' | 
  'triceps' | 'hombro' | 'espalda' | 'biceps' | 'pantorrilla';

export interface Video {
  id: string;
  title: string;
  description: string;
  youTubeId: string; 
  category: VideoCategory;
}