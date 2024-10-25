import { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import InteractiveMap from './components/InteractiveMap';
import DataEntryPanel from "./components/DataEntryPanel";
import RealTimeTable from "./components/RealTimeTable";
import TournamentManagement from "./components/TournamentManagement";
import PreMatchConfig from './components/PreMatchConfig';
import { Play, Team } from './types';

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
  const [plays, setPlays] = useState<Play[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);

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
    setActiveComponent("dataEntryPanel");
  };

  const renderComponent = useMemo(() => {
    switch (activeComponent) {
      case "tournamentManagement":
        return <TournamentManagement />;
      case "preMatchConfig":
        return <PreMatchConfig onStartMatch={handleMatchStart} />;
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
                onTeamSwitch={switchTeam} />
              {homeTeam && awayTeam && (
                <RealTimeTable
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  plays={plays}
                />
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
            />
          ) : null
        );
      default:
        return null;
    }
  }, [activeComponent, handleMatchStart, addPlay, selectedZone, isMobile, activeTeam, switchTeam, plays, homeTeam, awayTeam]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Play Data</h1>
      <div className="mb-4">
        <button
          onClick={() => setActiveComponent("tournamentManagement")}
          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 mr-2"
        >
          Tournament Management
        </button>
        <button
          onClick={() => setActiveComponent("preMatchConfig")}
          className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600"
        >
          Comenzar Partido
        </button>
        <button
          onClick={() => setActiveComponent("dataEntryPanel")}
          className="bg-green-500 text-white p-2 rounded mr-2 hover:bg-green-600"
        >
          Datos del Partido
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