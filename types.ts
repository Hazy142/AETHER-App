
export interface Chakra {
  name: string;
  color: string;
  minHz: number;
  maxHz: number;
  defaultHz: number;
  description: string;
}

export enum ViewMode {
  SCENE_3D = '3D',
  SESSION_POV = 'POV',
}

export interface SessionLog {
  id: string;
  startTime: number; // JS timestamp
  endTime: number; // JS timestamp
  duration: number; // in seconds
  chakraIndex: number;
  frequency: number;
  userRating: number;
  userNotes: string;
}
