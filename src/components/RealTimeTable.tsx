import React, { useState, useMemo } from 'react';
import { Play, Team, TipoDeJuego, TipoDeResultado } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface RealTimeTableProps {
  plays: Play[];
  homeTeam?: Team;
  awayTeam?: Team;
}

const RealTimeTable: React.FC<RealTimeTableProps> = ({ plays, homeTeam, awayTeam }) => {
  const [matches] = useLocalStorage<{ id: number, date: string }[]>("matches", []);
  const [selectedMatch, setSelectedMatch] = useState<number | 'all'>('all');
  const [selectedTeam, setSelectedTeam] = useState<number | 'all'>('all');
  const [selectedChico, setSelectedChico] = useState<string>('all');
  const [selectedTipoJuego, setSelectedTipoJuego] = useState<TipoDeJuego | 'all'>('all');
  const [selectedResultado, setSelectedResultado] = useState<TipoDeResultado | 'all'>('all');

  const filteredPlays = useMemo(() => {
    return plays.filter(play => {
      const matchMatch = selectedMatch === 'all' || play.matchId === selectedMatch;
      const teamMatch = selectedTeam === 'all' || play.teamId === selectedTeam;
      const chicoMatch = selectedChico === 'all' || play.chico === selectedChico;
      const tipoJuegoMatch = selectedTipoJuego === 'all' || play.tipoDeJuego === selectedTipoJuego;
      const resultadoMatch = selectedResultado === 'all' || play.resultado === selectedResultado;
      return matchMatch && teamMatch && chicoMatch && tipoJuegoMatch && resultadoMatch;
    });
  }, [plays, selectedMatch, selectedTeam, selectedChico, selectedTipoJuego, selectedResultado]);

  const uniqueChicos = useMemo(() => {
    const chicos = new Set(plays.map(play => play.chico));
    return Array.from(chicos).sort();
  }, [plays]);

  const stats = useMemo(() => {
    const teamStats: Record<number, { goles: number; tiros: number }> = {};
    
    // Initialize stats for all teams that appear in plays
    plays.forEach(play => {
      if (!teamStats[play.teamId]) {
        teamStats[play.teamId] = { goles: 0, tiros: 0 };
      }
    });

    filteredPlays.forEach(play => {
      if (teamStats[play.teamId]) {
        teamStats[play.teamId].tiros++;
        if (play.resultado === TipoDeResultado.Gol) {
          teamStats[play.teamId].goles++;
        }
      }
    });

    return teamStats;
  }, [filteredPlays, plays]);

  // Get unique teams from plays
  const teamsInPlays = useMemo(() => {
    const uniqueTeamIds = [...new Set(plays.map(play => play.teamId))];
    return uniqueTeamIds.map(teamId => ({
      id: teamId,
      name: homeTeam?.id === teamId ? homeTeam.name : awayTeam?.id === teamId ? awayTeam.name : `Team ${teamId}`,
      color: homeTeam?.id === teamId ? homeTeam.color : awayTeam?.id === teamId ? awayTeam.color : '#000000'
    }));
  }, [plays, homeTeam, awayTeam]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Real-Time Table</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Match
          </label>
          <select
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">All Matches</option>
            {matches.map(match => (
              <option key={match.id} value={match.id}>
                {new Date(match.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Team
          </label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">All Teams</option>
            {teamsInPlays.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Chico
          </label>
          <select
            value={selectedChico}
            onChange={(e) => setSelectedChico(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">All Chicos</option>
            {uniqueChicos.map(chico => (
              <option key={chico} value={chico}>{chico}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de Juego
          </label>
          <select
            value={selectedTipoJuego}
            onChange={(e) => setSelectedTipoJuego(e.target.value as TipoDeJuego | 'all')}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">All Types</option>
            {Object.values(TipoDeJuego).map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Resultado
          </label>
          <select
            value={selectedResultado}
            onChange={(e) => setSelectedResultado(e.target.value as TipoDeResultado | 'all')}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">All Results</option>
            {Object.values(TipoDeResultado).map(resultado => (
              <option key={resultado} value={resultado}>{resultado}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {teamsInPlays.map(team => (
          <div key={team.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <h3 className="font-bold" style={{ color: team.color }}>{team.name}</h3>
            <p>Goals: {stats[team.id]?.goles || 0}</p>
            <p>Shots: {stats[team.id]?.tiros || 0}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Minutes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Player</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Result</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Zone</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPlays.map((play) => {
              const team = teamsInPlays.find(t => t.id === play.teamId);
              return (
                <tr key={play.id}>
                  <td
                    className="px-6 py-4 whitespace-nowrap font-medium"
                    style={{ color: team?.color || '#000000' }}
                  >
                    {team?.name || `Team ${play.teamId}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{play.chico}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{play.minutes}'</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{play.jugador}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      play.tipoDeJuego === TipoDeJuego.Abierto
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {play.tipoDeJuego}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      play.resultado === TipoDeResultado.Gol
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {play.resultado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{play.zona}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RealTimeTable;