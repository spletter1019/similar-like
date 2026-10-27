export interface Student {
  id: number; // 1 to 30
  name: string; // 학번 또는 이름
  scores: (number | null)[]; // 5 items (1 to 5, or null if blank)
}

export interface NewStudent {
  name: string;
  scores: (number | null)[]; // 5 items (1 to 5, or null if blank)
}

export interface SimilarityResult {
  student: Student;
  rankEuclidean: number;
  rankCosine: number;
  // Euclidean
  euclideanDistance: number;
  euclideanSimilarity: number;
  // Cosine
  dotProduct: number;
  normA: number;
  normB: number;
  normProduct: number; // ||A|| × ||B||
  cosineSimilarity: number;
  isMaxEuclidean: boolean;
  isMaxCosine: boolean;
}

export type SimilarityTab = 'euclidean' | 'cosine';

export interface Preset {
  title: string;
  items: [string, string, string, string, string];
}
