
export type TabId = 'protocol' | 'directory' | 'legal' | 'strategy' | 'ai' | 'patient' | 'diary';

export interface Resource {
  id: string;
  cat: 'medico' | 'homecare' | 'publico' | 'insumos' | 'equipamento' | 'transporte' | 'fisio';
  name: string;
  sub: string;
  phone: string;
  desc: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
  details: string;
}

export interface MessageState {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

// Speech API Types
export interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

// Patient Data Types
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
}

export interface PatientData {
  name: string;
  age: string;
  bloodType: string;
  insuranceCard: string;
  allergies: string;
  surgeryDate: string;
  surgeonName: string;
  followUpDate: string;
  medications: Medication[];
}

// Diary Data Types
export interface AgitationLog {
  id: string;
  timestamp: string;
  trigger: 'pain' | 'hunger' | 'bathroom' | 'unknown' | 'environment';
  severity: number; // 1-10
  action: string;
}

export interface ShiftNote {
  lastUpdated: string;
  content: string;
}
