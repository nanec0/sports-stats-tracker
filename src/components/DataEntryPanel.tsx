import React, { useState, useEffect } from 'react';
import { Play, Player, DataEntryPanelProps } from '../types';

const DataEntryPanel: React.FC<DataEntryPanelProps> = ({
  addPlay,
  selectedZone,
  setSelectedZone,
  isMobile,
  activeTeam,
  teamColor,
  onTeamSwitch,
}) => {
  const [chico, setChico] = useState('');
  const [jugador, setJugador] = useState('');
  const [tipoDeJuego, setTipoDeJuego] = useState<'abierto' | 'parado'>('abierto');
  const [resultado, setResultado] = useState<'gol' | 'atajado' | 'desviado' | 'bloqueado'>('gol');
  const [minutes, setMinutes] = useState<number | ''>('');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (selectedZone) {
      const zoneNumber = parseInt(selectedZone);
      const isDefensiveZone = zoneNumber <= 3;
      const isOffensiveZone = zoneNumber >= 10;
      setShowWarning(isDefensiveZone || isOffensiveZone);
    } else {
      setShowWarning(false);
    }
  }, [selectedZone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedZone && activeTeam) {
      const play: Play = {
        teamId: activeTeam.id,
        chico: chico,
        jugador: jugador,
        tipoDeJuego: tipoDeJuego,
        resultado: resultado,
        zona: selectedZone || ''
      };

      addPlay(play);
      resetForm();
    }
  };

  const resetForm = () => {
    setChico('');
    setJugador('');
    setTipoDeJuego('abierto');
    setResultado('gol');
    setSelectedZone('');
    setShowWarning(false);
    setMinutes('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow" style={{ backgroundColor: `${teamColor}20` }}>
      <h2 className="text-xl font-bold mb-4">Data Entry - {activeTeam ? activeTeam.name : 'No Team Selected'}</h2>
      {showWarning && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Warning</p>
          <p>You've selected a {parseInt(selectedZone!) <= 3 ? 'defensive' : 'offensive'} zone. Please confirm this is correct.</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="chico" className="block mb-1">Chico</label>
          <select
            id="chico"
            value={chico}
            onChange={(e) => setChico(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Chico</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div>
          <label htmlFor="jugador" className="block mb-1">Jugador</label>
          <select
            id="jugador"
            value={jugador}
            onChange={(e) => setJugador(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Player</option>
            {activeTeam?.players.map((player: Player) => (
              <option key={player.id} value={player.name}>{player.name} (#{player.number})</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tipoDeJuego" className="block mb-1">Tipo de juego</label>
          <select
            id="tipoDeJuego"
            value={tipoDeJuego}
            onChange={(e) => setTipoDeJuego(e.target.value as 'abierto' | 'parado')}
            className="w-full p-2 border rounded"
            required
          >
            <option value="abierto">Abierto</option>
            <option value="parado">Parado</option>
          </select>
        </div>
        <div>
          <label htmlFor="resultado" className="block mb-1">Resultado</label>
          <select
            id="resultado"
            value={resultado}
            onChange={(e) => setResultado(e.target.value as 'gol' | 'atajado' | 'desviado' | 'bloqueado')}
            className="w-full p-2 border rounded"
            required
          >
            <option value="gol">Gol</option>
            <option value="atajado">Atajado</option>
            <option value="desviado">Desviado</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
        </div>
        <div>
          <label htmlFor="minutes" className="block mb-1">Minute of the Game</label>
          <input
            type="number"
            id="minutes"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {isMobile && (
          <div>
            <label htmlFor="zona" className="block mb-1">Zona</label>
            <select
              id="zona"
              value={selectedZone || ''}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Zone</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="zona" className="block mb-1">Zona</label>
          <input
            type="text"
            id="zona"
            value={selectedZone || ''}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>
        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex-grow">
            Add Play
          </button>
          <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400">
            Clear
          </button>
          <button type="button" onClick={onTeamSwitch} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Switch Team
          </button>
        </div>
      </div>
    </form>
  );
};

export default DataEntryPanel;
