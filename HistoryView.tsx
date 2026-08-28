import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Search, 
  Zap, 
  Moon, 
  Smile, 
  Pill, 
  Sparkles, 
  ArrowRight, 
  Trash2, 
  Filter,
  Plus
} from 'lucide-react';
import { DailyLog } from '../types';
import { 
  getAllLogs, 
  formatDateWithWeekday, 
  MOOD_LABELS, 
  TRIGGER_LABELS, 
  getTodayDateString 
} from '../utils/storage';

interface HistoryViewProps {
  onSelectDate: (date: string) => void;
  onNewLog: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onSelectDate,
  onNewLog,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'with_crisis' | 'poor_sleep' | 'missed_med'>('all');

  const allLogs = useMemo(() => getAllLogs(), []);

  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      // Search term filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesDate = log.date.includes(term);
        const matchesTrigger = (log.regulacao?.triggerDetails || '').toLowerCase().includes(term);
        const matchesVictory = (log.rotinaExtra?.dailyVictory || '').toLowerCase().includes(term);
        const matchesNotes = (log.humor?.notes || '').toLowerCase().includes(term);
        if (!matchesDate && !matchesTrigger && !matchesVictory && !matchesNotes) {
          return false;
        }
      }

      // Category filter
      if (filterType === 'with_crisis') {
        return log.regulacao?.hadCrisis;
      }
      if (filterType === 'poor_sleep') {
        return log.sono?.quality === 'ruim' || (log.sono?.hours || 8) < 7;
      }
      if (filterType === 'missed_med') {
        return log.medicacao?.status === 'nao' || log.medicacao?.status === 'parcial';
      }

      return true;
    });
  }, [allLogs, searchTerm, filterType]);

  const today = getTodayDateString();

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4 sm:px-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#1F2D3D]/10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4BA3A6] block mb-1">
            Histórico de Registros
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F2D3D] font-heading">
            Linha do Tempo Neurofuncional
          </h2>
          <p className="text-xs text-[#1F2D3D]/60 mt-0.5">
            {allLogs.length} dias registrados no diário até o momento.
          </p>
        </div>

        <button
          id="btn-new-log-today"
          onClick={() => {
            onSelectDate(today);
            onNewLog();
          }}
          className="flex items-center gap-2 bg-[#4BA3A6] hover:bg-[#3d8c8f] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Hoje ({today})</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-xl p-3.5 shadow-xs border border-[#1F2D3D]/10 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#1F2D3D]/40 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por data, gatilho, vitória do dia ou anotação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-[#1F2D3D]/15 focus:outline-none focus:ring-2 focus:ring-[#4BA3A6]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-[#4BA3A6] mr-1 hidden sm:inline" />
          {[
            { key: 'all', label: 'Todos' },
            { key: 'with_crisis', label: 'Com Crises' },
            { key: 'poor_sleep', label: 'Sono Ruim' },
            { key: 'missed_med', label: 'Sem Medicação' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterType === f.key
                  ? 'bg-[#1F2D3D] text-white'
                  : 'bg-[#F4E9E1]/40 text-[#1F2D3D]/70 hover:text-[#1F2D3D]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Card List */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-[#1F2D3D]/20">
          <Calendar className="w-10 h-10 text-[#4BA3A6] mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-[#1F2D3D]">Nenhum registro encontrado</h3>
          <p className="text-xs text-[#1F2D3D]/60 mt-1 max-w-sm mx-auto">
            Não há registros correspondentes aos filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const moodInfo = MOOD_LABELS[log.humor?.level || 3];
            const isToday = log.date === today;

            return (
              <div
                key={log.date}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#1F2D3D]/10 hover:border-[#4BA3A6]/50 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-[#1F2D3D]">
                      {formatDateWithWeekday(log.date)}
                    </span>
                    {isToday && (
                      <span className="bg-[#4BA3A6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Hoje
                      </span>
                    )}

                    {/* Mood Badge */}
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${moodInfo.bg} text-[#1F2D3D] flex items-center gap-1`}>
                      <span>{moodInfo.emoji}</span>
                      <span>Humor {log.humor?.level}/5</span>
                    </span>

                    {/* Sleep Badge */}
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F4E9E1] text-[#1F2D3D] flex items-center gap-1">
                      <Moon className="w-3 h-3 text-[#4BA3A6]" />
                      <span>{log.sono?.hours || 8}h ({log.sono?.quality})</span>
                    </span>

                    {/* Crisis badge */}
                    {log.regulacao?.hadCrisis ? (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF7D6E]/15 text-[#FF7D6E] border border-[#FF7D6E]/30 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>{log.regulacao.crisisCount}x Crise</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#CFE1D6] text-[#1F2D3D]">
                        Sem crises
                      </span>
                    )}
                  </div>

                  {/* Victory or Crisis summary */}
                  {log.regulacao?.hadCrisis && (
                    <p className="text-xs text-[#FF7D6E] font-medium mb-1">
                      Gatilho: {TRIGGER_LABELS[log.regulacao.mainTrigger] || 'Gatilho mapeado'}{' '}
                      {log.regulacao.durationMinutes ? `(${log.regulacao.durationMinutes} min)` : ''}
                    </p>
                  )}

                  {log.rotinaExtra?.dailyVictory && (
                    <p className="text-xs text-[#1F2D3D]/80 italic line-clamp-2">
                      &quot;{log.rotinaExtra.dailyVictory}&quot;
                    </p>
                  )}
                </div>

                {/* Edit Button */}
                <button
                  id={`btn-edit-log-${log.date}`}
                  onClick={() => onSelectDate(log.date)}
                  className="self-end sm:self-center flex items-center gap-1.5 bg-[#F4E9E1]/60 hover:bg-[#4BA3A6] hover:text-white text-[#1F2D3D] px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <span>Abrir / Editar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
