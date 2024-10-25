import React, { useState, useCallback } from 'react';
import { Team } from '../types';

interface PreMatchConfigProps {
  teams: Team[];
  handleStartMatch: (homeTeam: Team, awayTeam: Team) => void;
}

const PreMatchConfig: React.FC<PreMatchConfigProps> = ({ teams, handleStartMatch }) => {
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);

  const handleHomeTeamChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const team = teams.find(team => team.id === Number(e.target.value)) || null;
    setHomeTeam(team);
  }, [teams]);

  const handleAwayTeamChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const team = teams.find(team => team.id === Number(e.target.value)) || null;
    setAwayTeam(team);
  }, [teams]);

  const startMatch = useCallback(() => {
    if (homeTeam && awayTeam) {
      handleStartMatch(homeTeam, awayTeam);
    }
  }, [homeTeam, awayTeam, handleStartMatch]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Pre-Match Configuration</h2>
      <div className="mb-4">
        <label className="block mb-2">Home Team</label>
        <select
          value={homeTeam?.id || ''}
          onChange={handleHomeTeamChange}
          className="p-2 border rounded w-full"
        >
          <option value="">Select Home Team</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Away Team</label>
        <select
          value={awayTeam?.id || ''}
          onChange={handleAwayTeamChange}
          className="p-2 border rounded w-full"
        >
          <option value="">Select Away Team</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>
      <button
        onClick={startMatch}
        disabled={!homeTeam || !awayTeam}
        className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Start Match
      </button>
    </div>
  );
};

export default PreMatchConfig;