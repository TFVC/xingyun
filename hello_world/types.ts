
export interface Difficulty {
  id: string;
  label: string;
  command: string;
  localResponse: string;
}

export interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'system';
  content: string;
  timestamp: string;
}
