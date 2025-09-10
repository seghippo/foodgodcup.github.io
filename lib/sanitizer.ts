import DOMPurify from 'dompurify';

// Sanitize HTML content to prevent XSS attacks
export const sanitizeHtml = (dirty: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: basic sanitization
    return dirty
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }
  
  // Client-side: use DOMPurify
  return DOMPurify.sanitize(dirty);
};

// Sanitize user input for display
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .trim() // Remove leading/trailing whitespace
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .slice(0, 1000); // Limit length
};

// Sanitize email input
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  return email
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9@._-]/g, ''); // Remove invalid characters
};

// Sanitize name input
export const sanitizeName = (name: string): string => {
  if (!name) return '';
  
  return name
    .trim()
    .replace(/[^a-zA-Z\s]/g, '') // Only allow letters and spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .slice(0, 50); // Limit length
};

// Sanitize password input (basic cleanup)
export const sanitizePassword = (password: string): string => {
  if (!password) return '';
  
  return password.trim();
};

// Sanitize team ID
export const sanitizeTeamId = (teamId: string): string => {
  if (!teamId) return '';
  
  return teamId.replace(/[^a-zA-Z0-9]/g, ''); // Only allow alphanumeric
};

// Sanitize game data
export const sanitizeGameData = (gameData: any) => {
  return {
    home: sanitizeTeamId(gameData.home),
    away: sanitizeTeamId(gameData.away),
    venue: sanitizeInput(gameData.venue),
    time: sanitizeInput(gameData.time),
    date: gameData.date // Date should be validated separately
  };
};
