import React, { useState, useEffect } from 'react';
import TeamManagement from './TeamManagement';
import PreMatchConfig from './PreMatchConfig';
import { Team, Tournament } from '../types';

const AppContainer: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  // Load teams from local storage when the component mounts
  useEffect(() => {
    const storedTeams = localStorage.getItem('teams');
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    }
  }, []);

  // Save teams to local storage whenever teams state changes
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  return (
    <div>
      <TeamManagement teams={teams} setTeams={setTeams} />
      <PreMatchConfig teams={teams} />
    </div>
  );
};

export default AppContainer;