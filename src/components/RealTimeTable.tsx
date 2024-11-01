import React from 'react';
import { Play, Team } from '../types';

interface RealTimeTableProps {
  plays: Play[];
  homeTeam: Team;
  awayTeam: Team;
}

const RealTimeTable: React.FC<RealTimeTableProps> = ({ plays, homeTeam, awayTeam }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Real-Time Table</h2>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Team</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chico</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Minutes</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Player</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {plays.map((play, index) => (
            <tr key={index}>
              <td
                className="px-6 py-4 whitespace-nowrap font-medium"
                style={{
                  color: play.teamId === homeTeam.id ? homeTeam.color : awayTeam.color
                }}
              >
                {play.teamId === homeTeam.id ? homeTeam.name : awayTeam.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{play.chico}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{play.minutes}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-200">{play.jugador}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  play.tipoDeJuego === 'abierto'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {play.tipoDeJuego}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RealTimeTable;