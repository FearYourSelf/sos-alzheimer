import React, { useState, useEffect } from 'react';
import { PatientData, Medication } from '../types';
import { Save, Plus, Trash, AlertOctagon, User, Calendar, FileHeart, Activity } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const initialPatientData: PatientData = {
  name: '',
  age: '',
  bloodType: '',
  insuranceCard: '',
  allergies: '',
  surgeryDate: '',
  surgeonName: '',
  followUpDate: '',
  medications: []
};

const PatientTab: React.FC = () => {
  const { showNotification } = useNotification();
  const [data, setData] = useState<PatientData>(initialPatientData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sos_patient_data');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('sos_patient_data', JSON.stringify(data));
    showNotification('Dados atualizados com sucesso!');
    setIsEditing(false);
  };

  const updateField = (field: keyof PatientData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addMedication = () => {
    const newMed: Medication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      time: ''
    };
    setData(prev => ({
      ...prev,
      medications: [...prev.medications, newMed]
    }));
  };

  const removeMedication = (id: string) => {
    setData(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m.id !== id)
    }));
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setData(prev => ({
      ...prev,
      medications: prev.medications.map(m => 
        m.id === id ? { ...m, [field]: value } : m
      )
    }));
  };

  return (
    <div className="animate-fadeIn max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileHeart className="text-red-600" /> Prontuário Digital
        </h2>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition ${
            isEditing 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isEditing ? <><Save className="w-4 h-4" /> Salvar</> : 'Editar Dados'}
        </button>
      </div>

      {/* Allergies - Critical Info */}
      <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-8 border-red-600 rounded shadow-sm">
        <div className="flex items-start gap-3">
          <AlertOctagon className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" />
          <div className="w-full">
            <h3 className="font-bold text-red-800 dark:text-red-200 text-lg">ALERGIAS IMPORTANTES</h3>
            {isEditing ? (
              <textarea 
                value={data.allergies}
                onChange={(e) => updateField('allergies', e.target.value)}
                className="w-full mt-2 p-2 rounded border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900"
                placeholder="Ex: DIPIRONA, LATEX, CAMARÃO..."
                rows={2}
              />
            ) : (
              <p className="text-red-900 dark:text-red-100 font-bold text-xl mt-1 uppercase">
                {data.allergies || "Nenhuma alergia registrada"}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Vitals */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border-t-4 border-blue-500">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <User className="w-5 h-5" /> Dados Pessoais
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase">Nome Completo</label>
              {isEditing ? (
                <input type="text" value={data.name} onChange={(e) => updateField('name', e.target.value)} className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700" />
              ) : <p className="font-medium">{data.name || '-'}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Idade</label>
                {isEditing ? (
                    <input type="text" value={data.age} onChange={(e) => updateField('age', e.target.value)} className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700" />
                ) : <p className="font-medium">{data.age || '-'}</p>}
               </div>
               <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Tipo Sanguíneo</label>
                {isEditing ? (
                    <input type="text" value={data.bloodType} onChange={(e) => updateField('bloodType', e.target.value)} className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700" />
                ) : <p className="font-medium">{data.bloodType || '-'}</p>}
               </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase">Carteirinha (Unimed/SUS)</label>
              {isEditing ? (
                <input type="text" value={data.insuranceCard} onChange={(e) => updateField('insuranceCard', e.target.value)} className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700" />
              ) : <p className="font-medium font-mono bg-gray-100 dark:bg-slate-700 p-1 rounded inline-block">{data.insuranceCard || '-'}</p>}
            </div>
          </div>
        </div>

        {/* Surgery Info */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border-t-4 border-orange-500">
           <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <Activity className="w-5 h-5" /> Histórico Cirúrgico (Fêmur)
          </h3>
          <div className="space-y-4">
             <div>
              <label className="text-xs text-gray-500 font-bold uppercase">Data da Cirurgia</label>
              {isEditing ? (
                <input type="date" value={data.surgeryDate} onChange={(e) => updateField('surgeryDate', e.target.value)} className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700" />
              ) : <p className="font-medium">{data.surgeryDate ? new Date(data.surgeryDate).toLocaleDateString('pt-BR') : '-'}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase">Cirurgião Responsável</label>
              {isEditing ? (
                <input type="text" value={data.surgeonName} onChange={(e) => updateField('surgeonName', e.target.value)} className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700" />
              ) : <p className="font-medium">{data.surgeonName || '-'}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase">Próximo Retorno</label>
              {isEditing ? (
                <input type="date" value={data.followUpDate} onChange={(e) => updateField('followUpDate', e.target.value)} className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700" />
              ) : <p className="font-medium text-orange-600 font-bold">{data.followUpDate ? new Date(data.followUpDate).toLocaleDateString('pt-BR') : '-'}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Medication List */}
      <div className="mt-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">💊 Lista de Medicamentos</h3>
             {isEditing && (
                 <button onClick={addMedication} className="flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition">
                     <Plus className="w-3 h-3" /> Adicionar
                 </button>
             )}
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-300">
                    <tr>
                        <th className="p-3 rounded-tl-lg">Nome do Remédio</th>
                        <th className="p-3">Dosagem</th>
                        <th className="p-3">Horário</th>
                        {isEditing && <th className="p-3 rounded-tr-lg">Ação</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {data.medications.length === 0 && (
                        <tr><td colSpan={4} className="p-4 text-center text-gray-400 italic">Nenhum medicamento cadastrado.</td></tr>
                    )}
                    {data.medications.map(med => (
                        <tr key={med.id}>
                            <td className="p-3">
                                {isEditing ? (
                                    <input placeholder="Ex: Quetiapina" className="w-full p-1 border rounded dark:bg-slate-900 dark:border-slate-600" value={med.name} onChange={(e) => updateMedication(med.id, 'name', e.target.value)} />
                                ) : <span className="font-bold">{med.name}</span>}
                            </td>
                            <td className="p-3">
                                {isEditing ? (
                                    <input placeholder="Ex: 25mg" className="w-full p-1 border rounded dark:bg-slate-900 dark:border-slate-600" value={med.dosage} onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)} />
                                ) : <span>{med.dosage}</span>}
                            </td>
                            <td className="p-3">
                                {isEditing ? (
                                    <input placeholder="Ex: 20:00" type="time" className="w-full p-1 border rounded dark:bg-slate-900 dark:border-slate-600" value={med.time} onChange={(e) => updateMedication(med.id, 'time', e.target.value)} />
                                ) : <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-0.5 rounded text-xs font-mono">{med.time}</span>}
                            </td>
                            {isEditing && (
                                <td className="p-3">
                                    <button onClick={() => removeMedication(med.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash className="w-4 h-4" /></button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default PatientTab;