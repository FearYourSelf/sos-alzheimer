import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StrategyTab: React.FC = () => {
  const data = {
    labels: ['Familiar', 'Cuidador 12h', 'Cuidador 24h', 'Asilo'],
    datasets: [
      {
        label: 'Custo R$',
        data: [500, 3000, 7500, 5000],
        backgroundColor: '#3b82f6',
      },
      {
        label: 'Estresse (Subjetivo)',
        data: [9000, 5000, 2000, 3000],
        backgroundColor: '#ef4444',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: { stacked: true, display: false },
    },
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow h-80">
          <h3 className="text-lg font-bold mb-4">Custo Financeiro vs. Emocional</h3>
          <div className="h-64">
            <Bar data={data} options={options} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow space-y-4">
          <h3 className="text-lg font-bold mb-2">Programas Públicos (BH)</h3>
          
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded">
            <h4 className="font-bold text-sm text-yellow-800 dark:text-yellow-200">Programa Maior Cuidado (PBH)</h4>
            <p className="text-xs mt-1 text-gray-700 dark:text-gray-300">Cuidadores gratuitos via CRAS para famílias vulneráveis.</p>
          </div>

          <div className="p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
            <h4 className="font-bold text-sm text-green-800 dark:text-green-200">Melhor em Casa (SUS)</h4>
            <p className="text-xs mt-1 text-gray-700 dark:text-gray-300">Equipe multidisciplinar (Médico/Fisio) em casa. Solicitar na UPA na alta ou UBS.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyTab;
