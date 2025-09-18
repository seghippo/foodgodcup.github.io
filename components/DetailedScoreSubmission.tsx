'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { teams, type Game, type Team, type MatchLine } from '@/lib/data';
import { isGameDateInFuture } from '@/lib/dateUtils';
import GameDateModifier from './GameDateModifier';

interface DetailedScoreSubmissionProps {
  game: Game;
  onScoreSubmit: (result: any) => void;
  onDateUpdate?: (gameId: string, newDate: string) => void;
}

interface MatchLineForm {
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

export default function DetailedScoreSubmission({ game, onScoreSubmit, onDateUpdate }: DetailedScoreSubmissionProps) {
  const { t, getTeamName, getPlayerName } = useLanguage();
  const [matchLines, setMatchLines] = useState<MatchLineForm[]>([
    {
      lineNumber: 1,
      matchType: 'doubles',
      homePlayers: ['', ''],
      awayPlayers: ['', ''],
      sets: [
        { setNumber: 1, homeScore: 0, awayScore: 0 }
      ]
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add error handling for game object
  if (!game || !game.id || !game.home || !game.away || !game.date) {
    console.error('Invalid game object passed to DetailedScoreSubmission:', game);
    return (
      <div className="card">
        <div className="text-center text-red-600">
          <p>Error: Invalid game data</p>
        </div>
      </div>
    );
  }

  const homeTeam = teams.find(t => t.id === game.home);
  const awayTeam = teams.find(t => t.id === game.away);
  
  if (!homeTeam || !awayTeam) {
    console.error('Teams not found for game:', {
      gameId: game.id,
      homeTeamId: game.home,
      awayTeamId: game.away,
      availableTeamIds: teams.map(t => t.id)
    });
    return (
      <div className="card">
        <div className="text-center text-red-600">
          <p>Error: Teams not found for this game</p>
        </div>
      </div>
    );
  }

  // Check if game is in the future
  let isFutureGame = false;
  try {
    isFutureGame = isGameDateInFuture(game.date);
  } catch (error) {
    console.error('Error checking if game is in future:', error);
    console.error('Game date:', game.date);
  }
  
  // If game is in the future, show date modifier instead of score submission
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

  const addMatchLine = () => {
    const newLineNumber = matchLines.length + 1;
    setMatchLines(prev => [...prev, {
      lineNumber: newLineNumber,
      matchType: 'doubles',
      homePlayers: ['', ''],
      awayPlayers: ['', ''],
      sets: [
        { setNumber: 1, homeScore: 0, awayScore: 0 }
      ]
    }]);
  };

  const removeMatchLine = (index: number) => {
    if (matchLines.length > 1) {
      setMatchLines(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateMatchLine = (index: number, field: keyof MatchLineForm, value: any) => {
    setMatchLines(prev => prev.map((line, i) => 
      i === index ? { ...line, [field]: value } : line
    ));
  };

  const updatePlayer = (lineIndex: number, team: 'home' | 'away', playerIndex: number, playerId: string) => {
    setMatchLines(prev => prev.map((line, i) => {
      if (i === lineIndex) {
        const newPlayers = [...line[`${team}Players`]];
        newPlayers[playerIndex] = playerId;
        return { ...line, [`${team}Players`]: newPlayers };
      }
      return line;
    }));
  };

  const addSet = (lineIndex: number) => {
    setMatchLines(prev => prev.map((line, i) => {
      if (i === lineIndex) {
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
    setMatchLines(prev => prev.map((line, i) => {
      if (i === lineIndex && line.sets.length > 1) {
        return {
          ...line,
          sets: line.sets.filter((_, sIndex) => sIndex !== setIndex)
        };
      }
      return line;
    }));
  };

  const updateSetScore = (lineIndex: number, setIndex: number, team: 'home' | 'away', score: number) => {
    setMatchLines(prev => prev.map((line, i) => {
      if (i === lineIndex) {
        const newSets = [...line.sets];
        newSets[setIndex] = { ...newSets[setIndex], [`${team}Score`]: score };
        return { ...line, sets: newSets };
      }
      return line;
    }));
  };

  const calculateLineWinner = (sets: { homeScore: number; awayScore: number }[]) => {
    let homeSets = 0;
    let awaySets = 0;
    
    sets.forEach(set => {
      if (set.homeScore > set.awayScore) homeSets++;
      else if (set.awayScore > set.homeScore) awaySets++;
    });
    
    return homeSets > awaySets ? 'home' : 'away';
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Calculate total team scores
      let homeTotalScore = 0;
      let awayTotalScore = 0;

      const processedMatchLines: MatchLine[] = matchLines.map(line => {
        const winner = calculateLineWinner(line.sets);
        const homeSets = line.sets.filter(set => set.homeScore > set.awayScore).length;
        const awaySets = line.sets.filter(set => set.awayScore > set.homeScore).length;
        
        if (winner === 'home') homeTotalScore++;
        else awayTotalScore++;

        return {
          id: `ML${Date.now()}_${line.lineNumber}`,
          lineNumber: line.lineNumber,
          matchType: line.matchType,
          homePlayers: line.homePlayers,
          awayPlayers: line.awayPlayers,
          sets: line.sets,
          winner,
          totalHomeSets: homeSets,
          totalAwaySets: awaySets
        };
      });

      const matchResult = {
        id: `MR${Date.now()}`,
        gameId: game.id,
        homeTeamId: game.home,
        awayTeamId: game.away,
        homeTotalScore,
        awayTotalScore,
        submittedBy: 'CAPTAIN_ID', // This would come from authentication
        submittedAt: new Date().toISOString(),
        status: 'approved' as const,
        matchLines: processedMatchLines
      };

      console.log('Submitting detailed match result:', matchResult);
      onScoreSubmit(matchResult);
      
      // Reset form
      setMatchLines([{
        lineNumber: 1,
        matchType: 'doubles',
        homePlayers: ['', ''],
        awayPlayers: ['', ''],
        sets: [{ setNumber: 1, homeScore: 0, awayScore: 0 }]
      }]);
      
      alert('Match scores submitted successfully!');
    } catch (error) {
      console.error('Error submitting scores:', error);
      alert('Error submitting scores. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">{t('schedule.submitDetailedScore')}</h3>
      
      {/* Game Info */}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <h4 className="font-semibold">{getTeamName(homeTeam)}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">vs</p>
            <h4 className="font-semibold">{getTeamName(awayTeam)}</h4>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {new Date(game.date).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Match Lines */}
      <div className="space-y-6">
        {matchLines.map((line, lineIndex) => (
          <div key={lineIndex} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">{t('schedule.matchLine')} {line.lineNumber}</h4>
              {matchLines.length > 1 && (
                <button
                  onClick={() => removeMatchLine(lineIndex)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  {t('common.remove')}
                </button>
              )}
            </div>

            {/* Match Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">{t('schedule.matchType')}</label>
              <select
                value={line.matchType}
                onChange={(e) => updateMatchLine(lineIndex, 'matchType', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
              >
                <option value="doubles">{t('schedule.doubles')}</option>
                <option value="singles">{t('schedule.singles')}</option>
              </select>
            </div>

            {/* Players */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Home Team Players */}
              <div>
                <label className="block text-sm font-medium mb-2">{getTeamName(homeTeam)} {t('schedule.players')}</label>
                <div className="space-y-2">
                  {line.homePlayers.map((playerId, playerIndex) => (
                    <select
                      key={playerIndex}
                      value={playerId}
                      onChange={(e) => updatePlayer(lineIndex, 'home', playerIndex, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
                    >
                      <option value="">{t('schedule.selectPlayer')}</option>
                      {homeTeam.roster.map(player => (
                        <option key={player.id} value={player.id}>
                          {player.id} - {getPlayerName(player)}
                        </option>
                      ))}
                    </select>
                  ))}
                  {line.matchType === 'doubles' && line.homePlayers.length < 2 && (
                    <button
                      onClick={() => {
                        const newPlayers = [...line.homePlayers, ''];
                        updateMatchLine(lineIndex, 'homePlayers', newPlayers);
                      }}
                      className="text-sm text-league-primary hover:text-league-primary-dark"
                    >
                      + {t('schedule.addPlayer')}
                    </button>
                  )}
                </div>
              </div>

              {/* Away Team Players */}
              <div>
                <label className="block text-sm font-medium mb-2">{getTeamName(awayTeam)} {t('schedule.players')}</label>
                <div className="space-y-2">
                  {line.awayPlayers.map((playerId, playerIndex) => (
                    <select
                      key={playerIndex}
                      value={playerId}
                      onChange={(e) => updatePlayer(lineIndex, 'away', playerIndex, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-league-primary focus:border-transparent"
                    >
                      <option value="">{t('schedule.selectPlayer')}</option>
                      {awayTeam.roster.map(player => (
                        <option key={player.id} value={player.id}>
                          {player.id} - {getPlayerName(player)}
                        </option>
                      ))}
                    </select>
                  ))}
                  {line.matchType === 'doubles' && line.awayPlayers.length < 2 && (
                    <button
                      onClick={() => {
                        const newPlayers = [...line.awayPlayers, ''];
                        updateMatchLine(lineIndex, 'awayPlayers', newPlayers);
                      }}
                      className="text-sm text-league-primary hover:text-league-primary-dark"
                    >
                      + {t('schedule.addPlayer')}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">{t('schedule.sets')}</label>
                <button
                  onClick={() => addSet(lineIndex)}
                  className="text-sm text-league-primary hover:text-league-primary-dark"
                >
                  + {t('schedule.addSet')}
                </button>
              </div>
              <div className="space-y-2">
                {line.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-8">{t('schedule.set')} {set.setNumber}:</span>
                    <input
                      type="number"
                      min="0"
                      value={set.homeScore}
                      onChange={(e) => updateSetScore(lineIndex, setIndex, 'home', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded"
                    />
                    <span className="text-sm">-</span>
                    <input
                      type="number"
                      min="0"
                      value={set.awayScore}
                      onChange={(e) => updateSetScore(lineIndex, setIndex, 'away', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded"
                    />
                    {line.sets.length > 1 && (
                      <button
                        onClick={() => removeSet(lineIndex, setIndex)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Add Match Line Button */}
        <button
          onClick={addMatchLine}
          className="w-full py-2 px-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-league-primary hover:text-league-primary transition-colors"
        >
          + {t('schedule.addMatchLine')}
        </button>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full mt-6 bg-league-primary hover:bg-league-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? t('schedule.submitting') : t('schedule.submitScore')}
      </button>
    </div>
  );
}

