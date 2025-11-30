
import React, { useState, useEffect } from 'react';
import { AgitationLog, ShiftNote } from '../types';
import { ClipboardList, PlusCircle, Clock, Save, History, Moon, Sun } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const DiaryTab: React.FC = () => {
  const { showNotification } = useNotification();
  
  // State for Agitation Logs
  const [logs, setLogs] = useState<AgitationLog[]>([]);
  const [newLog, setNewLog] = useState<Partial<AgitationLog>>({ severity: 5, trigger: 'unknown', action: '' });
  
  // State for Shift Note
  const [shiftNote, setShiftNote] = useState<ShiftNote>({ content: '', lastUpdated: '' });

  useEffect(() => {
    // Load Logs
    const savedLogs = localStorage.getItem('sos_diary_logs');
    if (savedLogs) setLogs(JSON.parse(savedLogs));

    // Load Note
    const savedNote = localStorage.getItem('sos_shift_note');
    if (savedNote) setShiftNote(JSON.parse(savedNote));
  }, []);

  const addLog = () => {
    if (!newLog.action) {
      showNotification('Descreva a ação tomada.', 'info');
      return;
    }
    
    const entry: AgitationLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      trigger: newLog.trigger as any,
      severity: newLog.severity || 5,
      action: newLog.action || ''
    };

    const updatedLogs = [entry, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('sos_diary_logs', JSON.stringify(updatedLogs));
    setNewLog({ severity: 5, trigger: 'unknown', action: '' });
    showNotification('Episódio registrado.');
  };

  const saveShiftNote = () => {
    const updatedNote = {
        content: shiftNote.content,
        lastUpdated: new Date().toISOString()
    };
    setShiftNote(updatedNote);
    localStorage.setItem('sos_shift_note', JSON.stringify(updatedNote));
    showNotification('Nota de turno salva.');
  };

  return (
    <div className="animate-fadeIn max-w-5xl mx-auto pb-10 grid md:grid-cols-2 gap-6">
      
      {/* Column 1: Shift Handoff */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow h-fit border-t-4 border-teal-500">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-teal-800 dark:text-teal-200">
          <ClipboardList className="w-5 h-5" /> Troca de Turno
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Deixe recados importantes para o próximo cuidador (ex: alimentação, intestino, sono).
        </p>
        
        <textarea 
          className="w-full h-48 p-3 border rounded-lg bg-yellow-50 dark:bg-slate-900 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none resize-none"
          placeholder="Ex: Almoçou tudo. Intestino funcionou às 14h. Tomou banho sem reclamar..."
          value={shiftNote.content}
          onChange={(e) => setShiftNote({ ...shiftNote, content: e.target.value })}
        />
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-400 italic">
            Última edição: {shiftNote.lastUpdated ? new Date(shiftNote.lastUpdated).toLocaleString('pt-BR') : 'Nunca'}
          </span>
          <button 
            onClick={saveShiftNote}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-teal-700 transition"
          >
            <Save className="w-4 h-4" /> Salvar Nota
          </button>
        </div>
      </div>

      {/* Column 2: Agitation Log */}
      <div className="space-y-6">
        
        {/* Form */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border-t-4 border-indigo-500">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
                <PlusCircle className="w-5 h-5" /> Registrar Episódio de Agitação
            </h3>
            
            <div className="space-y-3">
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Gatilho (Provável)</label>
                    <select 
                        className="w-full p-2 rounded border bg-gray-50 dark:bg-slate-900 dark:border-slate-700 mt-1"
                        value={newLog.trigger}
                        onChange={(e) => setNewLog({...newLog, trigger: e.target.value as any})}
                    >
                        <option value="pain">Dor</option>
                        <option value="bathroom">Banheiro/Fralda</option>
                        <option value="hunger">Fome/Sede</option>
                        <option value="environment">Ambiente/Barulho</option>
                        <option value="unknown">Não identificado</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Intensidade (1-10)</label>
                    <input 
                        type="range" min="1" max="10" 
                        className="w-full mt-2"
                        value={newLog.severity}
                        onChange={(e) => setNewLog({...newLog, severity: parseInt(e.target.value)})}
                    />
                    <div className="text-center text-sm font-bold text-indigo-600">{newLog.severity}</div>
                </div>

                <div>
                    <label className="text-xs font-bold uppercase text-gray-500">O que foi feito?</label>
                    <input 
                        type="text" 
                        placeholder="Ex: Dei dipirona, coloquei música..."
                        className="w-full p-2 rounded border bg-gray-50 dark:bg-slate-900 dark:border-slate-700 mt-1"
                        value={newLog.action}
                        onChange={(e) => setNewLog({...newLog, action: e.target.value})}
                    />
                </div>

                <button 
                    onClick={addLog}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition mt-2"
                >
                    Registrar
                </button>
            </div>
        </div>

        {/* History List */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow max-h-[400px] overflow-y-auto">
             <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <History className="w-4 h-4" /> Histórico Recente
            </h3>
            
            <div className="space-y-3">
                {logs.length === 0 && <p className="text-center text-gray-400 text-sm italic">Nenhum registro ainda.</p>}
                {logs.map(log => (
                    <div key={log.id} className="border-l-2 border-indigo-300 pl-3 py-1">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-slate-700 px-1 rounded flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(log.timestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'})}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${log.severity > 7 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                Nível {log.severity}
                            </span>
                        </div>
                        <p className="font-bold text-sm mt-1 text-slate-800 dark:text-slate-200 capitalize">
                            Gatilho: {log.trigger === 'pain' ? 'Dor' : log.trigger === 'bathroom' ? 'Banheiro' : log.trigger === 'hunger' ? 'Fome' : 'Outro'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            "{log.action}"
                        </p>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default DiaryTab;
