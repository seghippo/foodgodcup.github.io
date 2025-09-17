'use client';

import { useState } from 'react';
import { addGameToSchedule, addMatchResult } from '@/lib/data';

export default function CaptainSyncTest() {
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');

  const createTestGame = async () => {
    setIsCreating(true);
    setMessage('');
    
    try {
      // Create a test game
      const testGame = {
        id: `TEST-${Date.now()}`,
        date: new Date().toISOString(),
        home: 'TJG',
        away: 'FJT', 
        venue: 'Test Venue',
        time: '7:00 PM',
        homeScore: 0,
        awayScore: 0,
        isPreseason: false,
        status: 'scheduled' as const
      };
      
      const createdGame = await addGameToSchedule(testGame);
      setMessage(`✅ Test game created with ID: ${createdGame.id}! Check the schedule page to see it.`);
      
    } catch (error) {
      setMessage('❌ Error creating test game: ' + (error as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  const createTestResult = async () => {
    setIsCreating(true);
    setMessage('');
    
    try {
      // Create a test match result
      const testResult = {
        id: `MR-TEST-${Date.now()}`,
        gameId: 'TEST-GAME',
        homeTeamId: 'TJG',
        awayTeamId: 'FJT',
        homeTotalScore: 3,
        awayTotalScore: 2,
        submittedBy: 'Test Captain',
        submittedAt: new Date().toISOString(),
        status: 'approved' as const,
        matchLines: [
          {
            id: 'ML1',
            lineNumber: 1,
            matchType: 'doubles' as const,
            homePlayers: ['P1', 'P2'],
            awayPlayers: ['P3', 'P4'],
            sets: [
              { setNumber: 1, homeScore: 6, awayScore: 4 },
              { setNumber: 2, homeScore: 4, awayScore: 6 },
              { setNumber: 3, homeScore: 6, awayScore: 2 }
            ],
            winner: 'home' as const,
            totalHomeSets: 2,
            totalAwaySets: 1
          }
        ]
      };
      
      const createdResult = await addMatchResult(testResult);
      setMessage(`✅ Test result created with ID: ${createdResult.id}! Check the standings page to see it.`);
      
    } catch (error) {
      setMessage('❌ Error creating test result: ' + (error as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
      <h3 className="text-lg font-semibold mb-4 text-green-800">
        🧪 Captain-to-Everyone Sync Test
      </h3>
      
      <div className="space-y-4">
        <p className="text-green-700 text-sm">
          This tests the core functionality: <strong>when a captain submits data, everyone can see it</strong>.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={createTestGame}
            disabled={isCreating}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? '⏳ Creating...' : '🎾 Create Test Game'}
          </button>
          
          <button
            onClick={createTestResult}
            disabled={isCreating}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? '⏳ Creating...' : '📊 Create Test Result'}
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.includes('✅') 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">📋 Test Steps:</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Click &ldquo;Create Test Game&rdquo; above</li>
            <li>Go to <strong>Schedule page</strong> - you should see the new game</li>
            <li>Click &ldquo;Create Test Result&rdquo; above</li>
            <li>Go to <strong>Standings page</strong> - you should see the new result</li>
            <li>This proves captain submissions are visible to everyone!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
