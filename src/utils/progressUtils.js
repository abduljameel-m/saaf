export function getAverage(entries, key) {
  if (!entries.length) return 0;

  const total = entries.reduce((sum, entry) => {
    return sum + Number(entry[key] || 0);
  }, 0);

  return Math.round(total / entries.length);
}

export function getTotal(entries, key) {
  return entries.reduce((sum, entry) => {
    return sum + Number(entry[key] || 0);
  }, 0);
}

export function getBestDelay(entries) {
  if (!entries.length) return 0;

  return Math.max(...entries.map((entry) => Number(entry.delayMinutes || 0)));
}

export function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export function getLatestEntry(entries) {
  if (!entries.length) return null;

  return [...entries].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  })[0];
}