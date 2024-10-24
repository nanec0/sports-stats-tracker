import React, { useState, useCallback } from "react";
import { Team, Player } from "../types";

interface TeamManagementProps {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ teams, setTeams }) => {
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerNumber, setNewPlayerNumber] = useState("");
  const [newPlayerPosition, setNewPlayerPosition] = useState("");

  const addTeam = useCallback(() => {
    if (newTeamName.trim()) {
      const newTeam: Team = {
        id: Date.now(),
        name: newTeamName.trim(),
        players: [],
      };
      setTeams((prevTeams) => [...prevTeams, newTeam]);
      setNewTeamName("");
    }
  }, [newTeamName, setTeams]);

  const addPlayer = useCallback(() => {
    if (selectedTeam && newPlayerName.trim() && newPlayerNumber.trim()) {
      const newPlayer: Player = {
        id: Date.now(),
        name: newPlayerName.trim(),
        number: newPlayerNumber.trim(),
        position: newPlayerPosition.trim(),
        teamId: selectedTeam.id
      };
      const updatedTeam = {
        ...selectedTeam,
        players: [...selectedTeam.players, newPlayer]
      };
      setTeams((prevTeams) => prevTeams.map(team => team.id === selectedTeam.id ? updatedTeam : team));
      setNewPlayerName("");
      setNewPlayerNumber("");
      setNewPlayerPosition("");
    }
  }, [selectedTeam, newPlayerName, newPlayerNumber, newPlayerPosition, setTeams]);

  const removePlayer = useCallback((playerId: number) => {
    if (selectedTeam) {
      const updatedTeam = {
        ...selectedTeam,
        players: selectedTeam.players.filter(player => player.id !== playerId)
      };
      setTeams((prevTeams) => prevTeams.map(team => team.id === selectedTeam.id ? updatedTeam : team));
      setSelectedTeam(updatedTeam);
    }
  }, [selectedTeam, setTeams]);

  const removeTeam = useCallback((teamId: number) => {
    setTeams((prevTeams) => prevTeams.filter(team => team.id !== teamId));
    if (selectedTeam?.id === teamId) {
      setSelectedTeam(null);
    }
  }, [setTeams, selectedTeam]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teams Management Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Teams</h2>
          
          <div className="mb-6">
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
              New Team Name
            </label>
            <div className="flex gap-2">
              <input
                id="teamName"
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter team name"
              />
              <button
                onClick={addTeam}
                disabled={!newTeamName.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {teams.map(team => (
              <div
                key={team.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTeam?.id === team.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedTeam(team)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{team.name}</h3>
                    <p className="text-sm text-gray-500">{team.players.length} players</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTeam(team.id);
                    }}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
                    title="Remove team"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Players Management Section */}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter player name"
                />
              </div>
              
              <div>
                <label htmlFor="playerNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Jersey Number
                </label>
                <input
                  id="playerNumber"
                  type="text"
                  value={newPlayerNumber}
                  onChange={(e) => setNewPlayerNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter jersey number"
                />
              </div>
              
              <div>
                <label htmlFor="playerPosition" className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  id="playerPosition"
                  type="text"
                  value={newPlayerPosition}
                  onChange={(e) => setNewPlayerPosition(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter position (optional)"
                />
              </div>

              <button
                onClick={addPlayer}
                disabled={!newPlayerName.trim() || !newPlayerNumber.trim()}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Player
              </button>
            </div>

            <div className="space-y-3">
              {selectedTeam.players.map(player => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">
                      #{player.number} {player.name}
                    </h3>
                    {player.position && (
                      <p className="text-sm text-gray-500">{player.position}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
                    title="Remove player"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;