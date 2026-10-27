import { Student, NewStudent, SimilarityResult } from '../types';

/**
 * Calculates Euclidean distance between two vectors:
 * d(A, B) = sqrt(sum((A_i - B_i)^2))
 */
export function calculateEuclideanDistance(vecA: number[], vecB: number[]): number {
  let sumSq = 0;
  const len = Math.min(vecA.length, vecB.length);
  for (let i = 0; i < len; i++) {
    const diff = (vecA[i] || 0) - (vecB[i] || 0);
    sumSq += diff * diff;
  }
  return Math.sqrt(sumSq);
}

/**
 * Euclidean similarity:
 * Sim(A, B) = 1 / (1 + d(A, B))
 * Range: (0, 1], where 1 means exact match (d=0)
 */
export function calculateEuclideanSimilarity(distance: number): number {
  return 1 / (1 + distance);
}

/**
 * Dot product of two vectors: A · B = sum(A_i * B_i)
 */
export function calculateDotProduct(vecA: number[], vecB: number[]): number {
  let sum = 0;
  const len = Math.min(vecA.length, vecB.length);
  for (let i = 0; i < len; i++) {
    sum += (vecA[i] || 0) * (vecB[i] || 0);
  }
  return sum;
}

/**
 * L2 Norm (magnitude) of a vector: ||A|| = sqrt(sum(A_i^2))
 */
export function calculateNorm(vec: number[]): number {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    const val = vec[i] || 0;
    sumSq += val * val;
  }
  return Math.sqrt(sumSq);
}

/**
 * Cosine similarity between two vectors:
 * cos(theta) = (A · B) / (||A|| * ||B||)
 * Range: [-1, 1] (or [0, 1] for non-negative preference scores)
 */
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): {
  dotProduct: number;
  normA: number;
  normB: number;
  normProduct: number;
  cosineSimilarity: number;
} {
  const dotProduct = calculateDotProduct(vecA, vecB);
  const normA = calculateNorm(vecA);
  const normB = calculateNorm(vecB);
  const normProduct = normA * normB;

  if (normA === 0 && normB === 0) {
    return { dotProduct: 0, normA: 0, normB: 0, normProduct: 0, cosineSimilarity: 1.0 };
  }
  if (normA === 0 || normB === 0) {
    return { dotProduct: 0, normA, normB, normProduct, cosineSimilarity: 0.0 };
  }

  const cosineSimilarity = dotProduct / normProduct;
  return { dotProduct, normA, normB, normProduct, cosineSimilarity };
}

/**
 * Computes similarities of all active students against the new student.
 * An active student is one with a name and scores.
 */
export function computeAllSimilarities(
  students: Student[],
  newStudent: NewStudent,
  use6thDim: boolean = false
): SimilarityResult[] {
  // Only evaluate students that have a non-empty name and at least one score
  const validStudents = students.filter(
    (s) => s.name.trim() !== '' && s.scores.some((sc) => sc !== null)
  );

  // Check if new student has at least entered something
  const hasNewStudentScore = newStudent.scores.some((sc) => sc !== null);
  if (validStudents.length === 0 || !hasNewStudentScore) {
    return [];
  }

  const getVector = (scores: (number | null)[]) => {
    const v = [
      scores[0] ?? 0,
      scores[1] ?? 0,
      scores[2] ?? 0,
      scores[3] ?? 0,
      scores[4] ?? 0,
    ];
    if (use6thDim) {
      // 6th dimension: total score
      const sum = v.reduce((a, b) => a + b, 0);
      v.push(sum);
    }
    return v;
  };

  const newVec = getVector(newStudent.scores);

  const rawResults = validStudents.map((student) => {
    const studentVec = getVector(student.scores);
    const dist = calculateEuclideanDistance(newVec, studentVec);
    const eucSim = calculateEuclideanSimilarity(dist);
    const { dotProduct, normA, normB, normProduct, cosineSimilarity } = calculateCosineSimilarity(
      newVec,
      studentVec
    );

    return {
      student,
      rankEuclidean: 0,
      rankCosine: 0,
      euclideanDistance: dist,
      euclideanSimilarity: eucSim,
      dotProduct,
      normA,
      normB,
      normProduct,
      cosineSimilarity,
      isMaxEuclidean: false,
      isMaxCosine: false,
    };
  });

  // Find max values
  let maxEuc = -Infinity;
  let maxCos = -Infinity;
  for (const r of rawResults) {
    if (r.euclideanSimilarity > maxEuc) maxEuc = r.euclideanSimilarity;
    if (r.cosineSimilarity > maxCos) maxCos = r.cosineSimilarity;
  }

  for (const r of rawResults) {
    // Check with precision epsilon
    if (Math.abs(r.euclideanSimilarity - maxEuc) < 1e-9) {
      r.isMaxEuclidean = true;
    }
    if (Math.abs(r.cosineSimilarity - maxCos) < 1e-9) {
      r.isMaxCosine = true;
    }
  }

  // Calculate ranks
  const sortedByEuc = [...rawResults].sort(
    (a, b) => b.euclideanSimilarity - a.euclideanSimilarity
  );
  sortedByEuc.forEach((r, idx) => {
    r.rankEuclidean = idx + 1;
  });

  const sortedByCos = [...rawResults].sort(
    (a, b) => b.cosineSimilarity - a.cosineSimilarity
  );
  sortedByCos.forEach((r, idx) => {
    r.rankCosine = idx + 1;
  });

  return rawResults;
}
