
import React, { useState } from 'react';
import { generateCrisisStrategy, draftFamilyMessage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Sparkles, MessageSquare, AlertTriangle, Loader2 } from 'lucide-react';

const AITab: React.FC = () => {
  const [crisisInput, setCrisisInput] = useState('');
  const [crisisOutput, setCrisisOutput] = useState('');
  const [loadingCrisis, setLoadingCrisis] = useState(false);

  const [msgInput, setMsgInput] = useState('');
  const [msgOutput, setMsgOutput] = useState('');
  const [loadingMsg, setLoadingMsg] = useState(false);

  const handleCrisisSubmit = async () => {
    if (!crisisInput) return;
    setLoadingCrisis(true);
    try {
      const result = await generateCrisisStrategy(crisisInput);
      setCrisisOutput(result);
    } catch (error) {
      setCrisisOutput("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoadingCrisis(false);
    }
  };

  const handleMsgSubmit = async () => {
    if (!msgInput) return;
    setLoadingMsg(true);
    try {
      const result = await draftFamilyMessage(msgInput);
      setMsgOutput(result);
    } catch (error) {
      setMsgOutput("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoadingMsg(false);
    }
  };

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto space-y-6">
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 flex items-start gap-3">
        <Sparkles className="w-8 h-8 text-purple-600 mt-1" />
        <div>
          <h2 className="font-bold text-purple-900 dark:text-purple-100">Inteligência Artificial de Apoio</h2>
          <p className="text-sm text-purple-800 dark:text-purple-200">
            Ferramentas automáticas pra momentos de estresse ao cuidar da Vó.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Crisis Consultant */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-blue-500" /> Consultor de Crise
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Descreva o comportamento (ex: "Ela diz que foi roubada", "Recusa banho") e receba um script do que dizer.
          </p>
          
          <textarea 
            value={crisisInput}
            onChange={(e) => setCrisisInput(e.target.value)}
            className="w-full p-3 border rounded-lg mb-3 text-sm focus:ring-2 focus:ring-blue-500 h-24 bg-gray-50 dark:bg-slate-900 dark:border-slate-700"
            placeholder="Ex: Minha mãe está gritando que quer ir embora para a casa da mãe dela (que já faleceu)..."
          />
          
          <button 
            onClick={handleCrisisSubmit}
            disabled={loadingCrisis || !crisisInput}
            className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loadingCrisis ? <Loader2 className="animate-spin" /> : <span>Gerar Estratégia ✨</span>}
          </button>
          
          {crisisOutput && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm border border-gray-200 dark:border-slate-600 prose dark:prose-invert max-w-none">
              <ReactMarkdown>{crisisOutput}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Family Messenger */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-t-4 border-green-500">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-500" /> Mensageiro Familiar
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Crie mensagens difíceis para o grupo da família (pedir dinheiro, dividir plantão, impor limites).
          </p>
          
          <textarea 
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            className="w-full p-3 border rounded-lg mb-3 text-sm focus:ring-2 focus:ring-green-500 h-24 bg-gray-50 dark:bg-slate-900 dark:border-slate-700"
            placeholder="Ex: Preciso pedir ajuda para pagar o cuidador noturno pois estamos sem dormir, dificultando os cuidados dela..."
          />
          
          <button 
            onClick={handleMsgSubmit}
            disabled={loadingMsg || !msgInput}
            className="w-full py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loadingMsg ? <Loader2 className="animate-spin" /> : <span>Rascunhar Mensagem ✨</span>}
          </button>
          
          {msgOutput && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm border border-gray-200 dark:border-slate-600 whitespace-pre-wrap">
              <ReactMarkdown>{msgOutput}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITab;
