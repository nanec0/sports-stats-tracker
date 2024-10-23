import React from 'react';
import { Play, Team } from '../types';

interface RealTimeTableProps {
  plays: Play[];
  homeTeam: Team;
  awayTeam: Team;
  homeColor: string;
  awayColor: string;
}

const RealTimeTable: React.FC<RealTimeTableProps> = ({ plays, homeTeam, awayTeam, homeColor, awayColor }) => {
  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4">Real-Time Table</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Team</th>
              <th className="p-2">Chico</th>
              <th className="p-2">Jugador</th>
              <th className="p-2">Tipo de juego</th>
              <th className="p-2">Resultado</th>
              <th className="p-2">Zona</th>
            </tr>
          </thead>
          <tbody>
            {plays.map((play, index) => (
              <tr key={index}>
                <td style={{ color: play.teamId === homeTeam.id ? homeColor : awayColor }}>
                  {play.teamId === homeTeam.id ? homeTeam.name : awayTeam.name}
                </td>
                <td className="p-2">{play.chico}</td>
                <td className="p-2">{play.jugador}</td>
                <td className="p-2">{play.tipoDeJuego}</td>
                <td className="p-2">{play.resultado}</td>
                <td className="p-2">{play.zona}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RealTimeTable;