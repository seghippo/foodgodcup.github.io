'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language';
import { teams, matchResults, schedule, type MatchResult, type MatchLine } from '@/lib/data';
import { isGameDateInFuture } from '@/lib/dateUtils';
import GameDateModifier from './GameDateModifier';

interface ScoreModificationProps {
  gameId: string;
  onScoreUpdate: (result: MatchResult) => void;
  onDateUpdate?: (gameId: string, newDate: string) => void;
}

interface MatchLineForm {
  id: string;
  lineNumber: number;
  matchType: 'doubles' | 'singles';
  homePlayers: string[];
  awayPlayers: string[];
  sets: {
    setNumber: number;
    homeScore: number;
    awayScore: number;
  }[];
}

export default function ScoreModification({ gameId, onScoreUpdate, onDateUpdate }: ScoreModificationProps) {
  const { t, getTeamName, getPlayerName } = useLanguage();
  const [matchLines, setMatchLines] = useState<MatchLineForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Find the existing match result
  const existingResult = matchResults.find(mr => mr.gameId === gameId);
  
  useEffect(() => {
    if (existingResult) {
      // Convert existing match lines to form format
      const formLines: MatchLineForm[] = existingResult.matchLines.map(line => ({
        id: line.id,
        lineNumber: line.lineNumber,
        matchType: line.matchType,
        homePlayers: line.homePlayers,
        awayPlayers: line.awayPlayers,
        sets: line.sets.map(set => ({
          setNumber: set.setNumber,
          homeScore: set.homeScore,
          awayScore: set.awayScore
        }))
      }));
      setMatchLines(formLines);
    }
  }, [existingResult]);

  if (!existingResult) {
    return (
      <div className="card">
        <div className="text-center text-slate-600 dark:text-slate-400">
          {t('captain.noExistingResult')}
        </div>
      </div>
    );
  }

  // Find the game to check its date
  const game = schedule.find(g => g.id === gameId);
  if (!game) return null;

  // Check if game is in the future
  const isFutureGame = isGameDateInFuture(game.date);
  
  // If game is in the future, show date modifier instead of score modification
  if (isFutureGame) {
    return (
      <div className="space-y-4">
        <GameDateModifier 
          game={game} 
          onDateUpdate={onDateUpdate || (() => {})} 
        />
        <div className="card">
          <div className="text-center text-slate-600 dark:text-slate-400">
            <p className="mb-2">{t('captain.futureGameWarning')}</p>
            <p className="text-sm">{t('captain.scoresResetWarning')}</p>
          </div>
        </div>
      </div>
    );
  }

  const homeTeam = teams.find(t => t.id === existingResult.homeTeamId);
  const awayTeam = teams.find(t => t.id === existingResult.awayTeamId);
  
  if (!homeTeam || !awayTeam) return null;

  const addSet = (lineIndex: number) => {
    setMatchLines(prev => prev.map((line, index) => {
      if (index === lineIndex) {
        const newSetNumber = line.sets.length + 1;
        return {
          ...line,
          sets: [...line.sets, { setNumber: newSetNumber, homeScore: 0, awayScore: 0 }]
        };
      }
      return line;
    }));
  };

  const removeSet = (lineIndex: number, setIndex: number) => {
    setMatchLines(prev => prev.map((line, index) => {
      if (index === lineIndex) {
        return {
          ...line,
          sets: line.sets.filter((_, i) => i !== setIndex)
        };
      }
      return line;
    }));
  };

  const updateSetScore = (lineIndex: number, setIndex: number, field: 'homeScore' | 'awayScore', value: number) => {
    setMatchLines(prev => prev.map((line, index) => {
      if (index === lineIndex) {
        return {
          ...line,
          sets: line.sets.map((set, i) => {
            if (i === setIndex) {
              return { ...set, [field]: value };
            }
            return set;
          })
        };
      }
      return line;
    }));
  };

  const updatePlayer = (lineIndex: number, team: 'home' | 'away', playerIndex: number, playerId: string) => {
    setMatchLines(prev => prev.map((line, index) => {
      if (index === lineIndex) {
        const newLine = { ...line };
        if (team === 'home') {
          newLine.homePlayers = [...line.homePlayers];
          newLine.homePlayers[playerIndex] = playerId;
        } else {
          newLine.awayPlayers = [...line.awayPlayers];
          newLine.awayPlayers[playerIndex] = playerId;
        }
        return newLine;
      }
      return line;
    }));
  };

  const calculateLineWinner = (line: MatchLineForm): 'home' | 'away' | null => {
    if (line.sets.length === 0) return null;
    
    let homeSets = 0;
    let awaySets = 0;
    
    line.sets.forEach(set => {
      if (set.homeScore > set.awayScore) homeSets++;
      else if (set.awayScore > set.homeScore) awaySets++;
    });
    
    if (homeSets > awaySets) return 'home';
    if (awaySets > homeSets) return 'away';
    return null;
  };

  const calculateTotalScores = () => {
    let homeTotal = 0;
    let awayTotal = 0;
    
    matchLines.forEach(line => {
      const winner = calculateLineWinner(line);
      if (winner === 'home') homeTotal++;
      else if (winner === 'away') awayTotal++;
    });
    
    return { homeTotal, awayTotal };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const { homeTotal, awayTotal } = calculateTotalScores();
      
      const updatedResult: MatchResult = {
        ...existingResult,
        homeTotalScore: homeTotal,
        awayTotalScore: awayTotal,
        matchLines: matchLines.map(line => {
          const winner = calculateLineWinner(line);
          return {
            id: line.id,
            lineNumber: line.lineNumber,
            matchType: line.matchType,
            homePlayers: line.homePlayers,
            awayPlayers: line.awayPlayers,
            sets: line.sets,
            winner: winner || 'home', // Default to 'home' if no clear winner (shouldn't happen in practice)
            totalHomeSets: line.sets.filter(s => s.homeScore > s.awayScore).length,
            totalAwaySets: line.sets.filter(s => s.awayScore > s.homeScore).length
          };
        }),
        submittedAt: new Date().toISOString(),
        status: 'pending' // Reset to pending for re-approval
      };
      
      onScoreUpdate(updatedResult);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating scores:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {t('captain.modifyScores')} - {getTeamName(homeTeam)} vs {getTeamName(awayTeam)}
        </h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {t('captain.editScores')}
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {t('captain.cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {isSubmitting ? t('captain.submitting') : t('captain.saveChanges')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Current Total Score Display */}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">
            {getTeamName(homeTeam)} {calculateTotalScores().homeTotal} - {calculateTotalScores().awayTotal} {getTeamName(awayTeam)}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t('captain.totalScore')}
          </div>
        </div>
      </div>

      {/* Match Lines */}
      <div className="space-y-6">
        {matchLines.map((line, lineIndex) => (
          <div key={line.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {t('captain.line')} {line.lineNumber} - {t(`captain.${line.matchType}`)}
              </h3>
              {isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={() => addSet(lineIndex)}
                    className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded transition-colors"
                  >
                    {t('captain.addSet')}
                  </button>
                </div>
              )}
            </div>

            {/* Players */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Home Team Players */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {getTeamName(homeTeam)} {t('captain.players')}
                </label>
                <div className="space-y-2">
                  {line.homePlayers.map((playerId, playerIndex) => (
                    <div key={playerIndex}>
                      {isEditing ? (
                        <select
                          value={playerId}
                          onChange={(e) => updatePlayer(lineIndex, 'home', playerIndex, e.target.value)}
                          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                        >
                          <option value="">{t('captain.selectPlayer')}</option>
                          {homeTeam.roster.map(player => (
                            <option key={player.id} value={player.id}>
                              {getPlayerName(player)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                          {playerId ? getPlayerName(homeTeam.roster.find(p => p.id === playerId)!) : t('captain.noPlayer')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Away Team Players */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {getTeamName(awayTeam)} {t('captain.players')}
                </label>
                <div className="space-y-2">
                  {line.awayPlayers.map((playerId, playerIndex) => (
                    <div key={playerIndex}>
                      {isEditing ? (
                        <select
                          value={playerId}
                          onChange={(e) => updatePlayer(lineIndex, 'away', playerIndex, e.target.value)}
                          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                        >
                          <option value="">{t('captain.selectPlayer')}</option>
                          {awayTeam.roster.map(player => (
                            <option key={player.id} value={player.id}>
                              {getPlayerName(player)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                          {playerId ? getPlayerName(awayTeam.roster.find(p => p.id === playerId)!) : t('captain.noPlayer')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sets */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('captain.sets')}</label>
              <div className="space-y-2">
                {line.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center gap-4">
                    <span className="text-sm font-medium w-16">{t('captain.set')} {set.setNumber}:</span>
                    
                    {isEditing ? (
                      <>
                        <input
                          type="number"
                          min="0"
                          max="7"
                          value={set.homeScore}
                          onChange={(e) => updateSetScore(lineIndex, setIndex, 'homeScore', parseInt(e.target.value) || 0)}
                          className="w-16 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-center"
                        />
                        <span className="text-slate-600 dark:text-slate-400">-</span>
                        <input
                          type="number"
                          min="0"
                          max="7"
                          value={set.awayScore}
                          onChange={(e) => updateSetScore(lineIndex, setIndex, 'awayScore', parseInt(e.target.value) || 0)}
                          className="w-16 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-center"
                        />
                        {line.sets.length > 1 && (
                          <button
                            onClick={() => removeSet(lineIndex, setIndex)}
                            className="px-2 py-1 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded transition-colors"
                          >
                            {t('captain.remove')}
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="w-16 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-center">
                          {set.homeScore}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">-</span>
                        <span className="w-16 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-center">
                          {set.awayScore}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Line Winner */}
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="text-sm">
                <span className="font-medium">{t('captain.lineWinner')}: </span>
                <span className={`font-semibold ${
                  calculateLineWinner(line) === 'home' 
                    ? 'text-green-600 dark:text-green-400' 
                    : calculateLineWinner(line) === 'away'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {calculateLineWinner(line) === 'home' 
                    ? getTeamName(homeTeam)
                    : calculateLineWinner(line) === 'away'
                    ? getTeamName(awayTeam)
                    : t('captain.noWinner')
                  }
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
