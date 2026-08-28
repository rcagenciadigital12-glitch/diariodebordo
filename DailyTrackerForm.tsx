import React, { useState, useEffect } from 'react';
import { 
  Smile, 
  Moon, 
  Zap, 
  Pill, 
  Sparkles, 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  FileText, 
  Clock, 
  ShieldAlert,
  Flame,
  Check,
  ChevronDown,
  Info
} from 'lucide-react';
import { DailyLog, MoodLevel, FocusLevel, SleepQuality, MedicationStatus, TriggerCategory, MedicationItem } from '../types';
import { 
  MOOD_LABELS, 
  FOCUS_LABELS, 
  SLEEP_QUALITY_LABELS, 
  TRIGGER_LABELS, 
  STRATEGY_OPTIONS, 
  THERAPY_OPTIONS,
  formatDateWithWeekday,
  saveDailyLog
} from '../utils/storage';

interface DailyTrackerFormProps {
  log: DailyLog;
  onSave: (updatedLog: DailyLog) => void;
  onNavigateToReport: () => void;
}

export const DailyTrackerForm: React.FC<DailyTrackerFormProps> = ({
  log: initialLog,
  onSave,
  onNavigateToReport,
}) => {
  const [formData, setFormData] = useState<DailyLog>(initialLog);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedTime, setNewMedTime] = useState('');
  const [showAddMedForm, setShowAddMedForm] = useState(false);

  // Sync state if selected log date changes from parent
  useEffect(() => {
    setFormData(initialLog);
  }, [initialLog.date]);

  const handleSave = () => {
    saveDailyLog(formData);
    onSave(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3500);
  };

  const handleMoodSelect = (level: MoodLevel) => {
    setFormData((prev) => ({
      ...prev,
      humor: { ...prev.humor, level },
    }));
  };

  const toggleMoodTag = (tag: string) => {
    setFormData((prev) => {
      const currentTags = prev.humor.tags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];
      return {
        ...prev,
        humor: { ...prev.humor, tags: newTags },
      };
    });
  };

  const handleFocusSelect = (level: FocusLevel) => {
    setFormData((prev) => ({
      ...prev,
      foco: { ...prev.foco, level },
    }));
  };

  const toggleFocusChallenge = (challenge: string) => {
    setFormData((prev) => {
      const current = prev.foco.challenges || [];
      const updated = current.includes(challenge)
        ? current.filter((c) => c !== challenge)
        : [...current, challenge];
      return {
        ...prev,
        foco: { ...prev.foco, challenges: updated },
      };
    });
  };

  const handleSleepQualitySelect = (quality: SleepQuality) => {
    setFormData((prev) => ({
      ...prev,
      sono: { ...prev.sono, quality },
    }));
  };

  const toggleCrisisStrategy = (strategy: string) => {
    setFormData((prev) => {
      const current = prev.regulacao.effectiveStrategies || [];
      const updated = current.includes(strategy)
        ? current.filter((s) => s !== strategy)
        : [...current, strategy];
      return {
        ...prev,
        regulacao: { ...prev.regulacao, effectiveStrategies: updated },
      };
    });
  };

  const toggleTherapy = (therapy: string) => {
    setFormData((prev) => {
      const current = prev.rotinaExtra.therapies || [];
      const updated = current.includes(therapy)
        ? current.filter((t) => t !== therapy)
        : [...current, therapy];
      return {
        ...prev,
        rotinaExtra: { ...prev.rotinaExtra, therapies: updated },
      };
    });
  };

  const handleAddMedication = () => {
    if (!newMedName.trim()) return;
    const newItem: MedicationItem = {
      id: Date.now().toString(),
      name: newMedName.trim(),
      dose: newMedDose.trim() || '1 dose',
      time: newMedTime.trim() || '08:00',
      taken: true,
    };
    setFormData((prev) => ({
      ...prev,
      medicacao: {
        ...prev.medicacao,
        items: [...prev.medicacao.items, newItem],
      },
    }));
    setNewMedName('');
    setNewMedDose('');
    setNewMedTime('');
    setShowAddMedForm(false);
  };

  const toggleMedItemTaken = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      medicacao: {
        ...prev.medicacao,
        items: prev.medicacao.items.map((item) =>
          item.id === id ? { ...item, taken: !item.taken } : item
        ),
      },
    }));
  };

  const removeMedItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      medicacao: {
        ...prev.medicacao,
        items: prev.medicacao.items.filter((item) => item.id !== id),
      },
    }));
  };

  const commonMoodTags = [
    'Calmo',
    'Alegre',
    'Cooperativo',
    'Sensível',
    'Agitado',
    'Inquieto',
    'Vocal / Comunicativo',
    'Stimming / Auto-estimulação',
    'Afetuoso',
    'Opositor',
  ];

  const focusChallenges = [
    'Ruídos externos / Conversas',
    'Mudança repentina de atividade',
    'Fadiga mental / Sono',
    'Sobrecarga de telas',
    'Falta de interesse no tema',
    'Dificuldade motora fina',
  ];

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4 sm:px-6">
      {/* Date banner */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#1F2D3D]/10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4BA3A6] block mb-1">
            Registro Diário
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F2D3D] font-heading">
            {formatDateWithWeekday(formData.date)}
          </h2>
          <p className="text-xs text-[#1F2D3D]/60 mt-0.5">
            Preencha os campos abaixo para documentar o dia e alimentar o relatório médico.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-save-log-top"
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#1F2D3D] hover:bg-[#131D27] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow transition cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#CFE1D6]" />
            <span>Salvar Dia</span>
          </button>
        </div>
      </div>

      {/* Step Indicators Bar */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur rounded-xl p-2 shadow-xs border border-[#1F2D3D]/10 mb-6 overflow-x-auto gap-1 scrollbar-none">
        {[
          { step: 1, label: 'Humor & Foco', icon: Smile },
          { step: 2, label: 'Sono', icon: Moon },
          { step: 3, label: 'Regulação & Crises', icon: Zap },
          { step: 4, label: 'Medicação', icon: Pill },
          { step: 5, label: 'Rotina & Vitória', icon: Sparkles },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeStep === item.step;
          return (
            <button
              key={item.step}
              id={`step-nav-${item.step}`}
              onClick={() => setActiveStep(item.step)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap cursor-pointer flex-1 justify-center ${
                isActive
                  ? 'bg-[#4BA3A6] text-white shadow-xs'
                  : 'text-[#1F2D3D]/70 hover:bg-[#F4E9E1]/50 hover:text-[#1F2D3D]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#4BA3A6]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step 1: Humor & Foco */}
      {activeStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Card: Humor */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#1F2D3D]/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#4BA3A6]/15 flex items-center justify-center text-[#4BA3A6]">
                <Smile className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F2D3D]">Humor Predominante</h3>
                <p className="text-xs text-[#1F2D3D]/60">Como a criança esteve durante a maior parte do dia?</p>
              </div>
            </div>

            {/* 5-Level Mood Scale */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 mb-5">
              {([1, 2, 3, 4, 5] as MoodLevel[]).map((level) => {
                const info = MOOD_LABELS[level];
                const isSelected = formData.humor.level === level;
                return (
                  <button
                    key={level}
                    id={`btn-mood-level-${level}`}
                    type="button"
                    onClick={() => handleMoodSelect(level)}
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition cursor-pointer text-center relative ${
                      isSelected
                        ? `${info.bg} ring-2 ring-[#4BA3A6]/50 shadow-xs`
                        : 'border-[#1F2D3D]/10 hover:border-[#4BA3A6]/40 bg-[#F4E9E1]/15'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#4BA3A6] text-white rounded-full flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                    <span className="text-3xl mb-1.5">{info.emoji}</span>
                    <span className="text-xs font-bold text-[#1F2D3D] leading-tight">
                      {info.label.split('/')[0]}
                    </span>
                    <span className="text-[10px] text-[#1F2D3D]/60 mt-0.5">
                      Nível {level}/5
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mood Tags */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-[#1F2D3D] block mb-2">
                Expressões e comportamentos observados hoje:
              </label>
              <div className="flex flex-wrap gap-2">
                {commonMoodTags.map((tag) => {
                  const isChecked = formData.humor.tags?.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleMoodTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-[#1F2D3D] text-white border-[#1F2D3D]'
                          : 'bg-[#F4E9E1]/30 text-[#1F2D3D]/80 border-[#1F2D3D]/15 hover:border-[#1F2D3D]/30'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 text-[#CFE1D6]" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mood Notes */}
            <div>
              <label htmlFor="mood-notes" className="text-xs font-semibold text-[#1F2D3D] block mb-1.5">
                Observações complementares sobre o humor:
              </label>
              <input
                id="mood-notes"
                type="text"
                value={formData.humor.notes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    humor: { ...prev.humor, notes: e.target.value },
                  }))
                }
                placeholder="Ex: Teve momentos de gargalhada na piscina, mas ficou sensível antes do jantar..."
                className="w-full text-xs p-3 rounded-xl border border-[#1F2D3D]/15 bg-[#F4E9E1]/10 focus:outline-none focus:ring-2 focus:ring-[#4BA3A6]"
              />
            </div>
          </div>

          {/* Card: Foco */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#1F2D3D]/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#4BA3A6]/15 flex items-center justify-center text-[#4BA3A6]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F2D3D]">Capacidade de Foco e Atenção</h3>
                <p className="text-xs text-[#1F2D3D]/60">Nível de sustentação da atenção nas atividades e brincadeiras</p>
              </div>
            </div>

            {/* Focus 5-step buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 mb-5">
              {([1, 2, 3, 4, 5] as FocusLevel[]).map((level) => {
                const item = FOCUS_LABELS[level];
                const isSelected = formData.foco.level === level;
                return (
                  <button
                    key={level}
                    id={`btn-focus-level-${level}`}
                    type="button"
                    onClick={() => handleFocusSelect(level)}
                    className={`p-3 rounded-xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#4BA3A6] bg-[#CFE1D6]/30 shadow-xs'
                        : 'border-[#1F2D3D]/10 bg-[#F4E9E1]/15 hover:border-[#4BA3A6]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#1F2D3D]">
                        {level} - {item.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#4BA3A6]" />}
                    </div>
                    <span className="text-[11px] text-[#1F2D3D]/70 leading-tight">
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Focus Challenges */}
            <div>
              <label className="text-xs font-semibold text-[#1F2D3D] block mb-2">
                Fatores que interferiram no foco hoje:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {focusChallenges.map((ch) => {
                  const isChecked = formData.foco.challenges?.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => toggleFocusChallenge(ch)}
                      className={`text-xs p-2.5 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                        isChecked
                          ? 'bg-[#1F2D3D] text-white border-[#1F2D3D]'
                          : 'bg-[#F4E9E1]/20 text-[#1F2D3D]/80 border-[#1F2D3D]/15 hover:border-[#1F2D3D]/30'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isChecked ? 'bg-[#4BA3A6] border-[#4BA3A6]' : 'border-[#1F2D3D]/30'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span>{ch}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Sono */}
      {activeStep === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#1F2D3D]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#4BA3A6]/15 flex items-center justify-center text-[#4BA3A6]">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F2D3D]">Registro do Sono</h3>
                <p className="text-xs text-[#1F2D3D]/60">Quantidade e qualidade da noite anterior</p>
              </div>
            </div>

            {/* Hours Counter & Times */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Hours total */}
              <div className="bg-[#F4E9E1]/30 p-4 rounded-xl border border-[#1F2D3D]/10 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold text-[#1F2D3D]/70 mb-1">
                  Horas Totais Dormidas
                </span>
                <div className="flex items-center gap-3 my-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        sono: { ...prev.sono, hours: Math.max(0, prev.sono.hours - 0.5) },
                      }))
                    }
                    className="w-8 h-8 rounded-lg bg-white border border-[#1F2D3D]/20 font-bold text-lg text-[#1F2D3D] hover:bg-[#F4E9E1] transition cursor-pointer flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-3xl font-extrabold text-[#1F2D3D] font-heading w-20">
                    {formData.sono.hours}h
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        sono: { ...prev.sono, hours: Math.min(18, prev.sono.hours + 0.5) },
                      }))
                    }
                    className="w-8 h-8 rounded-lg bg-white border border-[#1F2D3D]/20 font-bold text-lg text-[#1F2D3D] hover:bg-[#F4E9E1] transition cursor-pointer flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-[#4BA3A6] font-medium">
                  {formData.sono.hours >= 8.5 ? 'Tempo adequado de descanso' : 'Possível privação de sono'}
                </span>
              </div>

              {/* Bedtime */}
              <div className="bg-[#F4E9E1]/30 p-4 rounded-xl border border-[#1F2D3D]/10">
                <label className="text-xs font-semibold text-[#1F2D3D] block mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#4BA3A6]" />
                  <span>Horário de Dormir</span>
                </label>
                <input
                  type="time"
                  value={formData.sono.bedTime || '21:30'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sono: { ...prev.sono, bedTime: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 rounded-lg border border-[#1F2D3D]/15 bg-white text-xs font-bold text-[#1F2D3D]"
                />

                <label className="text-xs font-semibold text-[#1F2D3D] block mt-3 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#4BA3A6]" />
                  <span>Horário de Acordar</span>
                </label>
                <input
                  type="time"
                  value={formData.sono.wakeTime || '07:00'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sono: { ...prev.sono, wakeTime: e.target.value },
                    }))
                  }
                  className="w-full p-2.5 rounded-lg border border-[#1F2D3D]/15 bg-white text-xs font-bold text-[#1F2D3D]"
                />
              </div>

              {/* Night wakings */}
              <div className="bg-[#F4E9E1]/30 p-4 rounded-xl border border-[#1F2D3D]/10 flex flex-col justify-between">
                <div>
                  <label className="text-xs font-semibold text-[#1F2D3D] block mb-2">
                    Despertares Noturnos:
                  </label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            sono: { ...prev.sono, nightWakings: num },
                          }))
                        }
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                          formData.sono.nightWakings === num
                            ? 'bg-[#1F2D3D] text-white shadow-xs'
                            : 'bg-white text-[#1F2D3D]/80 border border-[#1F2D3D]/15 hover:bg-[#F4E9E1]'
                        }`}
                      >
                        {num === 3 ? '3+' : num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#1F2D3D]/10">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sono.difficultyFallingAsleep}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          sono: { ...prev.sono, difficultyFallingAsleep: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 rounded text-[#4BA3A6] focus:ring-[#4BA3A6]"
                    />
                    <span className="text-xs text-[#1F2D3D] font-medium">
                      Demorou mais de 30min para adormecer (alta latência)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Quality Selector */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-[#1F2D3D] block mb-2.5">
                Qualidade Geral do Sono:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['ruim', 'regular', 'bom', 'excelente'] as SleepQuality[]).map((quality) => {
                  const item = SLEEP_QUALITY_LABELS[quality];
                  const isSelected = formData.sono.quality === quality;
                  return (
                    <button
                      key={quality}
                      id={`btn-sleep-quality-${quality}`}
                      type="button"
                      onClick={() => handleSleepQualitySelect(quality)}
                      className={`p-3.5 rounded-xl border-2 text-left transition cursor-pointer ${
                        isSelected
                          ? 'border-[#4BA3A6] bg-[#CFE1D6]/30 shadow-xs'
                          : 'border-[#1F2D3D]/10 bg-[#F4E9E1]/15 hover:border-[#4BA3A6]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#1F2D3D]">{item.label.split('/')[0]}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#4BA3A6]" />}
                      </div>
                      <span className="text-[11px] text-[#1F2D3D]/70 leading-tight block">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sleep Notes */}
            <div>
              <label htmlFor="sleep-notes" className="text-xs font-semibold text-[#1F2D3D] block mb-1.5">
                Detalhes do sono ou rotina noturna:
              </label>
              <input
                id="sleep-notes"
                type="text"
                value={formData.sono.notes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sono: { ...prev.sono, notes: e.target.value },
                  }))
                }
                placeholder="Ex: Dormiu rápido após a leitura de história, mas acordou com agitação às 04h..."
                className="w-full text-xs p-3 rounded-xl border border-[#1F2D3D]/15 bg-[#F4E9E1]/10 focus:outline-none focus:ring-2 focus:ring-[#4BA3A6]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Regulação & Crises */}
      {activeStep === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#1F2D3D]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#FF7D6E]/15 flex items-center justify-center text-[#FF7D6E]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F2D3D]">Regulação Emocional & Sensorial</h3>
                <p className="text-xs text-[#1F2D3D]/60">Mapeamento de crises, sobrecargas e gatilhos da Metodologia Eli Cascão</p>
              </div>
            </div>

            {/* Had Crisis Toggle */}
            <div className="bg-[#F4E9E1]/30 p-4 rounded-xl border border-[#1F2D3D]/10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-sm font-bold text-[#1F2D3D] block">
                  Houve episódios de desregulação ou crises hoje?
                </span>
                <span className="text-xs text-[#1F2D3D]/70">
                  (Meltdowns, shutdowns, choro intenso incontrolável, agressividade reflexa ou auto-lesão)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-crisis-no"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      regulacao: { ...prev.regulacao, hadCrisis: false, crisisCount: 0 },
                    }))
                  }
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    !formData.regulacao.hadCrisis
                      ? 'bg-[#4BA3A6] text-white shadow-xs'
                      : 'bg-white text-[#1F2D3D]/80 border border-[#1F2D3D]/20 hover:bg-[#CFE1D6]/30'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Não (Dia Regulado)</span>
                </button>

                <button
                  type="button"
                  id="btn-crisis-yes"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      regulacao: {
                        ...prev.regulacao,
                        hadCrisis: true,
                        crisisCount: prev.regulacao.crisisCount || 1,
                      },
                    }))
                  }
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    formData.regulacao.hadCrisis
                      ? 'bg-[#FF7D6E] text-white shadow-xs'
                      : 'bg-white text-[#1F2D3D]/80 border border-[#1F2D3D]/20 hover:bg-[#FF7D6E]/10'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Sim (Houve Crise)</span>
                </button>
              </div>
            </div>

            {/* Crisis Details (Conditional if hadCrisis is TRUE) */}
            {formData.regulacao.hadCrisis ? (
              <div className="space-y-6 pt-2 border-t border-[#1F2D3D]/10 animate-fadeIn">
                {/* Episodes Count & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Episode Count */}
                  <div className="bg-[#FF7D6E]/10 p-4 rounded-xl border border-[#FF7D6E]/30">
                    <label className="text-xs font-bold text-[#1F2D3D] block mb-2">
                      Quantidade de Episódios:
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((cnt) => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              regulacao: { ...prev.regulacao, crisisCount: cnt },
                            }))
                          }
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            formData.regulacao.crisisCount === cnt
                              ? 'bg-[#FF7D6E] text-white shadow-xs'
                              : 'bg-white text-[#1F2D3D] border border-[#FF7D6E]/40'
                          }`}
                        >
                          {cnt === 4 ? '4+' : cnt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Duration */}
                  <div className="bg-[#FF7D6E]/10 p-4 rounded-xl border border-[#FF7D6E]/30">
                    <label className="text-xs font-bold text-[#1F2D3D] block mb-1.5">
                      Duração Média: {formData.regulacao.durationMinutes} min
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="90"
                      step="5"
                      value={formData.regulacao.durationMinutes || 15}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          regulacao: {
                            ...prev.regulacao,
                            durationMinutes: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full accent-[#FF7D6E] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#1F2D3D]/60 mt-1">
                      <span>5 min</span>
                      <span>30 min</span>
                      <span>60+ min</span>
                    </div>
                  </div>

                  {/* Time of Day */}
                  <div className="bg-[#FF7D6E]/10 p-4 rounded-xl border border-[#FF7D6E]/30">
                    <label className="text-xs font-bold text-[#1F2D3D] block mb-2">
                      Período Predominante:
                    </label>
                    <select
                      value={formData.regulacao.timeOfDay || 'tarde'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          regulacao: {
                            ...prev.regulacao,
                            timeOfDay: e.target.value as any,
                          },
                        }))
                      }
                      className="w-full p-2 rounded-lg bg-white border border-[#FF7D6E]/40 text-xs font-semibold text-[#1F2D3D] focus:outline-none"
                    >
                      <option value="manha">Manhã</option>
                      <option value="tarde">Tarde</option>
                      <option value="noite">Noite</option>
                      <option value="madrugada">Madrugada</option>
                    </select>
                  </div>
                </div>

                {/* Main Trigger Grid */}
                <div>
                  <label className="text-xs font-bold text-[#1F2D3D] block mb-2.5 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#FF7D6E]" />
                    <span>Gatilho Principal Identificado:</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(Object.keys(TRIGGER_LABELS) as TriggerCategory[]).map((key) => {
                      const isSelected = formData.regulacao.mainTrigger === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              regulacao: { ...prev.regulacao, mainTrigger: key },
                            }))
                          }
                          className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#1F2D3D] text-white border-[#1F2D3D] shadow-xs'
                              : 'bg-[#F4E9E1]/20 text-[#1F2D3D] border-[#1F2D3D]/15 hover:border-[#FF7D6E]/40'
                          }`}
                        >
                          <span className="font-medium">{TRIGGER_LABELS[key]}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#CFE1D6]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Trigger Details */}
                <div>
                  <label htmlFor="trigger-details" className="text-xs font-bold text-[#1F2D3D] block mb-1.5">
                    Descrição do contexto da crise (antecedente, comportamento e consequência):
                  </label>
                  <textarea
                    id="trigger-details"
                    rows={2}
                    value={formData.regulacao.triggerDetails}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        regulacao: { ...prev.regulacao, triggerDetails: e.target.value },
                      }))
                    }
                    placeholder="Ex: Estávamos no supermercado cheio, começou o alarme do caixa. Ela tampou os ouvidos e gritou..."
                    className="w-full text-xs p-3 rounded-xl border border-[#1F2D3D]/15 bg-[#F4E9E1]/10 focus:outline-none focus:ring-2 focus:ring-[#FF7D6E]"
                  />
                </div>

                {/* Effective Co-regulation Strategies (Eli Cascão) */}
                <div>
                  <label className="text-xs font-bold text-[#1F2D3D] block mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-[#4BA3A6]" />
                    <span>Estratégias de Co-regulação que Ajudaram a Acalmar:</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {STRATEGY_OPTIONS.map((st) => {
                      const isChecked = formData.regulacao.effectiveStrategies?.includes(st);
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => toggleCrisisStrategy(st)}
                          className={`text-xs p-2.5 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                            isChecked
                              ? 'bg-[#4BA3A6] text-white border-[#4BA3A6]'
                              : 'bg-[#F4E9E1]/20 text-[#1F2D3D]/80 border-[#1F2D3D]/15 hover:border-[#4BA3A6]/40'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked ? 'bg-white border-white' : 'border-[#1F2D3D]/30'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 text-[#4BA3A6]" />}
                          </div>
                          <span className="font-medium">{st}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#CFE1D6]/30 border border-[#4BA3A6]/30 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#4BA3A6] shrink-0" />
                <p className="text-xs text-[#1F2D3D]">
                  <strong className="font-semibold">Excelente!</strong> Dia de boa estabilidade sensorial e emocional registrado. Mantenha os estímulos adequados e a previsibilidade da rotina.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Medicação */}
      {activeStep === 4 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#1F2D3D]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#4BA3A6]/15 flex items-center justify-center text-[#4BA3A6]">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F2D3D]">Medicação & Suplementação</h3>
                <p className="text-xs text-[#1F2D3D]/60">Controle de adesão e administração prescrita</p>
              </div>
            </div>

            {/* Overall status buttons */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-[#1F2D3D] block mb-2.5">
                Status Geral da Medicação do Dia:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { key: 'sim', label: 'Tomou Tudo', desc: 'Conforme prescrição', color: 'border-[#4BA3A6] bg-[#CFE1D6]/40 text-[#1F2D3D]' },
                  { key: 'parcial', label: 'Tomou Parcial', desc: 'Esqueceu ou recusou dose', color: 'border-[#FFA451] bg-[#FFA451]/15 text-[#1F2D3D]' },
                  { key: 'nao', label: 'Não Tomou', desc: 'Nenhuma dose administrada', color: 'border-[#FF7D6E] bg-[#FF7D6E]/15 text-[#1F2D3D]' },
                  { key: 'sem_medicacao', label: 'Sem Prescrição', desc: 'Não faz uso de remédios', color: 'border-[#1F2D3D]/20 bg-[#F4E9E1]/30 text-[#1F2D3D]' },
                ].map((st) => {
                  const isSelected = formData.medicacao.status === st.key;
                  return (
                    <button
                      key={st.key}
                      id={`btn-med-status-${st.key}`}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          medicacao: { ...prev.medicacao, status: st.key as MedicationStatus },
                        }))
                      }
                      className={`p-3 rounded-xl border-2 text-left transition cursor-pointer ${
                        isSelected
                          ? `${st.color} ring-2 ring-[#4BA3A6]/40 shadow-xs font-bold`
                          : 'border-[#1F2D3D]/10 bg-[#F4E9E1]/15 hover:border-[#4BA3A6]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold">{st.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#4BA3A6]" />}
                      </div>
                      <span className="text-[10px] opacity-75">{st.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Medication Item List */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-[#1F2D3D]">
                  Medicamentos / Suplementos Cadastrados:
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddMedForm(!showAddMedForm)}
                  className="text-xs font-bold text-[#4BA3A6] hover:text-[#3d8c8f] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Medicamento</span>
                </button>
              </div>

              {/* Add form drawer */}
              {showAddMedForm && (
                <div className="bg-[#F4E9E1]/40 p-4 rounded-xl border border-[#1F2D3D]/10 mb-4 animate-fadeIn">
                  <span className="text-xs font-bold text-[#1F2D3D] block mb-2">
                    Novo Medicamento / Suplemento
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Nome (ex: Metilfenidato / Melatonina)"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      className="p-2 text-xs rounded-lg border border-[#1F2D3D]/20 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Dose (ex: 10mg / 2 gotas)"
                      value={newMedDose}
                      onChange={(e) => setNewMedDose(e.target.value)}
                      className="p-2 text-xs rounded-lg border border-[#1F2D3D]/20 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Horário (ex: 08:00)"
                      value={newMedTime}
                      onChange={(e) => setNewMedTime(e.target.value)}
                      className="p-2 text-xs rounded-lg border border-[#1F2D3D]/20 bg-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMedForm(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-[#1F2D3D]/70 hover:bg-black/5 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleAddMedication}
                      className="px-3 py-1.5 bg-[#4BA3A6] hover:bg-[#3d8c8f] text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Salvar Item
                    </button>
                  </div>
                </div>
              )}

              {/* Med Items List */}
              {formData.medicacao.items.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#F4E9E1]/20 border border-dashed border-[#1F2D3D]/20 text-center text-xs text-[#1F2D3D]/60">
                  Nenhum medicamento listado. Clique em &quot;Adicionar Medicamento&quot; caso a criança faça uso.
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.medicacao.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-[#1F2D3D]/10 bg-[#F4E9E1]/20 hover:bg-[#F4E9E1]/40 transition"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.taken}
                          onChange={() => toggleMedItemTaken(item.id)}
                          className="w-4 h-4 rounded text-[#4BA3A6] focus:ring-[#4BA3A6] cursor-pointer"
                        />
                        <div>
                          <span className={`text-xs font-bold block ${item.taken ? 'text-[#1F2D3D]' : 'text-[#1F2D3D]/50 line-through'}`}>
                            {item.name}
                          </span>
                          <span className="text-[11px] text-[#1F2D3D]/60">
                            Dose: {item.dose} • Horário: {item.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            item.taken
                              ? 'bg-[#CFE1D6] text-[#1F2D3D]'
                              : 'bg-[#FF7D6E]/20 text-[#FF7D6E]'
                          }`}
                        >
                          {item.taken ? 'Administrado' : 'Não Tomou'}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMedItem(item.id)}
                          className="p-1 text-[#1F2D3D]/40 hover:text-[#FF7D6E] rounded transition cursor-pointer"
                          title="Remover medicamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Side effects & notes */}
            <div>
              <label htmlFor="med-side-effects" className="text-xs font-semibold text-[#1F2D3D] block mb-1.5">
                Reações observadas ou efeitos colaterais:
              </label>
              <input
                id="med-side-effects"
                type="text"
                value={formData.medicacao.sideEffects}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    medicacao: { ...prev.medicacao, sideEffects: e.target.value },
                  }))
                }
                placeholder="Ex: Nenhuma queixa / Ou: Apresentou sonolência leve 1h após a tomada..."
                className="w-full text-xs p-3 rounded-xl border border-[#1F2D3D]/15 bg-[#F4E9E1]/10 focus:outline-none focus:ring-2 focus:ring-[#4BA3A6]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Rotina & Vitória do Dia */}
      {activeStep === 5 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#1F2D3D]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#4BA3A6]/15 flex items-center justify-center text-[#4BA3A6]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F2D3D]">Terapias & Vitória do Dia</h3>
                <p className="text-xs text-[#1F2D3D]/60">Metodologia Eli Cascão: Valorização das conquistas e estímulo positivo</p>
              </div>
            </div>

            {/* Daily Victory Banner */}
            <div className="bg-gradient-to-br from-[#CFE1D6]/50 to-[#4BA3A6]/20 p-5 rounded-2xl border border-[#4BA3A6]/30 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🏆</span>
                <label htmlFor="daily-victory" className="text-sm font-bold text-[#1F2D3D]">
                  Vitória do Dia / Ponto Positivo:
                </label>
              </div>
              <p className="text-xs text-[#1F2D3D]/70 mb-2">
                Qual conquista, evolução na comunicação, flexibilidade ou momento especial aconteceu hoje?
              </p>
              <textarea
                id="daily-victory"
                rows={3}
                value={formData.rotinaExtra.dailyVictory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rotinaExtra: { ...prev.rotinaExtra, dailyVictory: e.target.value },
                  }))
                }
                placeholder="Ex: Aceitou experimentar uma fruta nova sem engasgo; ou brincou de carrinho imitando o som por 10 minutos..."
                className="w-full text-xs p-3 rounded-xl border border-[#4BA3A6]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#4BA3A6]"
              />
            </div>

            {/* Therapies performed today */}
            <div className="mb-6">
              <label className="text-xs font-bold text-[#1F2D3D] block mb-2.5">
                Terapias Realizadas Hoje:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {THERAPY_OPTIONS.map((th) => {
                  const isChecked = formData.rotinaExtra.therapies?.includes(th);
                  return (
                    <button
                      key={th}
                      type="button"
                      onClick={() => toggleTherapy(th)}
                      className={`text-xs p-2.5 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                        isChecked
                          ? 'bg-[#1F2D3D] text-white border-[#1F2D3D]'
                          : 'bg-[#F4E9E1]/20 text-[#1F2D3D]/80 border-[#1F2D3D]/15 hover:border-[#1F2D3D]/30'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isChecked ? 'bg-[#4BA3A6] border-[#4BA3A6]' : 'border-[#1F2D3D]/30'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="font-medium">{th}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Eating Habits */}
            <div className="mb-6">
              <label className="text-xs font-bold text-[#1F2D3D] block mb-2">
                Alimentação & Aceitação Sensorial Oral:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'normal', label: 'Boa Aceitação', desc: 'Comeu bem' },
                  { key: 'seletiva', label: 'Seletividade', desc: 'Preferiu texturas habituais' },
                  { key: 'pouco_apetite', label: 'Pouco Apetite', desc: 'Menor volume' },
                  { key: 'recusa_total', label: 'Recusa Severa', desc: 'Dificuldade sensorial' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        rotinaExtra: { ...prev.rotinaExtra, eatingHabits: item.key as any },
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      formData.rotinaExtra.eatingHabits === item.key
                        ? 'bg-[#4BA3A6] text-white border-[#4BA3A6] font-bold'
                        : 'bg-[#F4E9E1]/20 text-[#1F2D3D] border-[#1F2D3D]/15 hover:border-[#4BA3A6]/40'
                    }`}
                  >
                    <span className="block font-bold">{item.label}</span>
                    <span className="text-[10px] opacity-75">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Parent overall observations */}
            <div>
              <label htmlFor="parent-obs" className="text-xs font-bold text-[#1F2D3D] block mb-1.5">
                Recado ou observação livre dos pais para o relatório médico:
              </label>
              <textarea
                id="parent-obs"
                rows={2}
                value={formData.rotinaExtra.parentObservations}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rotinaExtra: { ...prev.rotinaExtra, parentObservations: e.target.value },
                  }))
                }
                placeholder="Ex: Sentimos que a previsibilidade da agenda com figuras reduziu a ansiedade no fim da tarde..."
                className="w-full text-xs p-3 rounded-xl border border-[#1F2D3D]/15 bg-[#F4E9E1]/10 focus:outline-none focus:ring-2 focus:ring-[#4BA3A6]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Save & Action Footer Bar */}
      <div className="fixed bottom-4 left-0 right-0 z-20 px-4">
        <div className="max-w-4xl mx-auto bg-[#1F2D3D] text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4BA3A6] animate-pulse"></span>
            <span className="text-[#F4E9E1]/90 hidden sm:inline">
              Data selecionada: <strong className="text-white">{formData.date}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-[#F4E9E1] transition cursor-pointer"
              >
                Voltar
              </button>
            )}

            {activeStep < 5 ? (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#4BA3A6] hover:bg-[#3d8c8f] text-white transition cursor-pointer"
              >
                Avançar ({activeStep}/5)
              </button>
            ) : (
              <button
                type="button"
                onClick={onNavigateToReport}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#FF7D6E] hover:bg-[#e66c5e] text-white flex items-center gap-1.5 transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ver no Relatório</span>
              </button>
            )}

            <button
              id="btn-save-log-bottom"
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#CFE1D6] hover:bg-[#b8d4c3] text-[#1F2D3D] flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Registro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Instant Notification Toast */}
      {showSavedToast && (
        <div className="fixed top-20 right-4 z-50 notification-toast animate-bounce">
          <div className="bg-[#1F2D3D] text-white border-2 border-[#4BA3A6] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#4BA3A6]" />
            <div>
              <p className="text-xs font-bold text-white">Registro Salvo com Sucesso!</p>
              <p className="text-[11px] text-[#CFE1D6]">
                Dados armazenados no dispositivo para o dia {formData.date}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
