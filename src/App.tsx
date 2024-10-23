import { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import InteractiveMap from './components/InteractiveMap';
import DataEntryPanel from "./components/DataEntryPanel";
import TeamManagement from "./components/TeamManagement";
import RealTimeTable from "./components/RealTimeTable";
import TournamentManagement from "./components/TournamentManagement";
import PreMatchConfig from './components/PreMatchConfig';
import { Play, Team, Tournament } from './types';

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

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const App = () => {
  const [activeComponent, setActiveComponent] = useState("tournamentManagement");
  const [plays, setPlays] = useState<Play[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [homeColor, setHomeColor] = useState<string>('#8884d8');
  const [awayColor, setAwayColor] = useState<string>('#82ca9d');
  const [teams, setTeams] = useLocalStorage('teams', []);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const isMobile = useWindowSize();

  useEffect(() => {
    setActiveTeam(activeTeam === homeTeam ? awayTeam : homeTeam);
  }, [homeTeam, awayTeam]);

  const addPlay = useCallback((play: Play) => {
    setPlays((prevPlays) => [...prevPlays, play]);
  }, []);

  const switchTeam = useCallback(() => {
    setActiveTeam((prevActiveTeam) => (prevActiveTeam === homeTeam ? awayTeam : homeTeam));
    setSelectedZone(null);
  }, [homeTeam, awayTeam]);

  const handleMatchStart = (home: Team, away: Team) => {
    setHomeTeam(home);
    setAwayTeam(away);
    setActiveTeam(home);
  };

  const renderComponent = useMemo(() => {
    switch (activeComponent) {
      case "tournamentManagement":
        return <TournamentManagement />;
      case "teamManagement":
        return <TeamManagement teams={teams} setTeams={setTeams} />;
      case "preMatchConfig":
        return <PreMatchConfig teams={teams} handleStartMatch={handleMatchStart} />;
      case "dataEntryPanel":
        return (
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
                teamColor={activeTeam === homeTeam ? homeColor : ""}
                onTeamSwitch={switchTeam} />
                {homeTeam && awayTeam && (
                  <RealTimeTable homeTeam={homeTeam} awayTeam={awayTeam} plays={plays} homeColor={homeColor} awayColor={awayColor} />
                )}
            </div>            
          </div>
        );
      case "realTimeTable":
        return (
          homeTeam && awayTeam ? (
            <RealTimeTable
              plays={plays}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              homeColor={homeColor}
              awayColor={awayColor}
            />
          ) : null
        );
      default:
        return null;
    }
  }, [activeComponent, teams, setTeams, handleMatchStart, addPlay, selectedZone, isMobile, activeTeam, homeColor, switchTeam]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sports Stats Tracker</h1>
      <div className="mb-4">
        <button
          onClick={() => setActiveComponent("tournamentManagement")}
          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
        >
          Tournament Management
        </button>
        <button
          onClick={() => setActiveComponent("teamManagement")}
          className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600"
        >
          Team Management
        </button>
        <button
          onClick={() => setActiveComponent("preMatchConfig")}
          className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600"
        >
          PreMatchConfig
        </button>
        <button
          onClick={() => setActiveComponent("dataEntryPanel")}
          className="bg-green-500 text-white p-2 rounded mr-2 hover:bg-green-600"
        >
          Data Entry Panel
        </button>
        <button
          onClick={() => setActiveComponent("realTimeTable")}
          className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
        >
          Real-Time Table
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {renderComponent}
      </div>
    </div>
  );
};

export default App;