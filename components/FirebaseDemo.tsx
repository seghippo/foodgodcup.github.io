'use client';

import { useState, useEffect } from 'react';
import { syncToCloud, syncFromCloud, getCloudSyncInfo } from '@/lib/data';

export default function FirebaseDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [syncInfo, setSyncInfo] = useState<{ hasData: boolean; lastSync?: string; dataCount?: { games: number; results: number } }>({ hasData: false });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get initial sync info
    const info = getCloudSyncInfo();
    setSyncInfo(info);
  }, []);

  const handleSyncToFirebase = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const success = await syncToCloud('Demo User');
      if (success) {
        setMessage('✅ Data synced to Firebase successfully!');
        // Refresh sync info
        const info = getCloudSyncInfo();
        setSyncInfo(info);
      } else {
        setMessage('❌ Failed to sync to Firebase. Check console for errors.');
      }
    } catch (error) {
      setMessage('❌ Error syncing to Firebase: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncFromFirebase = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const success = await syncFromCloud('Demo User');
      if (success) {
        setMessage('✅ Data synced from Firebase successfully!');
        // Refresh sync info
        const info = getCloudSyncInfo();
        setSyncInfo(info);
      } else {
        setMessage('❌ Failed to sync from Firebase. Check console for errors.');
      }
    } catch (error) {
      setMessage('❌ Error syncing from Firebase: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        🔥 Firebase Cloud Sync Demo
      </h3>
      
      <div className="space-y-4">
        {/* Sync Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Sync Status</h4>
          <div className="text-sm text-gray-600">
            <p>Has Data: {syncInfo.hasData ? '✅ Yes' : '❌ No'}</p>
            {syncInfo.lastSync && (
              <p>Last Sync: {new Date(syncInfo.lastSync).toLocaleString()}</p>
            )}
            {syncInfo.dataCount && (
              <p>Games: {syncInfo.dataCount.games}, Results: {syncInfo.dataCount.results}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSyncToFirebase}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳ Syncing...' : '📤 Sync TO Firebase'}
          </button>
          
          <button
            onClick={handleSyncFromFirebase}
            disabled={isLoading}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳ Syncing...' : '📥 Sync FROM Firebase'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">📋 Setup Instructions</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">console.firebase.google.com</a></li>
            <li>Enable Firestore Database</li>
            <li>Copy your config to <code className="bg-blue-100 px-1 rounded">lib/firebase.ts</code></li>
            <li>Set Firestore rules to allow read/write (test mode)</li>
            <li>Test the sync buttons above!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
