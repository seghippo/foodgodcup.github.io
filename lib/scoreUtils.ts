import { teams, standings, type MatchResult, type Standing, type Player } from './data';

// Function to update team standings based on match results
export function updateTeamStandings(matchResults: MatchResult[]): Standing[] {
  const newStandings = standings.map(standing => ({ ...standing }));

  matchResults
    .filter(result => result.status === 'approved')
    .forEach(result => {
      const homeTeamIndex = newStandings.findIndex(s => s.teamId === result.homeTeamId);
      const awayTeamIndex = newStandings.findIndex(s => s.teamId === result.awayTeamId);

      if (homeTeamIndex !== -1 && awayTeamIndex !== -1) {
        if (result.homeTotalScore > result.awayTotalScore) {
          // Home team wins
          newStandings[homeTeamIndex].wins += 1;
          newStandings[awayTeamIndex].losses += 1;
          newStandings[homeTeamIndex].points += 3;
        } else if (result.awayTotalScore > result.homeTotalScore) {
          // Away team wins
          newStandings[awayTeamIndex].wins += 1;
          newStandings[homeTeamIndex].losses += 1;
          newStandings[awayTeamIndex].points += 3;
        } else {
          // Draw
          newStandings[homeTeamIndex].draws += 1;
          newStandings[awayTeamIndex].draws += 1;
          newStandings[homeTeamIndex].points += 1;
          newStandings[awayTeamIndex].points += 1;
        }
      }
    });

  return newStandings;
}

// Function to update player stats based on match results
export function updatePlayerStats(matchResults: MatchResult[]): Player[] {
  const updatedTeams = teams.map(team => ({
    ...team,
    roster: team.roster.map(player => ({ ...player }))
  }));

  matchResults
    .filter(result => result.status === 'approved')
    .forEach(result => {
      result.matchLines.forEach(matchLine => {
        // Update home team player stats
        matchLine.homePlayers.forEach(playerId => {
          const team = updatedTeams.find(t => t.id === result.homeTeamId);
          if (team) {
            const player = team.roster.find(p => p.id === playerId);
            if (player) {
              if (matchLine.winner === 'home') {
                player.wins += 1;
              } else {
                player.losses += 1;
              }
            }
          }
        });

        // Update away team player stats
        matchLine.awayPlayers.forEach(playerId => {
          const team = updatedTeams.find(t => t.id === result.awayTeamId);
          if (team) {
            const player = team.roster.find(p => p.id === playerId);
            if (player) {
              if (matchLine.winner === 'away') {
                player.wins += 1;
              } else {
                player.losses += 1;
              }
            }
          }
        });
      });
    });

  return updatedTeams.flatMap(team => team.roster);
}

// Function to validate score submission
export function validateScoreSubmission(
  homeScore: number,
  awayScore: number,
  homeTeamStats: {playerId: string, wins: number, losses: number}[],
  awayTeamStats: {playerId: string, wins: number, losses: number}[]
): {isValid: boolean, errors: string[]} {
  const errors: string[] = [];

  // Check if scores are valid numbers
  if (homeScore < 0 || awayScore < 0) {
    errors.push('Scores cannot be negative');
  }

  // Check if at least one team has a score > 0
  if (homeScore === 0 && awayScore === 0) {
    errors.push('At least one team must have a score greater than 0');
  }

  // Check if player stats are valid
  homeTeamStats.forEach(stat => {
    if (stat.wins < 0 || stat.losses < 0) {
      errors.push(`Invalid stats for player ${stat.playerId}: wins and losses cannot be negative`);
    }
  });

  awayTeamStats.forEach(stat => {
    if (stat.wins < 0 || stat.losses < 0) {
      errors.push(`Invalid stats for player ${stat.playerId}: wins and losses cannot be negative`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Function to get team standings sorted by points
export function getSortedStandings(standings: Standing[]): Standing[] {
  return [...standings].sort((a, b) => {
    // Sort by points (descending)
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // If points are equal, sort by wins (descending)
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }
    // If wins are equal, sort by losses (ascending)
    return a.losses - b.losses;
  });
}

// Function to get player leaderboard
export function getPlayerLeaderboard(players: Player[]): Player[] {
  return [...players]
    .filter(player => player.wins > 0 || player.losses > 0) // Only players with games
    .sort((a, b) => {
      // Sort by win percentage
      const aWinRate = a.wins / (a.wins + a.losses);
      const bWinRate = b.wins / (b.wins + b.losses);
      
      if (bWinRate !== aWinRate) {
        return bWinRate - aWinRate;
      }
      
      // If win rates are equal, sort by total wins
      return b.wins - a.wins;
    });
}
