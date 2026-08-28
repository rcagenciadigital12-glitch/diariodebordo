export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type FocusLevel = 1 | 2 | 3 | 4 | 5;
export type SleepQuality = 'ruim' | 'regular' | 'bom' | 'excelente';
export type MedicationStatus = 'sim' | 'nao' | 'parcial' | 'sem_medicacao';

export type TriggerCategory = 
  | 'sensorial_ruido'
  | 'sensorial_textura_luz'
  | 'transicao_rotina'
  | 'frustracao_negativa'
  | 'fadiga_sono'
  | 'fome_sede'
  | 'demanda_escolar'
  | 'social_interacao'
  | 'dor_desconforto'
  | 'nao_identificado'
  | 'outro';

export interface MedicationItem {
  id: string;
  name: string;
  dose: string;
  time: string;
  taken: boolean;
  notes?: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  updatedAt: string;
  
  // 1. Humor e Foco
  humor: {
    level: MoodLevel;
    tags: string[];
    notes: string;
  };
  foco: {
    level: FocusLevel;
    challenges: string[];
    notes: string;
  };

  // 2. Sono
  sono: {
    hours: number;
    quality: SleepQuality;
    nightWakings: number;
    difficultyFallingAsleep: boolean;
    bedTime?: string;
    wakeTime?: string;
    notes: string;
  };

  // 3. Regulação e Crises
  regulacao: {
    hadCrisis: boolean;
    crisisCount: number;
    crisisType: string[]; // 'meltdown', 'shutdown', 'ansiedade', 'agitacao_motora'
    mainTrigger: TriggerCategory;
    triggerDetails: string;
    durationMinutes: number;
    effectiveStrategies: string[];
    timeOfDay?: 'manha' | 'tarde' | 'noite' | 'madrugada';
    notes: string;
  };

  // 4. Medicação
  medicacao: {
    status: MedicationStatus;
    items: MedicationItem[];
    sideEffects: string;
    notes: string;
  };

  // 5. Terapias & Rotina (Eli Cascão Holistic Tracking)
  rotinaExtra: {
    therapies: string[];
    eatingHabits: 'normal' | 'seletiva' | 'pouco_apetite' | 'recusa_total';
    physicalActivity: boolean;
    dailyVictory: string; // Momento positivo / vitória do dia
    parentObservations: string;
  };
}

export interface ChildProfile {
  name: string;
  birthDate: string;
  gender?: string;
  diagnosis: string;
  responsibleName: string;
  responsiblePhone?: string;
  physicianName: string;
  physicianSpecialty?: string;
  crm?: string;
  clinicalNotes?: string;
}

export type ActiveTab = 'tracker' | 'history' | 'report' | 'profile';
