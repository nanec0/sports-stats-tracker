import React, { useState, useCallback } from "react";
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Tournament Management</h1>
      
      <div className="mb-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Tournament</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="tournamentName" className="block text-sm font-medium text-gray-700 mb-1">
              Tournament Name
            </label>
            <input
              id="tournamentName"
              type="text"
              value={newTournamentName}
              onChange={(e) => setNewTournamentName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter tournament name"
            />
          </div>
          <div>
            <label htmlFor="tournamentDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="tournamentDescription"
              value={newTournamentDescription}
              onChange={(e) => setNewTournamentDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter tournament description"
              rows={3}
            />
          </div>
          <button
            onClick={addTournament}
            disabled={!newTournamentName.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Tournament
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Tournaments</h2>
        {tournaments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tournaments added yet</p>
        ) : (
          <ul className="space-y-4">
            {tournaments.map(tournament => (
              <li
                key={tournament.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{tournament.name}</h3>
                  {tournament.description && (
                    <p className="text-gray-600 mt-1">{tournament.description}</p>
                  )}
                </div>
                <button
                  onClick={() => removeTournament(tournament.id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Remove tournament"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TournamentManagement;