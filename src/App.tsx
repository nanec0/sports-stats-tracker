import { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import InteractiveMap from './components/InteractiveMap';
import DataEntryPanel from "./components/DataEntryPanel";
import RealTimeTable from "./components/RealTimeTable";
import TournamentManagement from "./components/TournamentManagement";
import PreMatchConfig from './components/PreMatchConfig';
import MatchHistory from './components/MatchHistory';
import { Play, Team } from './types';
import useLocalStorage from './hooks/useLocalStorage';

const useWindowSize = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const App = () => {
  const [activeComponent, setActiveComponent] = useState("tournamentManagement");
  const [plays, setPlays] = useLocalStorage<Play[]>("plays", []);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [currentMatchId, setCurrentMatchId] = useLocalStorage<number>("currentMatchId", 0);
  const [matches, setMatches] = useLocalStorage<{ id: number, date: string }[]>("matches", []);

  const isMobile = useWindowSize();

  useEffect(() => {
    setActiveTeam(activeTeam === homeTeam ? awayTeam : homeTeam);
  }, [homeTeam, awayTeam]);

  const addPlay = useCallback((play: Play) => {
    const newPlay = {
      ...play,
      id: Date.now(),
      matchId: currentMatchId,
      timestamp: Date.now()
    };
    setPlays((prevPlays) => [...prevPlays, newPlay]);
  }, [setPlays, currentMatchId]);

  const switchTeam = useCallback(() => {
    setActiveTeam((prevActiveTeam) => (prevActiveTeam === homeTeam ? awayTeam : homeTeam));
    setSelectedZone(null);
  }, [homeTeam, awayTeam]);

  const handleMatchStart = (home: Team, away: Team) => {
    const newMatchId = Date.now();
    setCurrentMatchId(newMatchId);
    setMatches(prev => [...prev, { id: newMatchId, date: new Date().toISOString() }]);
    setHomeTeam(home);
    setAwayTeam(away);
    setActiveTeam(home);
    setActiveComponent("dataEntryPanel");
  };

  const matchPlays = useMemo(() => {
    return plays.filter(play => play.matchId === currentMatchId);
  }, [plays, currentMatchId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Play Data</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveComponent("tournamentManagement")}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeComponent === "tournamentManagement"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-yellow-500 hover:text-white"
          }`}
        >
          Gestión de Torneos
        </button>
        <button
          onClick={() => setActiveComponent("preMatchConfig")}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeComponent === "preMatchConfig"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
          }`}
        >
          Comenzar Partido
        </button>
        <button
          onClick={() => setActiveComponent("dataEntryPanel")}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeComponent === "dataEntryPanel"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white"
          }`}
        >
          Datos del Partido
        </button>
        <button
          onClick={() => setActiveComponent("matchHistory")}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeComponent === "matchHistory"
              ? "bg-purple-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-purple-500 hover:text-white"
          }`}
        >
          Historial de Partidos
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {activeComponent === "tournamentManagement" && <TournamentManagement />}
        {activeComponent === "preMatchConfig" && <PreMatchConfig onStartMatch={handleMatchStart} />}
        {activeComponent === "dataEntryPanel" && homeTeam && awayTeam && (
          <div className="flex flex-col md:flex-row h-screen">
            <div className="w-full md:w-1/2 p-4">
              <InteractiveMap
                selectedZone={selectedZone}
                setSelectedZone={setSelectedZone}
                activeTeam={activeTeam === homeTeam ? 'home' : 'away'} />
            </div>
            <div className="w-full md:w-1/2 p-4">
              <DataEntryPanel
                addPlay={addPlay}
                selectedZone={selectedZone}
                setSelectedZone={setSelectedZone}
                isMobile={isMobile}
                activeTeam={activeTeam}
                onTeamSwitch={switchTeam} />
              {homeTeam && awayTeam && (
                <RealTimeTable
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  plays={matchPlays}
                />
              )}
            </div>
          </div>
        )}
        {activeComponent === "matchHistory" && <MatchHistory />}
      </div>
      <div className="mt-4" style={{ display: 'none' }}>
        <h2 className="text-xl font-bold">Matches</h2>
        <div>
          {matches.map(match => (
            <li key={match.id}>{match.date}</li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;