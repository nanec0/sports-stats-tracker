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
  tipoDeJuego: TipoDeJuego;
  resultado: TipoDeResultado;
  zona: string;
  minutes: number;
}

export enum TipoDeJuego {
  Abierto = 'abierto',
  Parado = 'parado',
  TiroLibre = 'tiro libre',
  Penal = 'penal',
  Corner = 'corner'
}

export enum TipoDeResultado {
  Gol = 'gol',
  Atajado = 'atajado',
  Desviado = 'desviado',
  Bloqueado = 'bloqueado',
  Palo = 'palo'
}

export interface DataEntryPanelProps {
  addPlay: (play: Play) => void;
  selectedZone: string | null;
  setSelectedZone: (zone: string) => void;
  isMobile: boolean;
  activeTeam: Team | null;
  onTeamSwitch: () => void;
}