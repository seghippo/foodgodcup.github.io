// Rate limiting for login attempts
interface LoginAttempt {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}

// Store login attempts in memory (in production, use Redis or database)
const loginAttempts = new Map<string, LoginAttempt>();

// Configuration
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
const RESET_DURATION = 15 * 60 * 1000; // 15 minutes

export const checkRateLimit = (email: string): { allowed: boolean; remainingAttempts?: number; blockedUntil?: number } => {
  const now = Date.now();
  const attempts = loginAttempts.get(email);
  
  // If no previous attempts, allow and record
  if (!attempts) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }
  
  // Check if currently blocked
  if (attempts.blockedUntil && now < attempts.blockedUntil) {
    return { 
      allowed: false, 
      blockedUntil: attempts.blockedUntil 
    };
  }
  
  // Reset attempts if enough time has passed
  if (now - attempts.lastAttempt > RESET_DURATION) {
    attempts.count = 1;
    attempts.lastAttempt = now;
    delete attempts.blockedUntil;
    loginAttempts.set(email, attempts);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }
  
  // Check if max attempts reached
  if (attempts.count >= MAX_ATTEMPTS) {
    attempts.blockedUntil = now + BLOCK_DURATION;
    loginAttempts.set(email, attempts);
    return { 
      allowed: false, 
      blockedUntil: attempts.blockedUntil 
    };
  }
  
  // Increment attempts
  attempts.count++;
  attempts.lastAttempt = now;
  loginAttempts.set(email, attempts);
  
  return { 
    allowed: true, 
    remainingAttempts: MAX_ATTEMPTS - attempts.count 
  };
};

export const resetRateLimit = (email: string): void => {
  loginAttempts.delete(email);
};

export const getRateLimitStatus = (email: string): { count: number; lastAttempt: number; blockedUntil?: number } | null => {
  const attempts = loginAttempts.get(email);
  if (!attempts) return null;
  
  return {
    count: attempts.count,
    lastAttempt: attempts.lastAttempt,
    blockedUntil: attempts.blockedUntil
  };
};

// Clean up old entries periodically (in production, use a proper job scheduler)
export const cleanupOldEntries = (): void => {
  const now = Date.now();
  const cutoff = now - (24 * 60 * 60 * 1000); // 24 hours
  
  for (const [email, attempts] of loginAttempts.entries()) {
    if (attempts.lastAttempt < cutoff) {
      loginAttempts.delete(email);
    }
  }
};

// Run cleanup every hour
if (typeof window !== 'undefined') {
  setInterval(cleanupOldEntries, 60 * 60 * 1000);
}
