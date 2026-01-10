export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatLength(l: number): string {
  const hours = Math.floor(l / 3600);
  const minutes = Math.floor((l % 3600) / 60);
  const seconds = `${l % 60}`.padStart(2, "0");
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
}
