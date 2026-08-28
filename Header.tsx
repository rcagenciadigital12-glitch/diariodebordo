import React from 'react';
import { 
  HeartHandshake, 
  Calendar, 
  FileText, 
  History, 
  User, 
  Printer, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ActiveTab, ChildProfile } from '../types';
import { formatDatePtBR, getTodayDateString } from '../utils/storage';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  childProfile: ChildProfile;
  onOpenProfile: () => void;
  hasUnsavedChanges?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedDate,
  setSelectedDate,
  childProfile,
  onOpenProfile,
}) => {
  const today = getTodayDateString();
  const isToday = selectedDate === today;

  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() - 1);
    const newDateStr = dateObj.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + 1);
    const newDateStr = dateObj.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
  };

  return (
    <header className="bg-[#1F2D3D] text-white shadow-md sticky top-0 z-30 transition-all border-b border-[#4BA3A6]/30">
      {/* Top Branding & Child Context Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Methodology */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4BA3A6] to-[#2B8285] flex items-center justify-center shadow-inner text-white">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight font-heading text-white">
                Diário de Bordo Neuro
              </h1>
              <span className="bg-[#CFE1D6] text-[#1F2D3D] text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Eli Cascão
              </span>
            </div>
            <p className="text-xs text-[#F4E9E1]/80">
              Rastreamento & Regulação Sensorial para Famílias Atípicas
            </p>
          </div>
        </div>

        {/* Child Profile Quick Capsule & Date Picker */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Child quick info pill */}
          <button
            id="btn-child-profile-header"
            onClick={onOpenProfile}
            title="Editar perfil da criança e médico"
            className="flex items-center gap-2 bg-[#F4E9E1]/10 hover:bg-[#F4E9E1]/20 border border-[#F4E9E1]/20 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer text-left"
          >
            <User className="w-3.5 h-3.5 text-[#4BA3A6]" />
            <div>
              <span className="font-semibold text-white block truncate max-w-[130px] sm:max-w-[180px]">
                {childProfile.name || 'Adicionar Criança'}
              </span>
              <span className="text-[10px] text-[#CFE1D6] block truncate max-w-[130px] sm:max-w-[180px]">
                {childProfile.diagnosis || 'Configurar diagnóstico'}
              </span>
            </div>
          </button>

          {/* Date Selector Navigation */}
          <div className="flex items-center bg-[#131D27] rounded-lg p-1 border border-white/10 text-xs">
            <button
              id="btn-prev-day"
              onClick={handlePrevDay}
              title="Dia anterior"
              className="p-1 hover:bg-white/10 rounded text-[#F4E9E1]/70 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#4BA3A6]" />
              <input
                id="input-selected-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
              />
            </div>

            <button
              id="btn-next-day"
              onClick={handleNextDay}
              title="Próximo dia"
              className="p-1 hover:bg-white/10 rounded text-[#F4E9E1]/70 hover:text-white transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isToday && (
              <button
                id="btn-jump-today"
                onClick={() => setSelectedDate(today)}
                className="ml-1 bg-[#4BA3A6] hover:bg-[#3d8c8f] text-white px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer"
              >
                Hoje
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-[#192431] border-t border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none py-1">
          <nav className="flex space-x-1 sm:space-x-2" aria-label="Abas de navegação">
            <button
              id="tab-tracker"
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === 'tracker'
                  ? 'bg-[#4BA3A6] text-white shadow-sm'
                  : 'text-[#F4E9E1]/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Registro do Dia ({formatDatePtBR(selectedDate)})</span>
            </button>

            <button
              id="tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === 'history'
                  ? 'bg-[#4BA3A6] text-white shadow-sm'
                  : 'text-[#F4E9E1]/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Histórico & Calendário</span>
            </button>

            <button
              id="tab-report"
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap relative ${
                activeTab === 'report'
                  ? 'bg-[#FF7D6E] text-white shadow-sm'
                  : 'text-[#FF7D6E] bg-[#FF7D6E]/10 hover:bg-[#FF7D6E]/20'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Relatório Clínico (Exportar)</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7D6E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF7D6E]"></span>
              </span>
            </button>

            <button
              id="tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-[#4BA3A6] text-white shadow-sm'
                  : 'text-[#F4E9E1]/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Dados Clínicos</span>
            </button>
          </nav>

          {activeTab === 'report' && (
            <button
              id="btn-quick-print"
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-2 bg-[#4BA3A6] hover:bg-[#3d8c8f] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
