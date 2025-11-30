import React from 'react';

const LegalTab: React.FC = () => {
  return (
    <div className="animate-fadeIn max-w-4xl mx-auto space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 p-4 rounded shadow">
          <h4 className="font-bold text-red-800 dark:text-red-200">Delegacia do Idoso</h4>
          <p className="text-xs text-red-700 dark:text-red-300 mb-2">Av. Barbacena, 288. Violência/Risco.</p>
          <a href="tel:3133305754" className="block text-center text-red-800 font-bold text-sm bg-white/50 px-3 py-1 rounded w-full border border-red-200 hover:bg-white transition">
            📞 (31) 3330-5754
          </a>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-600 p-4 rounded shadow">
          <h4 className="font-bold text-purple-800 dark:text-purple-200">Disque 100</h4>
          <p className="text-xs text-purple-700 dark:text-purple-300 mb-2">Denúncia Federal 24h.</p>
          <a href="tel:100" className="block text-center text-purple-800 font-bold text-sm bg-white/50 px-3 py-1 rounded w-full border border-purple-200 hover:bg-white transition">
            📞 Disque 100
          </a>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">Guia: Curatela</h3>
        <div className="space-y-4">
          <details className="group bg-gray-50 dark:bg-slate-700 rounded-lg p-3 cursor-pointer">
            <summary className="font-bold text-sm list-none flex justify-between items-center">
              1. O que é?
              <span className="transform group-open:rotate-180 transition">▼</span>
            </summary>
            <p className="text-xs mt-2 p-2 border-t border-gray-200 dark:border-gray-600">
              Medida judicial para nomear um responsável legal (Curador) para o idoso que já não pode responder por seus atos civis.
            </p>
          </details>
          <details className="group bg-gray-50 dark:bg-slate-700 rounded-lg p-3 cursor-pointer">
            <summary className="font-bold text-sm list-none flex justify-between items-center">
              2. Onde conseguir ajuda gratuita?
              <span className="transform group-open:rotate-180 transition">▼</span>
            </summary>
            <p className="text-xs mt-2 p-2 border-t border-gray-200 dark:border-gray-600">
              Defensoria Pública de MG: Rua Guajajaras, 1707. Tel: (31) 3526-5000. Levar laudo médico atestando a incapacidade.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default LegalTab;
