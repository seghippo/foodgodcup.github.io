/**
 * Utility functions for date handling and validation
 */

/**
 * Check if a game date is in the future
 * @param gameDate - ISO string date of the game
 * @returns true if the game date is in the future
 */
export function isGameDateInFuture(gameDate: string): boolean {
  const gameDateTime = new Date(gameDate);
  const now = new Date();
  
  // Set time to start of day for comparison (ignore time)
  const gameDateOnly = new Date(gameDateTime.getFullYear(), gameDateTime.getMonth(), gameDateTime.getDate());
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return gameDateOnly > todayOnly;
}

/**
 * Check if a game date is today or in the past
 * @param gameDate - ISO string date of the game
 * @returns true if the game date is today or in the past
 */
export function isGameDateTodayOrPast(gameDate: string): boolean {
  return !isGameDateInFuture(gameDate);
}

/**
 * Format a date for display
 * @param dateString - ISO string date
 * @returns formatted date string
 */
export function formatGameDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get today's date as ISO string (start of day)
 * @returns ISO string of today's date
 */
export function getTodayISOString(): string {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
}

/**
 * Get yesterday's date as ISO string (start of day)
 * @returns ISO string of yesterday's date
 */
export function getYesterdayISOString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).toISOString();
}
