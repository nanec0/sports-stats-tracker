export interface Team {
  id: number;
  name: string;
  color: string;
  players: Player[];
  tournamentId: number;
}

export interface Player {
  id: number;
  name: string;
  number: string;
  position?: string;
  teamId: number;
}

export interface Tournament {
  id: number;
  name: string;
  description?: string;
  teams: Team[];
  matches?: Match[];
}

export interface Match {
  id: number;
  homeTeamId: string;
  awayTeamId: string;
  tournamentId: string;
  date: Date;
  plays: Play[];
}

export interface Play {
  teamId: number;
  chico: string;
  jugador: string;
  tipoDeJuego: 'abierto' | 'parado';
  resultado: 'gol' | 'atajado' | 'desviado' | 'bloqueado';
  zona: string;
}

export interface DataEntryPanelProps {
  addPlay: (play: Play) => void;
  selectedZone: string | null;
  setSelectedZone: (zone: string) => void;
  isMobile: boolean;
  activeTeam: Team | null;
  teamColor: string;
  onTeamSwitch: () => void;
}