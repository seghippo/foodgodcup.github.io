'use client';

import { useState } from 'react';
import { clearAllGamesFromFirebase } from '@/lib/firebase-data';

export default function FirebaseCleanup() {
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState('');

  const clearFirebaseData = async () => {
    setIsClearing(true);
    setMessage('');
    
    try {
      const success = await clearAllGamesFromFirebase();
      if (success) {
        setMessage('✅ All games cleared from Firebase! The schedule should now be clean.');
      } else {
        setMessage('❌ Failed to clear games from Firebase. Check console for errors.');
      }
    } catch (error) {
      setMessage('❌ Error clearing Firebase data: ' + (error as Error).message);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-red-50 p-6 rounded-lg border border-red-200">
      <h3 className="text-lg font-semibold mb-4 text-red-800">
        🧹 Firebase Cleanup Tool
      </h3>
      
      <div className="space-y-4">
        <p className="text-red-700 text-sm">
          <strong>Warning:</strong> This will delete ALL games from Firebase. Use this to clean up duplicate or unwanted games.
        </p>
        
        <button
          onClick={clearFirebaseData}
          disabled={isClearing}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isClearing ? '⏳ Clearing...' : '🗑️ Clear All Games from Firebase'}
        </button>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes('✅') 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-2">📋 What This Does:</h4>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>Deletes ALL games from Firebase database</li>
            <li>Removes duplicate preseason games</li>
            <li>Gives you a clean slate to start fresh</li>
            <li>After clearing, sync your local data to Firebase</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
