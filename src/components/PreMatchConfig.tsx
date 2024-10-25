import React, { useState, useCallback } from 'react';
import { Team, Tournament } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface PreMatchConfigProps {
  onStartMatch: (homeTeam: Team, awayTeam: Team) => void;
}

const PreMatchConfig: React.FC<PreMatchConfigProps> = ({ onStartMatch }) => {
  const [tournaments] = useLocalStorage<Tournament[]>('tournaments', []);
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | ''>('');
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);

  const selectedTournament = tournaments.find(t => t.id === selectedTournamentId);
  const availableTeams = selectedTournament?.teams || [];

  const handleHomeTeamChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const team = availableTeams.find(team => team.id === Number(e.target.value)) || null;
    setHomeTeam(team);
  }, [availableTeams]);

  const handleAwayTeamChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const team = availableTeams.find(team => team.id === Number(e.target.value)) || null;
    setAwayTeam(team);
  }, [availableTeams]);

  const startMatch = useCallback(() => {
    if (homeTeam && awayTeam) {
      onStartMatch(homeTeam, awayTeam);
    }
  }, [homeTeam, awayTeam, onStartMatch]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pre-Match Configuration</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tournament</label>
          <select
            value={selectedTournamentId}
            onChange={(e) => setSelectedTournamentId(Number(e.target.value))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Tournament</option>
            {tournaments.map(tournament => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name}
              </option>
            ))}
          </select>
        </div>

        {selectedTournament && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Home Team</label>
              <select
                value={homeTeam?.id || ''}
                onChange={handleHomeTeamChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Home Team</option>
                {availableTeams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Away Team</label>
              <select
                value={awayTeam?.id || ''}
                onChange={handleAwayTeamChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Away Team</option>
                {availableTeams
                  .filter(team => team.id !== homeTeam?.id)
                  .map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
              </select>
            </div>

            <button
              onClick={startMatch}
              disabled={!homeTeam || !awayTeam}
              className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Start Match
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PreMatchConfig;