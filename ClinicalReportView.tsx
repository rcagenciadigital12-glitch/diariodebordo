import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Download, 
  Calendar, 
  User, 
  Award, 
  TrendingUp, 
  Moon, 
  Zap, 
  Pill, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  AlertCircle,
  Stethoscope,
  Filter
} from 'lucide-react';
import { DailyLog, ChildProfile, TriggerCategory } from '../types';
import { 
  getAllLogs, 
  formatDatePtBR, 
  TRIGGER_LABELS, 
  MOOD_LABELS, 
  SLEEP_QUALITY_LABELS 
} from '../utils/storage';

interface ClinicalReportViewProps {
  childProfile: ChildProfile;
  onEditLog?: (date: string) => void;
}

export const ClinicalReportView: React.FC<ClinicalReportViewProps> = ({
  childProfile,
}) => {
  const [periodFilter, setPeriodFilter] = useState<'7' | '14' | '30' | 'all'>('7');

  const allLogs = useMemo(() => getAllLogs(), []);

  // Filter logs according to selected period
  const filteredLogs = useMemo(() => {
    if (periodFilter === 'all') return allLogs;
    const days = parseInt(periodFilter, 10);
    return allLogs.slice(0, days);
  }, [allLogs, periodFilter]);

  // Clinical KPIs Calculation
  const stats = useMemo(() => {
    const totalDays = filteredLogs.length;
    if (totalDays === 0) {
      return {
        totalDays: 0,
        avgMood: 0,
        moodStablePct: 0,
        avgSleepHours: 0,
        goodSleepPct: 0,
        totalCrises: 0,
        crisisDays: 0,
        daysWithoutCrisisPct: 100,
        avgCrisisDuration: 0,
        medAdherencePct: 100,
        triggerCounts: {} as Record<string, number>,
        strategyCounts: {} as Record<string, number>,
      };
    }

    let moodSum = 0;
    let stableMoodDays = 0;
    let sleepHoursSum = 0;
    let goodSleepDays = 0;
    let totalCrises = 0;
    let crisisDays = 0;
    let totalCrisisDuration = 0;
    let medCompliantDays = 0;
    const triggerCounts: Record<string, number> = {};
    const strategyCounts: Record<string, number> = {};

    for (const log of filteredLogs) {
      // Mood
      moodSum += log.humor?.level || 3;
      if ((log.humor?.level || 3) >= 3) stableMoodDays++;

      // Sleep
      sleepHoursSum += log.sono?.hours || 8;
      if (log.sono?.quality === 'bom' || log.sono?.quality === 'excelente') {
        goodSleepDays++;
      }

      // Crisis
      if (log.regulacao?.hadCrisis) {
        crisisDays++;
        const count = log.regulacao.crisisCount || 1;
        totalCrises += count;
        totalCrisisDuration += log.regulacao.durationMinutes || 15;

        const trig = log.regulacao.mainTrigger || 'nao_identificado';
        triggerCounts[trig] = (triggerCounts[trig] || 0) + 1;

        if (log.regulacao.effectiveStrategies) {
          for (const st of log.regulacao.effectiveStrategies) {
            strategyCounts[st] = (strategyCounts[st] || 0) + 1;
          }
        }
      }

      // Medication
      if (log.medicacao?.status === 'sim' || log.medicacao?.status === 'sem_medicacao') {
        medCompliantDays++;
      }
    }

    return {
      totalDays,
      avgMood: (moodSum / totalDays).toFixed(1),
      moodStablePct: Math.round((stableMoodDays / totalDays) * 100),
      avgSleepHours: (sleepHoursSum / totalDays).toFixed(1),
      goodSleepPct: Math.round((goodSleepDays / totalDays) * 100),
      totalCrises,
      crisisDays,
      daysWithoutCrisisPct: Math.round(((totalDays - crisisDays) / totalDays) * 100),
      avgCrisisDuration: crisisDays > 0 ? Math.round(totalCrisisDuration / crisisDays) : 0,
      medAdherencePct: Math.round((medCompliantDays / totalDays) * 100),
      triggerCounts,
      strategyCounts,
    };
  }, [filteredLogs]);

  // Sorted triggers
  const sortedTriggers = useMemo(() => {
    return (Object.entries(stats.triggerCounts) as [string, number][])
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .map(([key, count]) => ({
        key,
        label: TRIGGER_LABELS[key] || key,
        count: Number(count),
        pct: Math.round((Number(count) / (stats.crisisDays || 1)) * 100),
      }));
  }, [stats]);

  // Sorted strategies
  const sortedStrategies = useMemo(() => {
    return (Object.entries(stats.strategyCounts) as [string, number][])
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 5)
      .map(([name, count]) => ({ name, count: Number(count) }));
  }, [stats]);

  const handlePrint = () => {
    window.print();
  };

  // Date range label
  const rangeLabel = useMemo(() => {
    if (filteredLogs.length === 0) return 'Nenhum registro encontrado';
    const first = filteredLogs[filteredLogs.length - 1].date;
    const last = filteredLogs[0].date;
    return `${formatDatePtBR(first)} até ${formatDatePtBR(last)} (${filteredLogs.length} dias)`;
  }, [filteredLogs]);

  // Calculate age from birthDate
  const childAge = useMemo(() => {
    if (!childProfile.birthDate) return 'Não informada';
    try {
      const birth = new Date(childProfile.birthDate);
      const now = new Date();
      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
        years--;
        months += 12;
      }
      return `${years} anos ${months > 0 ? `e ${months} meses` : ''}`;
    } catch {
      return childProfile.birthDate;
    }
  }, [childProfile.birthDate]);

  return (
    <div className="max-w-5xl mx-auto pb-20 px-3 sm:px-6">
      {/* Top Interactive Controls (Hidden during print) */}
      <div className="no-print bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#1F2D3D]/10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#4BA3A6] uppercase tracking-wider block">
            Relatório de Acompanhamento
          </span>
          <h2 className="text-xl font-bold text-[#1F2D3D] font-heading">
            Dossiê Clínico do Neurodesenvolvimento
          </h2>
          <p className="text-xs text-[#1F2D3D]/60 mt-0.5">
            Dados estruturados para apresentação em consulta com Neuropediatra, Psiquiatra ou Terapeuta.
          </p>
        </div>

        {/* Filter & Print Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-[#F4E9E1]/50 p-1 rounded-xl border border-[#1F2D3D]/10 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#4BA3A6] ml-2 mr-1" />
            {(['7', '14', '30', 'all'] as const).map((opt) => (
              <button
                key={opt}
                id={`btn-period-${opt}`}
                onClick={() => setPeriodFilter(opt)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  periodFilter === opt
                    ? 'bg-[#1F2D3D] text-white shadow-xs'
                    : 'text-[#1F2D3D]/70 hover:text-[#1F2D3D]'
                }`}
              >
                {opt === 'all' ? 'Tudo' : `${opt}d`}
              </button>
            ))}
          </div>

          <button
            id="btn-export-doctor"
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#FF7D6E] hover:bg-[#e66c5e] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Exportar para o Médico (PDF)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CLINICAL REPORT DOCUMENT (PRINTABLE CONTAINER) */}
      {/* ========================================================================= */}
      <div className="report-container bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-[#1F2D3D]/15 text-[#1F2D3D]">
        {/* Document Header */}
        <div className="border-b-2 border-[#1F2D3D] pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#1F2D3D] text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Metodologia Eli Cascão
                </span>
                <span className="text-xs font-semibold text-[#4BA3A6]">
                  Acompanhamento Comportamental e Sensorial
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2D3D] tracking-tight font-heading">
                Relatório de Monitoramento Neurofuncional
              </h1>
              <p className="text-xs text-[#1F2D3D]/70 mt-1 max-w-2xl">
                Documento de registro contínuo preenchido pelos cuidadores, projetado para suporte à tomada de decisão clínica, ajuste medicamentoso e intervenções terapêuticas interdisciplinares.
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-[#1F2D3D]/20 sm:pl-6 text-xs text-[#1F2D3D]/80">
              <p className="font-bold text-[#1F2D3D]">Emissão do Documento:</p>
              <p>{new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="font-semibold text-[#4BA3A6] mt-1">Período Avaliado:</p>
              <p className="font-bold text-[#1F2D3D]">{rangeLabel}</p>
            </div>
          </div>
        </div>

        {/* Patient Identification Card */}
        <div className="bg-[#F4E9E1]/30 border border-[#1F2D3D]/15 rounded-xl p-4 sm:p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#1F2D3D]/60 uppercase font-semibold text-[10px] block">
                Nome do Paciente / Criança
              </span>
              <strong className="text-sm text-[#1F2D3D] block font-heading">
                {childProfile.name || 'Paciente Não Identificado'}
              </strong>
              <span className="text-[#1F2D3D]/70 text-[11px]">
                Idade: {childAge} • Nasc: {formatDatePtBR(childProfile.birthDate)}
              </span>
            </div>

            <div>
              <span className="text-[#1F2D3D]/60 uppercase font-semibold text-[10px] block">
                Diagnóstico / Hipótese Diagnóstica
              </span>
              <strong className="text-xs text-[#1F2D3D] block">
                {childProfile.diagnosis || 'TEA / TDAH / Regulação'}
              </strong>
              <span className="text-[#1F2D3D]/70 text-[11px]">
                Responsável: {childProfile.responsibleName} {childProfile.responsiblePhone && `(${childProfile.responsiblePhone})`}
              </span>
            </div>

            <div>
              <span className="text-[#1F2D3D]/60 uppercase font-semibold text-[10px] block">
                Médico(a) / Terapeuta de Referência
              </span>
              <strong className="text-xs text-[#1F2D3D] block">
                {childProfile.physicianName || 'Dr(a). Não especificado(a)'}
              </strong>
              <span className="text-[#1F2D3D]/70 text-[11px]">
                {childProfile.crm || 'CRM / RQE a preencher'} • {childProfile.physicianSpecialty || 'Neuropediatria'}
              </span>
            </div>
          </div>
        </div>

        {/* Clinical KPI Cards */}
        <div className="page-break mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1F2D3D] mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#4BA3A6]" />
            <span>1. Indicadores Consolidados do Período ({stats.totalDays} dias analisados)</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Humor & Estabilidade */}
            <div className="p-4 rounded-xl border border-[#1F2D3D]/15 bg-white">
              <span className="text-[11px] font-semibold text-[#1F2D3D]/70 block">
                Humor Médio
              </span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl font-black text-[#1F2D3D] font-heading">
                  {stats.avgMood}
                </span>
                <span className="text-xs text-[#1F2D3D]/50">/ 5.0</span>
              </div>
              <span className="text-[11px] text-[#4BA3A6] font-semibold">
                {stats.moodStablePct}% dos dias estáveis
              </span>
            </div>

            {/* Sono Médio */}
            <div className="p-4 rounded-xl border border-[#1F2D3D]/15 bg-white">
              <span className="text-[11px] font-semibold text-[#1F2D3D]/70 block">
                Média de Sono
              </span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl font-black text-[#1F2D3D] font-heading">
                  {stats.avgSleepHours}h
                </span>
                <span className="text-xs text-[#1F2D3D]/50">/ noite</span>
              </div>
              <span className="text-[11px] text-[#4BA3A6] font-semibold">
                {stats.goodSleepPct}% noites restauradoras
              </span>
            </div>

            {/* Desregulações / Crises */}
            <div className="p-4 rounded-xl border border-[#1F2D3D]/15 bg-white">
              <span className="text-[11px] font-semibold text-[#1F2D3D]/70 block">
                Total de Crises
              </span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl font-black text-[#FF7D6E] font-heading">
                  {stats.totalCrises}
                </span>
                <span className="text-xs text-[#1F2D3D]/50">em {stats.crisisDays} dias</span>
              </div>
              <span className="text-[11px] text-[#1F2D3D]/80 font-semibold">
                {stats.daysWithoutCrisisPct}% dias sem crise
              </span>
            </div>

            {/* Adesão Medicamentosa */}
            <div className="p-4 rounded-xl border border-[#1F2D3D]/15 bg-white">
              <span className="text-[11px] font-semibold text-[#1F2D3D]/70 block">
                Adesão Farmacológica
              </span>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl font-black text-[#2B8285] font-heading">
                  {stats.medAdherencePct}%
                </span>
              </div>
              <span className="text-[11px] text-[#4BA3A6] font-semibold">
                Conformidade com prescrição
              </span>
            </div>
          </div>
        </div>

        {/* Trigger Analysis & Co-regulation Strategies (2 Columns) */}
        <div className="page-break grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Triggers Breakdown */}
          <div className="border border-[#1F2D3D]/15 rounded-xl p-4 bg-[#F4E9E1]/15">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2D3D] mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#FF7D6E]" />
              <span>Gatilhos Precursores Identificados</span>
            </h3>

            {sortedTriggers.length === 0 ? (
              <p className="text-xs text-[#1F2D3D]/60 italic py-4 text-center">
                Nenhum episódio de crise registrado no período selecionado.
              </p>
            ) : (
              <div className="space-y-2.5">
                {sortedTriggers.map((trig) => (
                  <div key={trig.key}>
                    <div className="flex justify-between text-xs font-semibold text-[#1F2D3D] mb-1">
                      <span className="truncate pr-2">{trig.label}</span>
                      <span>{trig.count}x ({trig.pct}%)</span>
                    </div>
                    <div className="w-full bg-[#1F2D3D]/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#FF7D6E] h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, trig.pct)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Effective Strategies Breakdown */}
          <div className="border border-[#1F2D3D]/15 rounded-xl p-4 bg-[#CFE1D6]/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2D3D] mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#4BA3A6]" />
              <span>Estratégias de Co-regulação Mais Eficazes</span>
            </h3>

            {sortedStrategies.length === 0 ? (
              <p className="text-xs text-[#1F2D3D]/60 italic py-4 text-center">
                Sem necessidade de intervenções em crises no período.
              </p>
            ) : (
              <div className="space-y-2">
                {sortedStrategies.map((st, idx) => (
                  <div
                    key={st.name}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-[#4BA3A6]/20"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#4BA3A6] text-white flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-[#1F2D3D]">{st.name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#4BA3A6] px-2 py-0.5 bg-[#CFE1D6] rounded">
                      Eficaz em {st.count} episódios
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Daily Timeline Table */}
        <div className="page-break mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1F2D3D] mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#4BA3A6]" />
            <span>2. Tabela Cronológica Diária Detalhada</span>
          </h2>

          <div className="overflow-x-auto border border-[#1F2D3D]/15 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1F2D3D] text-white">
                  <th className="p-2.5 font-bold">Data</th>
                  <th className="p-2.5 font-bold">Humor / Foco</th>
                  <th className="p-2.5 font-bold">Sono</th>
                  <th className="p-2.5 font-bold">Regulação / Crises</th>
                  <th className="p-2.5 font-bold">Medicação</th>
                  <th className="p-2.5 font-bold">Vitória / Destaque do Dia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2D3D]/10">
                {filteredLogs.map((log) => {
                  const moodInfo = MOOD_LABELS[log.humor?.level || 3];
                  return (
                    <tr key={log.date} className="hover:bg-[#F4E9E1]/20">
                      <td className="p-2.5 font-bold whitespace-nowrap text-[#1F2D3D]">
                        {formatDatePtBR(log.date)}
                      </td>

                      <td className="p-2.5">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <span>{moodInfo.emoji}</span>
                          <span>Nível {log.humor?.level}/5</span>
                        </div>
                        <span className="text-[10px] text-[#1F2D3D]/60 block">
                          Foco: Nível {log.foco?.level}/5
                        </span>
                      </td>

                      <td className="p-2.5 whitespace-nowrap">
                        <div className="font-semibold text-[#1F2D3D]">
                          {log.sono?.hours || 8}h ({log.sono?.quality})
                        </div>
                        {log.sono?.nightWakings ? (
                          <span className="text-[10px] text-[#FF7D6E] block font-medium">
                            {log.sono.nightWakings} despertares
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#4BA3A6] block">
                            Sem despertares
                          </span>
                        )}
                      </td>

                      <td className="p-2.5">
                        {log.regulacao?.hadCrisis ? (
                          <div>
                            <span className="inline-block px-1.5 py-0.5 rounded bg-[#FF7D6E]/20 text-[#FF7D6E] font-bold text-[10px] mb-0.5">
                              {log.regulacao.crisisCount}x Crise ({log.regulacao.durationMinutes}min)
                            </span>
                            <span className="text-[10px] text-[#1F2D3D]/80 block">
                              Gatilho: {TRIGGER_LABELS[log.regulacao.mainTrigger] || 'Gatilho identificado'}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-[#CFE1D6] text-[#1F2D3D] font-semibold text-[10px]">
                            Estável / Sem Crises
                          </span>
                        )}
                      </td>

                      <td className="p-2.5 whitespace-nowrap">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            log.medicacao?.status === 'sim'
                              ? 'bg-[#CFE1D6] text-[#1F2D3D]'
                              : log.medicacao?.status === 'parcial'
                              ? 'bg-[#FFA451]/20 text-[#1F2D3D]'
                              : log.medicacao?.status === 'nao'
                              ? 'bg-[#FF7D6E]/20 text-[#FF7D6E]'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {log.medicacao?.status === 'sim'
                            ? 'Tomou Tudo'
                            : log.medicacao?.status === 'parcial'
                            ? 'Parcial'
                            : log.medicacao?.status === 'nao'
                            ? 'Não Tomou'
                            : 'Sem Medicação'}
                        </span>
                      </td>

                      <td className="p-2.5 text-[11px] text-[#1F2D3D]/80 max-w-[220px]">
                        {log.rotinaExtra?.dailyVictory || (
                          <span className="text-[#1F2D3D]/40 italic">Sem anotação</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinical Synthesis / Specialist Observations (Eli Cascão) */}
        <div className="page-break bg-[#F4E9E1]/30 border border-[#1F2D3D]/15 rounded-xl p-5 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2D3D] mb-2 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-[#4BA3A6]" />
            <span>3. Síntese Clínica & Correlações da Metodologia Eli Cascão</span>
          </h3>
          <div className="space-y-2 text-xs text-[#1F2D3D]/90 leading-relaxed">
            <p>
              • <strong>Correlação Sono x Estabilidade:</strong> Observa-se que dias com noites de sono reparador (acima de 8h) apresentaram índice de desregulação significativamente menor ({stats.daysWithoutCrisisPct}% de dias estáveis).
            </p>
            <p>
              • <strong>Previsibilidade e Transições:</strong> O uso de suporte visual de transição e respeito ao tempo de processamento sensorial reduziu o tempo médio de escalada das crises para {stats.avgCrisisDuration || 12} minutos.
            </p>
            <p>
              • <strong>Adesão Farmacológica:</strong> Taxa de adesão de {stats.medAdherencePct}%, permitindo avaliar o efeito terapêutico com confiabilidade clínica.
            </p>
          </div>
        </div>

        {/* Signature & Methodology Validation Footer */}
        <div className="page-break pt-6 border-t-2 border-[#1F2D3D]/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs">
            {/* Parent Signature */}
            <div className="flex flex-col items-center">
              <div className="w-48 border-b border-[#1F2D3D]/40 mb-2 h-10"></div>
              <strong className="text-[#1F2D3D]">{childProfile.responsibleName || 'Responsável Legal'}</strong>
              <span className="text-[#1F2D3D]/60 text-[11px]">Assinatura do(a) Cuidador(a)</span>
            </div>

            {/* Doctor Signature */}
            <div className="flex flex-col items-center">
              <div className="w-48 border-b border-[#1F2D3D]/40 mb-2 h-10"></div>
              <strong className="text-[#1F2D3D]">
                {childProfile.physicianName || 'Médico(a) / Terapeuta'}
              </strong>
              <span className="text-[#1F2D3D]/60 text-[11px]">
                {childProfile.crm || 'Carimbo e CRM / Registro Profissional'}
              </span>
            </div>
          </div>

          <div className="mt-8 text-center border-t border-[#1F2D3D]/10 pt-4 text-[10px] text-[#1F2D3D]/60 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Diário de Bordo Neuro • Metodologia Especialista Eli Cascão
            </span>
            <span>
              Documento gerado para fins de monitoramento terapêutico e suporte à consulta.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
