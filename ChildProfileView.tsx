import React, { useState } from 'react';
import { 
  User, 
  Stethoscope, 
  Save, 
  CheckCircle, 
  RotateCcw, 
  Download, 
  FileCheck,
  HeartHandshake
} from 'lucide-react';
import { ChildProfile } from '../types';
import { saveChildProfile, DEFAULT_CHILD_PROFILE, seedInitialDataIfEmpty } from '../utils/storage';

interface ChildProfileViewProps {
  profile: ChildProfile;
  onSaveProfile: (updatedProfile: ChildProfile) => void;
  onNavigateToTracker: () => void;
}

export const ChildProfileView: React.FC<ChildProfileViewProps> = ({
  profile: initialProfile,
  onSaveProfile,
  onNavigateToTracker,
}) => {
  const [formData, setFormData] = useState<ChildProfile>(initialProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveChildProfile(formData);
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToExample = () => {
    setFormData(DEFAULT_CHILD_PROFILE);
    saveChildProfile(DEFAULT_CHILD_PROFILE);
    onSaveProfile(DEFAULT_CHILD_PROFILE);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 px-4 sm:px-6">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#1F2D3D]/10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4BA3A6] block mb-1">
              Configurações do Paciente
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F2D3D] font-heading">
              Identificação Clínica da Criança
            </h2>
            <p className="text-xs text-[#1F2D3D]/60 mt-0.5">
              Estes dados serão incorporados no cabeçalho e assinatura do relatório médico exportado.
            </p>
          </div>

          <button
            type="submit"
            id="btn-save-profile-top"
            className="flex items-center gap-2 bg-[#4BA3A6] hover:bg-[#3d8c8f] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Dados</span>
          </button>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          {/* Child Information */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#1F2D3D]/10">
            <h3 className="text-sm font-bold text-[#1F2D3D] mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#4BA3A6]" />
              <span>Dados da Criança</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#1F2D3D] block mb-1.5">
                  Nome Completo da Criança *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Lucas Ferreira Cascão"
                  className="w-full p-2.5 text-xs rounded-xl border border-[#1F2D3D]/15 focus:ring-2 focus:ring-[#4BA3A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2D3D] block mb-1.5">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#1F2D3D]/15 focus:ring-2 focus:ring-[#4BA3A6] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#1F2D3D] block mb-1.5">
                  Diagnóstico Clínico / CID / Hipótese em Investigação *
                </label>
                <input
                  type="text"
                  required
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="Ex: TEA Nível 1 de Suporte (F84.0) + Suspeita TDAH"
                  className="w-full p-2.5 text-xs rounded-xl border border-[#1F2D3D]/15 focus:ring-2 focus:ring-[#4BA3A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2D3D] block mb-1.5">
                  Nome do(a) Responsável / Cuidador(a) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.responsibleName}
                  onChange={(e) => setFormData({ ...formData, responsibleName: e.target.value })}
                  placeholder="Ex: Patrícia Ferreira"
                  className="w-full p-2.5 text-xs rounded-xl border border-[#1F2D3D]/15 focus:ring-2 focus:ring-[#4BA3A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2D3D] block mb-1.5">
                  Telefone / WhatsApp de Contato
                </label>
                <input
                  type="text"
                  value={formData.responsiblePhone || ''}
                  onChange={(e) => setFormData({ ...formData, responsiblePhone: e.target.value })}
                  placeholder="Ex: (11) 98765-4321"
                  className="w-full p-2.5 text-xs rounded-xl border border-[#1F2D3D]/15 focus:ring-2 focus:ring-[#4BA3A6] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Physician Information */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#1F2D3D]/10">
            <h3 className="text-sm font-bold text-[#1F2D3D] mb-4 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#4BA3A6]" />
              <span>Médico(a) ou Terapeuta Assistente</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#1F2D3D] block mb-1.5">
                  Nome do(a) Especialista
                </label>
                <input
                  type="text"
                  value={formData.physicianName}
                  onChange={(e) => setFormData({ ...formData, physicianName: e.target.value })}
                  placeholder="Ex: Dra. Camila Vasconcelos"
                  className="w-full p-2.5 text-xs rounded-xl border border-[#1F2D3D]/15 focus:ring-2 focus:ring-[#4BA3A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1F2D3D] block mb-1.5">
                  Especialidade
                </label>
                <input
                  type="text"
                  value={formData.physicianSpecialty || ''}
                  onChange={(e) => setFormData({ ...formData, physicianSpecialty: e.target.value })}
                  placeholder="Ex: Neuropediatria / Psiquiatria Infantil"
                  className="w-full p-2.5 text-xs rounded-xl border border-[#1F2D3D]/15 focus:ring-2 focus:ring-[#4BA3A6] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#1F2D3D] block mb-1.5">
                  Registro Profissional / CRM / RQE / CRP / Crefito
                </label>
                <input
                  type="text"
                  value={formData.crm || ''}
                  onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                  placeholder="Ex: CRM/SP 142.890 - RQE 45.120"
                  className="w-full p-2.5 text-xs rounded-xl border border-[#1F2D3D]/15 focus:ring-2 focus:ring-[#4BA3A6] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#1F2D3D] block mb-1.5">
                  Notas Clínicas e Metodologia de Acompanhamento
                </label>
                <textarea
                  rows={2}
                  value={formData.clinicalNotes || ''}
                  onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
                  placeholder="Ex: Protocolo de observação diária Metodologia Eli Cascão com foco em regulação sensorial e transições..."
                  className="w-full p-2.5 text-xs rounded-xl border border-[#1F2D3D]/15 focus:ring-2 focus:ring-[#4BA3A6] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Row & Methodology Note */}
          <div className="bg-[#CFE1D6]/30 border border-[#4BA3A6]/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <HeartHandshake className="w-6 h-6 text-[#4BA3A6] shrink-0" />
              <div className="text-xs text-[#1F2D3D]">
                <strong className="block font-bold">Metodologia Eli Cascão</strong>
                <span>Todos os registros são armazenados localmente no seu dispositivo com total privacidade.</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToExample}
                className="px-3 py-2 text-xs font-semibold bg-white border border-[#1F2D3D]/15 text-[#1F2D3D] hover:bg-[#F4E9E1] rounded-xl transition cursor-pointer"
              >
                Carregar Exemplo Modelo
              </button>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {savedSuccess && (
          <div className="fixed top-20 right-4 z-50 notification-toast animate-bounce">
            <div className="bg-[#1F2D3D] text-white border-2 border-[#4BA3A6] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#4BA3A6]" />
              <div>
                <p className="text-xs font-bold text-white">Dados Salvos!</p>
                <p className="text-[11px] text-[#CFE1D6]">
                  Perfil da criança atualizado para os relatórios.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
