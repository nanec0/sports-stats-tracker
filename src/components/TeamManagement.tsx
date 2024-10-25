import React, { useState, useCallback } from 'react';
import { Team, Player } from '../types';

interface TeamManagementProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ teams, setTeams }) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerNumber, setNewPlayerNumber] = useState('');
  const [newPlayerPosition, setNewPlayerPosition] = useState('');
  const [newTeamColor, setNewTeamColor] = useState('#000000');
  const [isEditingTeam, setIsEditingTeam] = useState<Team | null>(null);
  const [editedTeamName, setEditedTeamName] = useState('');
  const [editedTeamColor, setEditedTeamColor] = useState('');

  const addTeam = useCallback(() => {
    if (newTeamName.trim()) {
      const newTeam: Team = {
        id: Date.now(),
        name: newTeamName.trim(),
        color: newTeamColor,
        players: [],
      };
      setTeams((prevTeams) => [...prevTeams, newTeam]);
      setNewTeamName("");
  }, [newTeamName, newTeamColor, setTeams]);

  const addPlayer = useCallback(() => {
    if (selectedTeam && newPlayerName.trim() && newPlayerNumber.trim()) {
      const newPlayer: Player = {
        id: Date.now(),
        name: newPlayerName.trim(),
        number: newPlayerNumber.trim(),
        position: newPlayerPosition.trim(),
        teamId: selectedTeam.id,
      };
      const updatedTeam = {
        ...selectedTeam,
        players: [...selectedTeam.players, newPlayer],
      };
      setTeams((prevTeams) =>
        prevTeams.map((team) => (team.id === selectedTeam.id ? updatedTeam : team))
      );
      setNewPlayerName('');
      setNewPlayerNumber('');
      setNewPlayerPosition('');
    }
  }, [selectedTeam, newPlayerName, newPlayerNumber, newPlayerPosition, setTeams]);

  const deletePlayer = useCallback((playerId: number) => {
    if (selectedTeam) {
      const updatedTeam = {
        ...selectedTeam,
        players: selectedTeam.players.filter((player) => player.id !== playerId),
      };
      setTeams((prevTeams) =>
        prevTeams.map((team) => (team.id === selectedTeam.id ? updatedTeam : team))
      );
    }
  }, [selectedTeam, setTeams]);

  const deleteTeam = useCallback((teamId: number) => {
    setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
    if (selectedTeam?.id === teamId) {
      setSelectedTeam(null);
    }
  }, [setTeams, selectedTeam]);

  const startEditingTeam = useCallback((team: Team) => {
    setIsEditingTeam(team);
    setEditedTeamName(team.name);
    setEditedTeamColor(team.color);
  }, []);

  const saveEditedTeam = useCallback(() => {
    if (isEditingTeam && editedTeamName.trim() && editedTeamColor) {
      const updatedTeam = {
        ...isEditingTeam,
        name: editedTeamName.trim(),
        color: editedTeamColor,
      };
      setTeams((prevTeams) =>
        prevTeams.map((team) => (team.id === isEditingTeam.id ? updatedTeam : team))
      );
      setIsEditingTeam(null);
      setEditedTeamName('');
      setEditedTeamColor('');
    }
  }, [isEditingTeam, editedTeamName, editedTeamColor, setTeams]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Team Management</h1>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">New Team Name</label>
        <input
          type="text"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Team Color</label>
        <input
          type="color"
          value={newTeamColor}
          onChange={(e) => setNewTeamColor(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button
          onClick={addTeam}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add Team
        </button>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Teams</h2>
        <ul className="space-y-2">
          {teams.map((team) => (
            <li
              key={team.id}
              className={`p-2 border rounded cursor-pointer ${selectedTeam?.id === team.id ? 'bg-blue-100' : 'bg-white'}`}
              style={{ borderColor: team.color }}
            >
              {isEditingTeam?.id === team.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editedTeamName}
                    onChange={(e) => setEditedTeamName(e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                  <input
                    type="color"
                    value={editedTeamColor}
                    onChange={(e) => setEditedTeamColor(e.target.value)}
                    className="p-2 border rounded"
                  />
                  <button
                    onClick={saveEditedTeam}
                    className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span onClick={() => setSelectedTeam(team)}>{team.name}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditingTeam(team)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTeam(team.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      {selectedTeam && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Players - {selectedTeam.name}
          </h2>
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
                Player Name
              </label>
              <input
                id="playerName"
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="playerNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Player Number
              </label>
              <input
                id="playerNumber"
                type="text"
                value={newPlayerNumber}
                onChange={(e) => setNewPlayerNumber(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="playerPosition" className="block text-sm font-medium text-gray-700 mb-1">
                Player Position
              </label>
              <input
                id="playerPosition"
                type="text"
                value={newPlayerPosition}
                onChange={(e) => setNewPlayerPosition(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
          </div>
          <button
            onClick={addPlayer}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add Player
          </button>
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Player List</h3>
            <ul className="space-y-2">
              {selectedTeam.players.map((player) => (
                <li key={player.id} className="p-2 border rounded bg-gray-50 flex justify-between items-center">
                  <div>
                    <span>{player.name}</span> - <span>#{player.number}</span> - <span>{player.position}</span>
                  </div>
                  <button
                    onClick={() => deletePlayer(player.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;