import React, { useState, useEffect } from 'react';
import { Play, Player, DataEntryPanelProps } from '../types';

const DataEntryPanel: React.FC<DataEntryPanelProps> = ({
  addPlay,
  selectedZone,
  setSelectedZone,
  isMobile,
  activeTeam,
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

  const formFields = [
    {
      id: 'chico',
      label: 'Chico',
      type: 'select',
      value: chico,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setChico(e.target.value),
      options: [
        { value: '', label: 'Select Chico' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
      ],
      required: true,
    },
    {
      id: 'jugador',
      label: 'Jugador',
      type: 'select',
      value: jugador,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setJugador(e.target.value),
      options: [
        { value: '', label: 'Select Player' },
        ...(activeTeam?.players.map((player: Player) => ({
          value: player.name,
          label: `${player.name} (#${player.number})`,
        })) || []),
      ],
      required: true,
    },
    {
      id: 'tipoDeJuego',
      label: 'Tipo de juego',
      type: 'select',
      value: tipoDeJuego,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setTipoDeJuego(e.target.value as 'abierto' | 'parado'),
      options: [
        { value: 'abierto', label: 'Abierto' },
        { value: 'parado', label: 'Parado' },
      ],
      required: true,
    },
    {
      id: 'resultado',
      label: 'Resultado',
      type: 'select',
      value: resultado,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setResultado(e.target.value as 'gol' | 'atajado' | 'desviado' | 'bloqueado'),
      options: [
        { value: 'gol', label: 'Gol' },
        { value: 'atajado', label: 'Atajado' },
        { value: 'desviado', label: 'Desviado' },
        { value: 'bloqueado', label: 'Bloqueado' },
      ],
      required: true,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg" style={{ backgroundColor: `${activeTeam?.color}` }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Data Entry - {activeTeam ? activeTeam.name : 'No Team Selected'}
        </h2>
        <button
          type="button"
          onClick={onTeamSwitch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Switch Team
        </button>
      </div>

      {showWarning && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You've selected a {parseInt(selectedZone!) <= 3 ? 'defensive' : 'offensive'} zone. Please confirm this is correct.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {formFields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <select
              id={field.id}
              value={field.value}
              onChange={field.onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required={field.required}
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div>
          <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-1">
            Minute of the Game
          </label>
          <input
            type="number"
            id="minutes"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="90"
            required
          />
        </div>

        {isMobile && (
          <div>
            <label htmlFor="zona" className="block text-sm font-medium text-gray-700 mb-1">
              Zone
            </label>
            <select
              id="zona"
              value={selectedZone || ''}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <label htmlFor="selectedZone" className="block text-sm font-medium text-gray-700 mb-1">
            Selected Zone
          </label>
          <input
            type="text"
            id="selectedZone"
            value={selectedZone || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
            readOnly
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={!selectedZone || !activeTeam}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add Play
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default DataEntryPanel;