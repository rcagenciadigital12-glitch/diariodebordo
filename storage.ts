import { DailyLog, ChildProfile } from '../types';

const STORAGE_PREFIX = 'diario_neuro_';
const PROFILE_KEY = 'diario_neuro_child_profile';
const DATES_INDEX_KEY = 'diario_neuro_dates_index';

export const DEFAULT_CHILD_PROFILE: ChildProfile = {
  name: 'Lucas Ferreira Cascão',
  birthDate: '2019-04-15',
  gender: 'Masculino',
  diagnosis: 'TEA Nível 1 de Suporte + Suspeita TDAH',
  responsibleName: 'Patrícia Ferreira',
  responsiblePhone: '(11) 98765-4321',
  physicianName: 'Dra. Camila Vasconcelos',
  physicianSpecialty: 'Neuropediatria e Desenvolvimento Infantil',
  crm: 'CRM/SP 142.890 - RQE 45.120',
  clinicalNotes: 'Paciente em acompanhamento interdisciplinar (T.O. com Integração Sensorial e Psicologia ABA). Protocolo de observação diária Metodologia Eli Cascão.',
};

export const DEFAULT_EMPTY_LOG = (date: string): DailyLog => ({
  date,
  updatedAt: new Date().toISOString(),
  humor: {
    level: 3,
    tags: ['Calmo', 'Adaptativo'],
    notes: '',
  },
  foco: {
    level: 3,
    challenges: [],
    notes: '',
  },
  sono: {
    hours: 8,
    quality: 'bom',
    nightWakings: 0,
    difficultyFallingAsleep: false,
    bedTime: '21:30',
    wakeTime: '06:30',
    notes: '',
  },
  regulacao: {
    hadCrisis: false,
    crisisCount: 0,
    crisisType: [],
    mainTrigger: 'nao_identificado',
    triggerDetails: '',
    durationMinutes: 0,
    effectiveStrategies: [],
    timeOfDay: 'tarde',
    notes: '',
  },
  medicacao: {
    status: 'sim',
    items: [
      { id: '1', name: 'Suplementação Melatonina', dose: '1mg', time: '20:30', taken: true, notes: 'Gotinhas 30min antes de deitar' },
      { id: '2', name: 'Ômega 3 DHA', dose: '1 cápsula', time: '12:00', taken: true, notes: 'Com o almoço' },
    ],
    sideEffects: '',
    notes: '',
  },
  rotinaExtra: {
    therapies: ['T.O. Sensorial'],
    eatingHabits: 'normal',
    physicalActivity: true,
    dailyVictory: 'Conseguiu transitar da brincadeira para o banho sem choro usando o aviso visual.',
    parentObservations: '',
  },
});

export const TRIGGER_LABELS: Record<string, string> = {
  sensorial_ruido: 'Sensorial: Sobrecarga Auditiva / Ruído',
  sensorial_textura_luz: 'Sensorial: Luzes / Texturas / Toque',
  transicao_rotina: 'Transição Inesperada / Quebra de Rotina',
  frustracao_negativa: 'Frustração com ' + 'Não' + ' / Limites',
  fadiga_sono: 'Fadiga Acumulada / Sono Insuficiente',
  fome_sede: 'Fome / Sede / Desconforto Físico',
  demanda_escolar: 'Sobrecarga de Demandas Escolares',
  social_interacao: 'Sobrecarga Social / Ambientes Cheios',
  dor_desconforto: 'Dor ou Mal-estar Físico',
  nao_identificado: 'Gatilho Não Identificado',
  outro: 'Outro Gatilho Específico',
};

export const STRATEGY_OPTIONS = [
  'Abafador de Ruído',
  'Espaço Calmo / Cantinho Aconchegante',
  'Pressão Profunda / Abraço Firme / Manta Pesada',
  'Pausa Sem Demandas',
  'Co-regulação (Respiração Guiada)',
  'Mordedor / Fidget Toy',
  'Música Suave / Luz Baixa',
  'Objeto de Apego',
  'Lanche Leve ou Água Gelada',
  'Movimento Proprioceptivo (Pular / Caminhar)',
];

export const THERAPY_OPTIONS = [
  'Terapia Ocupacional (T.O.)',
  'Fonoaudiologia',
  'Psicologia (ABA / TCC)',
  'Psicomotricidade',
  'Musicoterapia',
  'Fisioterapia',
  'Psicopedagogia',
  'Natação Adaptada',
];

export const MOOD_LABELS: Record<number, { label: string; emoji: string; color: string; bg: string }> = {
  1: { label: 'Muito Irritado / Desregulado', emoji: '😫', color: '#FF7D6E', bg: 'bg-[#FF7D6E]/15 border-[#FF7D6E]/30' },
  2: { label: 'Agitado / Ansioso / Inquieto', emoji: '😟', color: '#FFA451', bg: 'bg-[#FFA451]/15 border-[#FFA451]/30' },
  3: { label: 'Estável / Neutro / Calmo', emoji: '🙂', color: '#4BA3A6', bg: 'bg-[#4BA3A6]/15 border-[#4BA3A6]/30' },
  4: { label: 'Alegre / Cooperativo', emoji: '😄', color: '#2B8285', bg: 'bg-[#4BA3A6]/25 border-[#4BA3A6]/50' },
  5: { label: 'Muito Feliz / Altamente Conectado', emoji: '🌟', color: '#1B6A6D', bg: 'bg-[#CFE1D6] border-[#4BA3A6]' },
};

export const FOCUS_LABELS: Record<number, { label: string; desc: string }> = {
  1: { label: 'Dispersão Severa', desc: 'Muita dificuldade em sustentar qualquer atividade' },
  2: { label: 'Foco Baixo', desc: 'Necessitou de múltiplos redirecionamentos' },
  3: { label: 'Foco Moderado', desc: 'Concluiu tarefas com suporte e pistas visuais' },
  4: { label: 'Bom Foco', desc: 'Boa autonomia e engajamento nas propostas' },
  5: { label: 'Excelente / Hiperfoco', desc: 'Alta concentração sustentada e imersão' },
};

export const SLEEP_QUALITY_LABELS: Record<string, { label: string; desc: string; color: string }> = {
  ruim: { label: 'Ruim / Muito Agitado', desc: 'Múltiplos despertares ou pesadelos frequentes', color: '#FF7D6E' },
  regular: { label: 'Regular / Interrompido', desc: 'Demorou a pegar no sono ou acordou 1-2 vezes', color: '#FFA451' },
  bom: { label: 'Bom / Reparador', desc: 'Sono contínuo, acordou com boa disposição', color: '#4BA3A6' },
  excelente: { label: 'Excelente / Restaurador', desc: 'Noite tranquila sem interrupções', color: '#2B8285' },
};

// Storage APIs
export function getSavedDates(): string[] {
  try {
    const stored = localStorage.getItem(DATES_INDEX_KEY);
    if (stored) {
      return JSON.parse(stored).sort().reverse();
    }
  } catch (e) {
    console.error('Error loading dates index', e);
  }
  return [];
}

export function saveDateToIndex(date: string) {
  try {
    const dates = new Set(getSavedDates());
    dates.add(date);
    const sorted = Array.from(dates).sort().reverse();
    localStorage.setItem(DATES_INDEX_KEY, JSON.stringify(sorted));
  } catch (e) {
    console.error('Error saving date to index', e);
  }
}

export function getDailyLog(date: string): DailyLog {
  try {
    const key = `${STORAGE_PREFIX}${date}`;
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.error('Error reading log for date', date, e);
  }
  return DEFAULT_EMPTY_LOG(date);
}

export function saveDailyLog(log: DailyLog): void {
  try {
    const key = `${STORAGE_PREFIX}${log.date}`;
    log.updatedAt = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(log));
    saveDateToIndex(log.date);
  } catch (e) {
    console.error('Error saving daily log', e);
  }
}

export function getChildProfile(): ChildProfile {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading child profile', e);
  }
  return DEFAULT_CHILD_PROFILE;
}

export function saveChildProfile(profile: ChildProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving child profile', e);
  }
}

export function getAllLogs(): DailyLog[] {
  const dates = getSavedDates();
  const logs: DailyLog[] = [];
  for (const date of dates) {
    const log = getDailyLog(date);
    if (log) logs.push(log);
  }
  return logs;
}

export function seedInitialDataIfEmpty(): void {
  const dates = getSavedDates();
  if (dates.length > 0) return;

  // Initialize with sample records covering the last 7 days so clinical report is instantly rich
  const today = new Date();
  const sampleLogs: DailyLog[] = [];

  const sampleVariations = [
    {
      daysAgo: 0,
      mood: 4 as const,
      focus: 4 as const,
      hours: 9,
      quality: 'bom' as const,
      hadCrisis: false,
      crisisCount: 0,
      trigger: 'nao_identificado' as const,
      victory: 'Usou o temporizador visual para desligar o tablet sem resistência.',
    },
    {
      daysAgo: 1,
      mood: 3 as const,
      focus: 3 as const,
      hours: 8,
      quality: 'bom' as const,
      hadCrisis: true,
      crisisCount: 1,
      trigger: 'sensorial_ruido' as const,
      triggerDetails: 'Barulho de furadeira no prédio vizinho durante o almoço.',
      strategies: ['Abafador de Ruído', 'Espaço Calmo / Cantinho Aconchegante'],
      victory: 'Aceitou colocar o abafador e se acalmou em 12 minutos.',
    },
    {
      daysAgo: 2,
      mood: 5 as const,
      focus: 4 as const,
      hours: 9.5,
      quality: 'excelente' as const,
      hadCrisis: false,
      crisisCount: 0,
      trigger: 'nao_identificado' as const,
      victory: 'Sessão de T.O. muito produtiva; experimentou massinha com nova textura.',
    },
    {
      daysAgo: 3,
      mood: 2 as const,
      focus: 2 as const,
      hours: 6.5,
      quality: 'ruim' as const,
      hadCrisis: true,
      crisisCount: 2,
      trigger: 'transicao_rotina' as const,
      triggerDetails: 'Troca repentina da professora substituta na escola.',
      strategies: ['Co-regulação (Respiração Guiada)', 'Pausa Sem Demandas'],
      victory: 'Conseguiu comunicar que estava com sobrecarga e pediu colo.',
    },
    {
      daysAgo: 4,
      mood: 4 as const,
      focus: 3 as const,
      hours: 8.5,
      quality: 'bom' as const,
      hadCrisis: false,
      crisisCount: 0,
      trigger: 'nao_identificado' as const,
      victory: 'Comeu brócolis com o prato dividido sem recusa.',
    },
    {
      daysAgo: 5,
      mood: 3 as const,
      focus: 4 as const,
      hours: 8,
      quality: 'regular' as const,
      hadCrisis: false,
      crisisCount: 0,
      trigger: 'nao_identificado' as const,
      victory: 'Brincou de encaixe compartilhado com o irmão por 15 minutos.',
    },
    {
      daysAgo: 6,
      mood: 4 as const,
      focus: 3 as const,
      hours: 9,
      quality: 'bom' as const,
      hadCrisis: true,
      crisisCount: 1,
      trigger: 'frustracao_negativa' as const,
      triggerDetails: 'Torre de blocos caiu quando estava quase pronta.',
      strategies: ['Pressão Profunda / Abraço Firme / Manta Pesada', 'Objeto de Apego'],
      victory: 'Respirou fundo e reconstruiu a torre com a mãe.',
    },
  ];

  for (const item of sampleVariations) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - item.daysAgo);
    const dateStr = targetDate.toISOString().split('T')[0];

    const log: DailyLog = {
      date: dateStr,
      updatedAt: new Date().toISOString(),
      humor: {
        level: item.mood,
        tags: item.mood >= 4 ? ['Alegre', 'Cooperativo'] : item.mood === 3 ? ['Calmo'] : ['Inquieto', 'Sensível'],
        notes: item.daysAgo === 1 ? 'Dia com boa disposição geral, exceto durante o ruído do meio-dia.' : '',
      },
      foco: {
        level: item.focus,
        challenges: item.focus <= 2 ? ['Ruídos externos', 'Fadiga'] : [],
        notes: '',
      },
      sono: {
        hours: item.hours,
        quality: item.quality,
        nightWakings: item.quality === 'ruim' ? 2 : item.quality === 'regular' ? 1 : 0,
        difficultyFallingAsleep: item.quality === 'ruim',
        bedTime: '21:30',
        wakeTime: '06:45',
        notes: item.quality === 'ruim' ? 'Despertou às 02h assustado com trovoada.' : 'Noite tranquila.',
      },
      regulacao: {
        hadCrisis: item.hadCrisis,
        crisisCount: item.crisisCount,
        crisisType: item.hadCrisis ? ['meltdown'] : [],
        mainTrigger: item.trigger,
        triggerDetails: item.triggerDetails || '',
        durationMinutes: item.hadCrisis ? (item.daysAgo === 3 ? 25 : 12) : 0,
        effectiveStrategies: item.strategies || [],
        timeOfDay: item.hadCrisis ? 'tarde' : undefined,
        notes: item.hadCrisis ? 'Acolhido sem confronto verbal direto.' : 'Nenhuma crise registrada.',
      },
      medicacao: {
        status: 'sim',
        items: [
          { id: '1', name: 'Suplementação Melatonina', dose: '1mg', time: '20:30', taken: true },
          { id: '2', name: 'Ômega 3 DHA', dose: '1 cápsula', time: '12:00', taken: true },
        ],
        sideEffects: 'Sem queixas adversas',
        notes: 'Administrado pontualmente.',
      },
      rotinaExtra: {
        therapies: item.daysAgo % 2 === 0 ? ['Terapia Ocupacional (T.O.)', 'Psicologia (ABA / TCC)'] : ['Fonoaudiologia'],
        eatingHabits: 'normal',
        physicalActivity: true,
        dailyVictory: item.victory,
        parentObservations: 'Observado aumento no contato visual ao utilizar reforço positivo e pistas gestuais.',
      },
    };

    saveDailyLog(log);
  }

  saveChildProfile(DEFAULT_CHILD_PROFILE);
}

export function formatDatePtBR(dateString: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
}

export function formatDateWithWeekday(dateString: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    return `${daysOfWeek[date.getDay()]}, ${day} de ${months[month - 1]} de ${year}`;
  } catch {
    return dateString;
  }
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
