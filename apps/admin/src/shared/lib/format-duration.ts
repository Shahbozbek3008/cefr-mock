export const formatDuration = (totalSec: number) => `${Math.floor(totalSec / 60)}:${String(totalSec % 60).padStart(2, '0')}`;
