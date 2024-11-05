import React, { useMemo, useState } from 'react';
import { Play, Team, Tournament } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import RealTimeTable from './RealTimeTable';

const MatchHistory: React.FC = () => {
  const [matches] = useLocalStorage<{ id: number; date: string }[]>('matches', []);
  const [plays] = useLocalStorage<Play[]>('plays', []);
  const [tournaments] = useLocalStorage<Tournament[]>('tournaments', []);
  const [selectedMatch, setSelectedMatch] = useState<number | 'all'>('all');

  // Get all teams from all tournaments with proper type checking
  const allTeams = useMemo(() => {
    return tournaments.reduce<Team[]>((acc, tournament) => {
      if (!tournament?.teams || !Array.isArray(tournament.teams)) {
        return acc;
      }
      return [...acc, ...tournament.teams];
    }, []);
  }, [tournaments]);

  // Find teams for each play
  const getTeamsForMatch = (matchId: number): { homeTeam?: Team; awayTeam?: Team } => {
    const matchPlays = plays.filter(play => play.matchId === matchId);
    if (matchPlays.length === 0) return {};

    const teamIds = [...new Set(matchPlays.map(play => play.teamId))];
    const matchTeams = teamIds
      .map(id => allTeams.find(team => team?.id === id))
      .filter((team): team is Team => team !== undefined);

    return {
      homeTeam: matchTeams[0],
      awayTeam: matchTeams[1]
    };
  };

  // Filter plays for the selected match
  const getMatchPlays = (matchId: number): Play[] => {
    return plays.filter(play => play.matchId === matchId);
  };

  const filteredMatches = useMemo(() => {
    return selectedMatch === 'all' ? matches : matches.filter(match => match.id === selectedMatch);
  }, [matches, selectedMatch]);

  if (matches.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">No Match History</h2>
          <p className="text-gray-600 dark:text-gray-400">No matches have been played yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-200">Match History</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Match
        </label>
        <select
          value={selectedMatch}
          onChange={(e) => setSelectedMatch(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="all">All Matches</option>
          {matches.map(match => {
            const { homeTeam, awayTeam } = getTeamsForMatch(match.id);
            return (
              <option key={match.id} value={match.id}>
                {new Date(match.date).toLocaleDateString() + " " + (homeTeam?.name || '') + " vs " + (awayTeam?.name || '')}
              </option>
            );
          })}
        </select>
      </div>
      <div className="space-y-8">
        {filteredMatches.map(match => {
          const { homeTeam, awayTeam } = getTeamsForMatch(match.id);
          const matchPlays = getMatchPlays(match.id);

          return (
            <div key={match.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Match - {new Date(match.date).toLocaleDateString()}
                </h2>
                {homeTeam && awayTeam && (
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {homeTeam.name} vs {awayTeam.name}
                  </p>
                )}
              </div>
              <div className="p-6">
                <RealTimeTable
                  plays={matchPlays}
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchHistory;