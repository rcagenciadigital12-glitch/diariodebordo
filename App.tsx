import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, DailyLog, ChildProfile } from './types';
import { Header } from './components/Header';
import { DailyTrackerForm } from './components/DailyTrackerForm';
import { ClinicalReportView } from './components/ClinicalReportView';
import { HistoryView } from './components/HistoryView';
import { ChildProfileView } from './components/ChildProfileView';
import { 
  getTodayDateString, 
  getDailyLog, 
  getChildProfile, 
  seedInitialDataIfEmpty 
} from './utils/storage';

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('tracker');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [currentLog, setCurrentLog] = useState<DailyLog>(() => getDailyLog(getTodayDateString()));
  const [childProfile, setChildProfile] = useState<ChildProfile>(() => getChildProfile());

  // Initialize and seed sample data once on mount
  useEffect(() => {
    seedInitialDataIfEmpty();
    const today = getTodayDateString();
    setSelectedDate(today);
    setCurrentLog(getDailyLog(today));
    setChildProfile(getChildProfile());
    setInitialized(true);
  }, []);

  // When selectedDate changes, load that date's log
  useEffect(() => {
    if (selectedDate) {
      setCurrentLog(getDailyLog(selectedDate));
    }
  }, [selectedDate]);

  const handleSaveLog = useCallback((savedLog: DailyLog) => {
    setCurrentLog(savedLog);
  }, []);

  const handleSaveProfile = useCallback((profile: ChildProfile) => {
    setChildProfile(profile);
  }, []);

  const handleSelectDateFromHistory = useCallback((date: string) => {
    setSelectedDate(date);
    setCurrentLog(getDailyLog(date));
    setActiveTab('tracker');
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#F4E9E1]/30 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-12 h-12 border-4 border-[#4BA3A6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold text-[#1F2D3D]">Carregando Diário de Bordo Neuro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4E9E1]/30 text-[#1F2D3D] flex flex-col selection:bg-[#4BA3A6]/20">
      {/* Header with Navigation and Date Controller */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        childProfile={childProfile}
        onOpenProfile={() => setActiveTab('profile')}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-6">
        {activeTab === 'tracker' && (
          <DailyTrackerForm
            log={currentLog}
            onSave={handleSaveLog}
            onNavigateToReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            onSelectDate={handleSelectDateFromHistory}
            onNewLog={() => {
              const today = getTodayDateString();
              setSelectedDate(today);
              setCurrentLog(getDailyLog(today));
              setActiveTab('tracker');
            }}
          />
        )}

        {activeTab === 'report' && (
          <ClinicalReportView
            childProfile={childProfile}
            onEditLog={(date) => {
              setSelectedDate(date);
              setCurrentLog(getDailyLog(date));
              setActiveTab('tracker');
            }}
          />
        )}

        {activeTab === 'profile' && (
          <ChildProfileView
            profile={childProfile}
            onSaveProfile={handleSaveProfile}
            onNavigateToTracker={() => setActiveTab('tracker')}
          />
        )}
      </main>
    </div>
  );
}
