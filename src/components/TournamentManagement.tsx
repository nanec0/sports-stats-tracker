import React, { useState,  useCallback } from "react";
import { Tournament } from "../types";
import useLocalStorage from "../hooks/useLocalStorage";

const TournamentManagement: React.FC = () => {
  const [tournaments, setTournaments] = useLocalStorage<Tournament[]>("tournaments", []);
  const [newTournamentName, setNewTournamentName] = useState("");
  const [newTournamentDescription, setNewTournamentDescription] = useState("");

  const addTournament = useCallback(() => {
    if (newTournamentName.trim()) {
      const newTournament: Tournament = {
        id: Date.now(),
        name: newTournamentName.trim(),
        description: newTournamentDescription.trim(),
      };
      setTournaments((prevTournaments) => [...prevTournaments, newTournament]);
      setNewTournamentName("");
      setNewTournamentDescription("");
    }
  }, [newTournamentName, newTournamentDescription, setTournaments]);

  const removeTournament = useCallback((id: number) => {
    setTournaments((prevTournaments) => prevTournaments.filter(tournament => tournament.id !== id));
  }, [setTournaments]);

  return (
    <div>
      <h1>Tournament Management</h1>
      <div>
        <input
          type="text"
          value={newTournamentName}
          onChange={(e) => setNewTournamentName(e.target.value)}
          placeholder="New Tournament Name"
        />
        <input
          type="text"
          value={newTournamentDescription}
          onChange={(e) => setNewTournamentDescription(e.target.value)}
          placeholder="New Tournament Description"
        />
        <button onClick={addTournament}>Add Tournament</button>
      </div>
      <div>
        <h2>Tournaments</h2>
        <ul>
          {tournaments.map(tournament => (
            <li key={tournament.id}>
              <span>{tournament.name}: {tournament.description}</span>
              <button onClick={() => removeTournament(tournament.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TournamentManagement;
