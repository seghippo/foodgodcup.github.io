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
import { Game, MatchResult, Player, Team, FoodPost, FoodComment } from './data';

// Collection names
const COLLECTIONS = {
  SCHEDULE: 'schedule',
  MATCH_RESULTS: 'matchResults',
  PLAYERS: 'players',
  TEAMS: 'teams',
  FOOD_POSTS: 'foodPosts',
  FOOD_COMMENTS: 'foodComments'
} as const;

// Helper function to create unique key for games
function createGameKey(game: Game): string {
  return `${game.home}-${game.away}-${game.date}-${game.venue || 'no-venue'}`;
}

// Helper function to create unique key for match results
function createMatchResultKey(result: MatchResult): string {
  return `${result.gameId}-${result.homeTeamId}-${result.awayTeamId}-${result.submittedBy}`;
}

// Automatic duplicate detection and removal for games
export async function removeDuplicateGames(): Promise<{ removed: number; kept: number }> {
  try {
    console.log('🔍 Checking for duplicate games...');
    
    const games = await getScheduleFromFirebase();
    if (games.length === 0) {
      return { removed: 0, kept: 0 };
    }
    
    // Group games by unique key
    const gameGroups: { [key: string]: Game[] } = {};
    games.forEach(game => {
      const key = createGameKey(game);
      if (!gameGroups[key]) {
        gameGroups[key] = [];
      }
      gameGroups[key].push(game);
    });
    
    // Find and remove duplicates
    const duplicateGroups = Object.entries(gameGroups).filter(([key, games]) => games.length > 1);
    
    if (duplicateGroups.length === 0) {
      console.log('✅ No duplicate games found');
      return { removed: 0, kept: games.length };
    }
    
    console.log(`🔄 Found ${duplicateGroups.length} sets of duplicate games`);
    
    let removedCount = 0;
    let keptCount = 0;
    
    for (const [key, duplicateGames] of duplicateGroups) {
      console.log(`📋 Processing duplicate group: ${key}`);
      
      // Keep the first game (oldest by ID or creation time), remove the rest
      const [keepGame, ...gamesToRemove] = duplicateGames.sort((a, b) => {
        // Sort by ID to ensure consistent ordering
        return a.id.localeCompare(b.id);
      });
      
      console.log(`✅ Keeping game: ${keepGame.id}`);
      keptCount++;
      
      for (const gameToRemove of gamesToRemove) {
        console.log(`🗑️ Removing duplicate game: ${gameToRemove.id}`);
        await deleteGameFromFirebase(gameToRemove.id);
        removedCount++;
      }
    }
    
    // Count remaining games
    const remainingGames = games.length - removedCount;
    keptCount = remainingGames;
    
    console.log(`📊 Duplicate cleanup completed: ${removedCount} removed, ${keptCount} kept`);
    return { removed: removedCount, kept: keptCount };
    
  } catch (error) {
    console.error('❌ Error removing duplicate games:', error);
    return { removed: 0, kept: 0 };
  }
}

// Automatic duplicate detection and removal for match results
export async function removeDuplicateMatchResults(): Promise<{ removed: number; kept: number }> {
  try {
    console.log('🔍 Checking for duplicate match results...');
    
    const results = await getMatchResultsFromFirebase();
    if (results.length === 0) {
      return { removed: 0, kept: 0 };
    }
    
    // Group results by unique key
    const resultGroups: { [key: string]: MatchResult[] } = {};
    results.forEach(result => {
      const key = createMatchResultKey(result);
      if (!resultGroups[key]) {
        resultGroups[key] = [];
      }
      resultGroups[key].push(result);
    });
    
    // Find and remove duplicates
    const duplicateGroups = Object.entries(resultGroups).filter(([key, results]) => results.length > 1);
    
    if (duplicateGroups.length === 0) {
      console.log('✅ No duplicate match results found');
      return { removed: 0, kept: results.length };
    }
    
    console.log(`🔄 Found ${duplicateGroups.length} sets of duplicate match results`);
    
    let removedCount = 0;
    let keptCount = 0;
    
    for (const [key, duplicateResults] of duplicateGroups) {
      console.log(`📋 Processing duplicate group: ${key}`);
      
      // Keep the first result (oldest by ID), remove the rest
      const [keepResult, ...resultsToRemove] = duplicateResults.sort((a, b) => {
        return a.id.localeCompare(b.id);
      });
      
      console.log(`✅ Keeping result: ${keepResult.id}`);
      keptCount++;
      
      for (const resultToRemove of resultsToRemove) {
        console.log(`🗑️ Removing duplicate result: ${resultToRemove.id}`);
        await deleteDoc(doc(db, COLLECTIONS.MATCH_RESULTS, resultToRemove.id));
        removedCount++;
      }
    }
    
    // Count remaining results
    const remainingResults = results.length - removedCount;
    keptCount = remainingResults;
    
    console.log(`📊 Duplicate cleanup completed: ${removedCount} removed, ${keptCount} kept`);
    return { removed: removedCount, kept: keptCount };
    
  } catch (error) {
    console.error('❌ Error removing duplicate match results:', error);
    return { removed: 0, kept: 0 };
  }
}

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
  const maxRetries = 3;
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const scheduleRef = collection(db, COLLECTIONS.SCHEDULE);
      const docRef = await addDoc(scheduleRef, {
        ...game,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      lastError = error;
      console.error(`Error adding game to Firebase (attempt ${attempt}/${maxRetries}):`, error);
      
      // If it's a network error and we have retries left, wait and try again
      if (attempt < maxRetries && (
        error instanceof Error && (
          error.message.includes('network') || 
          error.message.includes('timeout') ||
          error.message.includes('fetch')
        )
      )) {
        console.log(`Retrying in ${attempt * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
    }
  }
  
  console.error('Failed to add game to Firebase after all retries:', lastError);
  return null;
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
  const maxRetries = 3;
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const resultsRef = collection(db, COLLECTIONS.MATCH_RESULTS);
      const docRef = await addDoc(resultsRef, {
        ...result,
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      lastError = error;
      console.error(`Error adding match result to Firebase (attempt ${attempt}/${maxRetries}):`, error);
      
      // If it's a network error and we have retries left, wait and try again
      if (attempt < maxRetries && (
        error instanceof Error && (
          error.message.includes('network') || 
          error.message.includes('timeout') ||
          error.message.includes('fetch')
        )
      )) {
        console.log(`Retrying in ${attempt * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
    }
  }
  
  console.error('Failed to add match result to Firebase after all retries:', lastError);
  return null;
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

// Add team to Firebase
export async function addTeamToFirebase(team: Team): Promise<string | null> {
  const maxRetries = 3;
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const teamsRef = collection(db, COLLECTIONS.TEAMS);
      const docRef = await addDoc(teamsRef, {
        ...team,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      lastError = error;
      console.error(`Error adding team to Firebase (attempt ${attempt}/${maxRetries}):`, error);
      
      // If it's a network error and we have retries left, wait and try again
      if (attempt < maxRetries && (
        error instanceof Error && (
          error.message.includes('network') || 
          error.message.includes('timeout') ||
          error.message.includes('fetch')
        )
      )) {
        console.log(`Retrying in ${attempt * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
    }
  }
  
  console.error('Failed to add team to Firebase after all retries:', lastError);
  return null;
}

// Add player to Firebase
export async function addPlayerToFirebase(player: Player): Promise<string | null> {
  const maxRetries = 3;
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const playersRef = collection(db, COLLECTIONS.PLAYERS);
      const docRef = await addDoc(playersRef, {
        ...player,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      lastError = error;
      console.error(`Error adding player to Firebase (attempt ${attempt}/${maxRetries}):`, error);
      
      // If it's a network error and we have retries left, wait and try again
      if (attempt < maxRetries && (
        error instanceof Error && (
          error.message.includes('network') || 
          error.message.includes('timeout') ||
          error.message.includes('fetch')
        )
      )) {
        console.log(`Retrying in ${attempt * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
    }
  }
  
  console.error('Failed to add player to Firebase after all retries:', lastError);
  return null;
}

// Sync all teams and players to Firebase
export async function syncTeamsAndPlayersToFirebase(teams: Team[]): Promise<boolean> {
  try {
    console.log('🔄 Starting teams and players sync to Firebase...');
    
    // Get existing teams and players from Firebase
    const existingTeams = await getTeamsFromFirebase();
    const existingPlayers = await getPlayersFromFirebase();
    
    const existingTeamIds = new Set(existingTeams.map(t => t.id));
    const existingPlayerIds = new Set(existingPlayers.map(p => p.id));
    
    let teamsAdded = 0;
    let playersAdded = 0;
    
    // Sync teams
    for (const team of teams) {
      if (!existingTeamIds.has(team.id)) {
        const teamId = await addTeamToFirebase(team);
        if (teamId) {
          teamsAdded++;
          console.log(`✅ Team ${team.name} added to Firebase`);
        }
      }
      
      // Sync players for this team
      for (const player of team.roster) {
        if (!existingPlayerIds.has(player.id)) {
          const playerId = await addPlayerToFirebase(player);
          if (playerId) {
            playersAdded++;
            console.log(`✅ Player ${player.name} added to Firebase`);
          }
        }
      }
    }
    
    console.log(`🎉 Teams and players sync completed: ${teamsAdded} teams, ${playersAdded} players added`);
    return true;
  } catch (error) {
    console.error('❌ Error syncing teams and players to Firebase:', error);
    return false;
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

// ==================== FOOD POSTS FUNCTIONS ====================

// Helper function to create unique key for food posts
function createFoodPostKey(post: Omit<FoodPost, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy' | 'comments'>): string {
  return `${post.authorId}-${post.title}-${Date.now()}`;
}

// Helper function to create unique key for food comments
function createFoodCommentKey(comment: Omit<FoodComment, 'id' | 'createdAt' | 'likes' | 'likedBy'>): string {
  return `${comment.postId}-${comment.author}-${Date.now()}`;
}

// Get all food posts from Firebase
export async function getFoodPostsFromFirebase(): Promise<FoodPost[]> {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.FOOD_POSTS), orderBy('createdAt', 'desc'))
    );
    
    const posts: FoodPost[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const post: FoodPost = {
        id: doc.id,
        title: data.title || '',
        content: data.content || '',
        author: data.author || '',
        authorTeam: data.authorTeam || '',
        authorId: data.authorId || '',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
        likes: data.likes || 0,
        likedBy: data.likedBy || [],
        comments: [], // Will be populated separately
        commentIds: data.comments || [],
        tags: data.tags || [],
        imageUrl: data.imageUrl || '',
        location: data.location || ''
      };
      posts.push(post);
    });
    
    return posts;
  } catch (error) {
    console.error('Error getting food posts from Firebase:', error);
    return [];
  }
}

// Add a new food post to Firebase
export async function addFoodPostToFirebase(post: Omit<FoodPost, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy' | 'comments'>): Promise<string | null> {
  try {
    const postData = {
      ...post,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      likedBy: [],
      comments: []
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.FOOD_POSTS), postData);
    console.log('Food post added to Firebase with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding food post to Firebase:', error);
    return null;
  }
}

// Update a food post in Firebase
export async function updateFoodPostInFirebase(postId: string, updates: Partial<FoodPost>): Promise<boolean> {
  try {
    const postRef = doc(db, COLLECTIONS.FOOD_POSTS, postId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(postRef, updateData);
    console.log('Food post updated in Firebase:', postId);
    return true;
  } catch (error) {
    console.error('Error updating food post in Firebase:', error);
    return false;
  }
}

// Delete a food post from Firebase
export async function deleteFoodPostFromFirebase(postId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.FOOD_POSTS, postId));
    console.log('Food post deleted from Firebase:', postId);
    return true;
  } catch (error) {
    console.error('Error deleting food post from Firebase:', error);
    return false;
  }
}

// Add a comment to a food post
export async function addFoodCommentToFirebase(postId: string, comment: Omit<FoodComment, 'id' | 'createdAt' | 'likes' | 'likedBy'>): Promise<string | null> {
  try {
    const commentData = {
      ...comment,
      createdAt: serverTimestamp(),
      likes: 0,
      likedBy: []
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.FOOD_COMMENTS), commentData);
    
    // Also update the post's commentIds array
    const postRef = doc(db, COLLECTIONS.FOOD_POSTS, postId);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const postData = postDoc.data();
      const updatedCommentIds = [...(postData.comments || []), docRef.id];
      await updateDoc(postRef, {
        comments: updatedCommentIds,
        updatedAt: serverTimestamp()
      });
    }
    
    console.log('Food comment added to Firebase with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding food comment to Firebase:', error);
    return null;
  }
}

// Like/unlike a food post
export async function likeFoodPostInFirebase(postId: string, userId: string): Promise<boolean> {
  try {
    const postRef = doc(db, COLLECTIONS.FOOD_POSTS, postId);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
      const postData = postDoc.data();
      const likedBy = postData.likedBy || [];
      const likes = postData.likes || 0;
      
      const index = likedBy.indexOf(userId);
      if (index === -1) {
        // Add like
        await updateDoc(postRef, {
          likedBy: [...likedBy, userId],
          likes: likes + 1,
          updatedAt: serverTimestamp()
        });
      } else {
        // Remove like
        const newLikedBy = likedBy.filter((id: string) => id !== userId);
        await updateDoc(postRef, {
          likedBy: newLikedBy,
          likes: likes - 1,
          updatedAt: serverTimestamp()
        });
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error liking food post in Firebase:', error);
    return false;
  }
}

// Like/unlike a food comment
export async function likeFoodCommentInFirebase(commentId: string, userId: string): Promise<boolean> {
  try {
    const commentRef = doc(db, COLLECTIONS.FOOD_COMMENTS, commentId);
    const commentDoc = await getDoc(commentRef);
    
    if (commentDoc.exists()) {
      const commentData = commentDoc.data();
      const likedBy = commentData.likedBy || [];
      const likes = commentData.likes || 0;
      
      const index = likedBy.indexOf(userId);
      if (index === -1) {
        // Add like
        await updateDoc(commentRef, {
          likedBy: [...likedBy, userId],
          likes: likes + 1
        });
      } else {
        // Remove like
        const newLikedBy = likedBy.filter((id: string) => id !== userId);
        await updateDoc(commentRef, {
          likedBy: newLikedBy,
          likes: likes - 1
        });
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error liking food comment in Firebase:', error);
    return false;
  }
}

// Subscribe to real-time updates for food posts
export function subscribeToFoodPosts(callback: (posts: FoodPost[]) => void): () => void {
  const q = query(collection(db, COLLECTIONS.FOOD_POSTS), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, async (querySnapshot) => {
    const posts: FoodPost[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      const post: FoodPost = {
        id: docSnapshot.id,
        title: data.title || '',
        content: data.content || '',
        author: data.author || '',
        authorTeam: data.authorTeam || '',
        authorId: data.authorId || '',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
        likes: data.likes || 0,
        likedBy: data.likedBy || [],
        comments: [], // Will be populated separately
        commentIds: data.comments || [],
        tags: data.tags || [],
        imageUrl: data.imageUrl || '',
        location: data.location || ''
      };
      
      // Get comments for this post
      if (post.commentIds && post.commentIds.length > 0) {
        const comments: FoodComment[] = [];
        for (const commentId of post.commentIds) {
          try {
            const commentDoc = await getDoc(doc(db, COLLECTIONS.FOOD_COMMENTS, commentId));
            if (commentDoc.exists()) {
              const commentData = commentDoc.data();
              comments.push({
                id: commentId,
                postId: post.id,
                author: commentData.author || '',
                authorTeam: commentData.authorTeam || '',
                content: commentData.content || '',
                createdAt: commentData.createdAt?.toDate?.()?.toISOString() || commentData.createdAt || new Date().toISOString(),
                likes: commentData.likes || 0,
                likedBy: commentData.likedBy || []
              });
            }
          } catch (error) {
            console.error('Error fetching comment:', error);
          }
        }
        post.comments = comments;
      }
      
      posts.push(post);
    }
    
    callback(posts);
  }, (error) => {
    console.error('Error in food posts subscription:', error);
  });
}
