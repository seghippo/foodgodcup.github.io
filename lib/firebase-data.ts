import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Game, MatchResult, Player, Team } from './data';

// Collection names
const COLLECTIONS = {
  SCHEDULE: 'schedule',
  MATCH_RESULTS: 'matchResults',
  PLAYERS: 'players',
  TEAMS: 'teams'
} as const;

// Schedule functions
export async function getScheduleFromFirebase(): Promise<Game[]> {
  try {
    const scheduleRef = collection(db, COLLECTIONS.SCHEDULE);
    const querySnapshot = await getDocs(scheduleRef);
    
    if (querySnapshot.empty) {
      console.log('No schedule data found in Firebase');
      return [];
    }
    
    const games = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore timestamps to strings if needed
      const game: any = {
        id: doc.id,
        ...data
      };
      
      // Convert date field if it's a Firestore timestamp
      if (data.date && typeof data.date.toDate === 'function') {
        game.date = data.date.toDate().toISOString();
      }
      
      // Convert createdAt/updatedAt if they exist
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        game.createdAt = data.createdAt.toDate().toISOString();
      }
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
        game.updatedAt = data.updatedAt.toDate().toISOString();
      }
      
      return game;
    }) as Game[];
    
    // Sort by date locally if date field exists
    return games.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return 0;
    });
  } catch (error) {
    console.error('Error getting schedule from Firebase:', error);
    return [];
  }
}

export async function addGameToFirebase(game: Omit<Game, 'id'>): Promise<string | null> {
  try {
    const scheduleRef = collection(db, COLLECTIONS.SCHEDULE);
    const docRef = await addDoc(scheduleRef, {
      ...game,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding game to Firebase:', error);
    return null;
  }
}

export async function updateGameInFirebase(gameId: string, updates: Partial<Game>): Promise<boolean> {
  try {
    const gameRef = doc(db, COLLECTIONS.SCHEDULE, gameId);
    await updateDoc(gameRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating game in Firebase:', error);
    return false;
  }
}

export async function deleteGameFromFirebase(gameId: string): Promise<boolean> {
  try {
    const gameRef = doc(db, COLLECTIONS.SCHEDULE, gameId);
    await deleteDoc(gameRef);
    return true;
  } catch (error) {
    console.error('Error deleting game from Firebase:', error);
    return false;
  }
}

// Match Results functions
export async function getMatchResultsFromFirebase(): Promise<MatchResult[]> {
  try {
    const resultsRef = collection(db, COLLECTIONS.MATCH_RESULTS);
    const querySnapshot = await getDocs(resultsRef);
    
    if (querySnapshot.empty) {
      console.log('No match results found in Firebase');
      return [];
    }
    
    const results = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore timestamps to strings if needed
      const result: any = {
        id: doc.id,
        ...data
      };
      
      // Convert submittedAt field if it's a Firestore timestamp
      if (data.submittedAt && typeof data.submittedAt.toDate === 'function') {
        result.submittedAt = data.submittedAt.toDate().toISOString();
      }
      
      // Convert createdAt/updatedAt if they exist
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        result.createdAt = data.createdAt.toDate().toISOString();
      }
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
        result.updatedAt = data.updatedAt.toDate().toISOString();
      }
      
      return result;
    }) as MatchResult[];
    
    // Sort by submittedAt locally if field exists
    return results.sort((a, b) => {
      if (a.submittedAt && b.submittedAt) {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
      return 0;
    });
  } catch (error) {
    console.error('Error getting match results from Firebase:', error);
    return [];
  }
}

export async function addMatchResultToFirebase(result: Omit<MatchResult, 'id'>): Promise<string | null> {
  try {
    const resultsRef = collection(db, COLLECTIONS.MATCH_RESULTS);
    const docRef = await addDoc(resultsRef, {
      ...result,
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding match result to Firebase:', error);
    return null;
  }
}

export async function updateMatchResultInFirebase(resultId: string, updates: Partial<MatchResult>): Promise<boolean> {
  try {
    const resultRef = doc(db, COLLECTIONS.MATCH_RESULTS, resultId);
    await updateDoc(resultRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating match result in Firebase:', error);
    return false;
  }
}

// Real-time listeners
export function subscribeToSchedule(callback: (games: Game[]) => void): () => void {
  const scheduleRef = collection(db, COLLECTIONS.SCHEDULE);
  const q = query(scheduleRef, orderBy('date', 'asc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const games = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Game[];
    callback(games);
  });
}

export function subscribeToMatchResults(callback: (results: MatchResult[]) => void): () => void {
  const resultsRef = collection(db, COLLECTIONS.MATCH_RESULTS);
  const q = query(resultsRef, orderBy('submittedAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MatchResult[];
    callback(results);
  });
}

// Players and Teams functions
export async function getPlayersFromFirebase(): Promise<Player[]> {
  try {
    const playersRef = collection(db, COLLECTIONS.PLAYERS);
    const querySnapshot = await getDocs(playersRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Player[];
  } catch (error) {
    console.error('Error getting players from Firebase:', error);
    return [];
  }
}

export async function getTeamsFromFirebase(): Promise<Team[]> {
  try {
    const teamsRef = collection(db, COLLECTIONS.TEAMS);
    const querySnapshot = await getDocs(teamsRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Team[];
  } catch (error) {
    console.error('Error getting teams from Firebase:', error);
    return [];
  }
}

// Clear all games from Firebase
export async function clearAllGamesFromFirebase(): Promise<boolean> {
  try {
    const scheduleRef = collection(db, COLLECTIONS.SCHEDULE);
    const querySnapshot = await getDocs(scheduleRef);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log(`Cleared ${querySnapshot.docs.length} games from Firebase`);
    return true;
  } catch (error) {
    console.error('Error clearing games from Firebase:', error);
    return false;
  }
}

// Initialize data in Firebase (run once to migrate from localStorage)
export async function initializeFirebaseData(): Promise<void> {
  try {
    // Check if data already exists
    const scheduleSnapshot = await getDocs(collection(db, COLLECTIONS.SCHEDULE));
    if (scheduleSnapshot.empty) {
      console.log('Initializing Firebase with default data...');
      
      // No default games - start with empty schedule
      console.log('Firebase initialized with empty schedule');
    }
  } catch (error) {
    console.error('Error initializing Firebase data:', error);
  }
}
