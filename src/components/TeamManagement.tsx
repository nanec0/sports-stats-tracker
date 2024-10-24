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

  return (
    <div>
      <h1>Team Management</h1>
      <div>
        <input
          type="text"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="New Team Name"
        />
        <button onClick={addTeam}>Add Team</button>
      </div>
      <div>
        <h2>Teams</h2>
        <ul>
          {teams.map(team => (
            <li key={team.id} onClick={() => setSelectedTeam(team)}>
              {team.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedTeam && (
        <div>
          <h2>Add Player to {selectedTeam.name}</h2>
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Player Name"
          />
          <input
            type="text"
            value={newPlayerNumber}
            onChange={(e) => setNewPlayerNumber(e.target.value)}
            placeholder="Player Number"
          />
          <input
            type="text"
            value={newPlayerPosition}
            onChange={(e) => setNewPlayerPosition(e.target.value)}
            placeholder="Player Position"
          />
          <button onClick={addPlayer}>Add Player</button>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;