export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours > 0
    ? `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} minute${
        remainingMinutes > 1 ? "s" : ""
      }`
    : `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
}
