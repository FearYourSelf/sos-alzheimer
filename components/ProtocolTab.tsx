
import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ChartDataPoint } from '../types';
import { Printer, Check } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const agitationData: ChartDataPoint[] = [
  { 
    label: 'Dor', 
    value: 45, 
    color: '#ef4444',
    details: "🔴 **DOR FÍSICA (45%):**\nPós-operatório de fêmur é extremamente doloroso. O idoso com demência não diz 'estou com dor', ele bate e grita.\n\n👉 **Ação:** Verifique se o analgésico está no horário. Se faz mais de 4h/6h, considere a dose de resgate prescrita."
  },
  { 
    label: 'Delirium', 
    value: 25, 
    color: '#f97316',
    details: "🟠 **DELIRIUM / INFECÇÃO (25%):**\nConfusão mental súbita geralmente é infecção (Urina ou Pulmão) ou efeito colateral de remédios.\n\n👉 **Ação:** Meça a temperatura e observe o cheiro da urina."
  },
  { 
    label: 'Necessidades', 
    value: 20, 
    color: '#3b82f6',
    details: "🔵 **NECESSIDADES BÁSICAS (20%):**\nO cérebro confuso não sabe pedir.\n1. **Fecaloma:** Intestino preso há dias?\n2. **Bexiga cheia:** Retenção urinária dói muito.\n3. **Fome/Sede:** Ofereça água/gelatina."
  },
  { 
    label: 'Ambiente', 
    value: 10, 
    color: '#94a3b8',
    details: "⚪ **AMBIENTE (10%):**\nExcesso de estímulo. TV alta, muitas pessoas falando, luz forte no rosto.\n\n👉 **Ação:** Apague as luzes, desligue a TV e coloque uma música calma."
  }
];

const ProtocolTab: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const data = {
    labels: agitationData.map(d => d.label),
    datasets: [{
      data: agitationData.map(d => d.value),
      backgroundColor: agitationData.map(d => d.color),
      borderWidth: 0,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
    },
    onClick: (_: any, elements: any[]) => {
      if (elements.length > 0) {
        setSelectedIndex(elements[0].index);
      }
    },
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-end mb-4 print:hidden">
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 px-3 py-1.5 rounded-lg transition"
        >
          <Printer className="w-4 h-4" /> Imprimir Protocolo
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 flex flex-col print:hidden">
          <h4 className="font-bold text-center mb-2 text-gray-700 dark:text-gray-200">
            Gatilhos da Agitação (Toque para ver)
          </h4>
          <div className="relative h-[280px] w-full">
            <Doughnut data={data} options={options} />
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-slate-700 text-sm text-blue-900 dark:text-blue-100 rounded border border-blue-100 dark:border-slate-600 text-left min-h-[160px] shadow-inner transition-all duration-300">
             {selectedIndex !== null ? (
                <div className="whitespace-pre-line leading-relaxed">
                  {agitationData[selectedIndex].details.split('\n').map((line, i) => (
                    <p key={i} className="mb-1">{line.replace(/\*\*/g, '')}</p> 
                  ))}
                </div>
             ) : (
               <p className="text-center italic text-gray-500 dark:text-gray-400 mt-8">
                 Toque nas fatias do gráfico acima para ver instruções detalhadas de manejo.
               </p>
             )}
          </div>
        </div>

        {/* Checklist Section */}
        <div className="lg:col-span-2 space-y-4 print:col-span-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 print:shadow-none print:border print:border-black">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 dark:border-slate-700">Checklist Rápido de Crise</h3>
            <p className="hidden print:block text-sm text-gray-600 mb-4">
              Cole este guia na geladeira ou parede para acesso rápido durante episódios de agitação.
            </p>
            <div className="space-y-3">
              {[
                { title: "1. Analgesia (Dor)", sub: "O remédio de dor está vencido há mais de 4h?", color: "red" },
                { title: "2. Excreção (Banheiro)", sub: "Intestino preso (>3 dias) ou bexiga cheia?", color: "orange" },
                { title: "3. Infecção (Febre/Urina)", sub: "Urina escura/cheiro forte ou febre baixa?", color: "purple" }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => toggleCheck(idx)}
                  className={`flex items-start p-3 bg-${item.color}-50 dark:bg-${item.color}-900/20 border border-${item.color}-100 dark:border-${item.color}-900/30 rounded-lg cursor-pointer hover:bg-${item.color}-100 dark:hover:bg-${item.color}-900/40 transition print:border-black print:bg-white`}
                >
                  <div className={`w-6 h-6 border-2 border-${item.color}-600 rounded mr-3 mt-1 flex-shrink-0 flex items-center justify-center print:border-black ${checkedItems[idx] ? `bg-${item.color}-600` : 'bg-transparent'}`}>
                    {checkedItems[idx] && <Check className="w-4 h-4 text-white print:text-black" />}
                  </div>
                  <div className={checkedItems[idx] ? 'opacity-50 line-through transition-opacity' : ''}>
                    <span className={`block font-bold text-${item.color}-900 dark:text-${item.color}-200 print:text-black`}>{item.title}</span>
                    <span className={`text-sm text-${item.color}-800 dark:text-${item.color}-300 print:text-black`}>{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 hidden print:block pt-4 border-t border-gray-300">
               <h4 className="font-bold">Telefones Úteis:</h4>
               <ul className="text-sm mt-2 space-y-1">
                   <li>SAMU: 192</li>
                   <li>Dra. Samanta (Geriatra): (31) 99108-6138</li>
                   <li>BH Home Care: (31) 98338-1373</li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolTab;
