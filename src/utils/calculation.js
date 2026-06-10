export  const calcWeightedDefects = (major, minor, trivial) => major * 1 + minor * 0.33 + trivial * 0.2;
export const calcEffortDeviation = (planned, actual) => planned ? ((actual - planned) / planned) * 100 : 0;
export const calcRiskIndex = (probability, impacts) => {
  const normalized = impacts.reduce((s, v) => s + v, 0) / impacts.length;
  return probability * normalized;
};
export const calcProductivity = (size, effort) => effort ? size / effort : 0;
export const calcReviewEfficiency = (reviewWeighted, totalWeighted) => totalWeighted ? (reviewWeighted / totalWeighted) * 100 : 0;
export const calcDefectRemovalEfficiency = (pre, post) => {
  const total = pre + post;
  return total ? (pre / total) * 100 : 0;
};
export const calcScheduleVariation = (actualEnd, plannedEnd, plannedStart) => {
  const plannedDuration = (new Date(plannedEnd) - new Date(plannedStart)) / (1000 * 3600 * 24);
  const actualDuration = (new Date(actualEnd) - new Date(plannedStart)) / (1000 * 3600 * 24);
  return plannedDuration ? ((actualDuration - plannedDuration) / plannedDuration) * 100 : 0;
};