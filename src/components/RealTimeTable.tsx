import React from 'react';
import { Play, Team } from '../types';

interface RealTimeTableProps {
  plays: Play[];
  homeTeam: Team;
  awayTeam: Team;
}

const RealTimeTable: React.FC<RealTimeTableProps> = ({
  plays,
  homeTeam,
  awayTeam,
}) => {
  const columns = [
    { key: 'team', label: 'Equipo' },
    { key: 'chico', label: 'Chico' },
    { key: 'jugador', label: 'Jugador' },
    { key: 'tipoDeJuego', label: 'Tipo de juego' },
    { key: 'resultado', label: 'Resultado' },
    { key: 'zona', label: 'Zona' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Estadísticas</h2>
        
        <div className="flex gap-4 mb-6">
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: homeTeam.color }}
            ></div>
            <span className="font-medium">{homeTeam.name}</span>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: awayTeam.color }}
            ></div>
            <span className="font-medium">{awayTeam.name}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map(column => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {plays.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No hay jugadas registradas
                  </td>
                </tr>
              ) : (
                plays.map((play, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap font-medium"
                      style={{
                        color: play.teamId === homeTeam.id ? homeTeam.color : awayTeam.color
                      }}
                    >
                      {play.teamId === homeTeam.id ? homeTeam.name : awayTeam.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{play.chico}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{play.jugador}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        play.tipoDeJuego === 'abierto'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {play.tipoDeJuego}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        play.resultado === 'gol'
                          ? 'bg-green-100 text-green-800'
                          : play.resultado === 'atajado'
                          ? 'bg-yellow-100 text-yellow-800'
                          : play.resultado === 'desviado'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {play.resultado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Zona {play.zona}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RealTimeTable;