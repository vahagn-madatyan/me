/**
 * Compute a "heat score" for a project based on status, phase progress, and recency.
 * Higher scores indicate more active / higher-priority projects.
 *
 * @param {Object} project - Project object with status, phase, and lastUpdated fields
 * @returns {number} Heat score (0-120 range)
 */
export function computeHeatScore(project) {
  const statusWeights = {
    "IN DEVELOPMENT": 100,
    ARCHITECTURE: 70,
    PLANNING: 50,
    RESEARCH: 30,
    COMPLETE: 10,
  };

  const statusWeight = statusWeights[project.status] ?? 0;

  // Base score: 60% status weight + 40% phase progress
  let score = statusWeight * 0.6 + project.phase * 0.4;

  // Recency boost based on lastUpdated
  if (project.lastUpdated) {
    const now = new Date();
    const updated = new Date(project.lastUpdated);
    const diffDays = Math.floor((now - updated) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      score += 20;
    } else if (diffDays <= 14) {
      score += 10;
    } else if (diffDays <= 30) {
      score += 5;
    }
  }

  return Math.round(score * 100) / 100;
}
