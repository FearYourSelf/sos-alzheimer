
import React, { useState, useEffect } from 'react';
import { Resource, GeoLocation, IWindow } from '../types';
import { searchNearbyResources } from '../services/geminiService';
import { useNotification } from '../context/NotificationContext';
import ReactMarkdown from 'react-markdown';
import { MapPin, Search, Loader2, Mic, MicOff, ExternalLink, X, Truck, Activity, Armchair } from 'lucide-react';

const initialResources: Resource[] = [
  // Type 1: New Data (BH Specifics)
  { id: 'eq1', cat: 'equipamento', name: 'Hospitel', sub: 'Aluguel Hospitalar', phone: '(31) 3281-9000', desc: 'Cama hospitalar, cadeira de rodas/banho, andadores. Entregam em casa.' },
  { id: 'eq2', cat: 'equipamento', name: 'Locmed', sub: 'Equipamentos', phone: '(31) 3224-2111', desc: 'Colchão casca de ovo, muletas e oxigênio.' },
  { id: 'eq3', cat: 'equipamento', name: 'Ortholoc', sub: 'Ortopedia', phone: '(31) 3273-6060', desc: 'Locação rápida de itens pós-operatórios.' },
  
  { id: 'tr1', cat: 'transporte', name: 'Brasil Ambulâncias', sub: 'Particular', phone: '(31) 3422-2222', desc: 'Transporte para exames e alta hospitalar (não emergência).' },
  { id: 'tr2', cat: 'transporte', name: 'Táxi Acessível BH', sub: 'Prefeitura', phone: '156', desc: 'Táxis adaptados para cadeira de rodas (agendar com antecedência).' },
  
  { id: 'fis1', cat: 'fisio', name: 'Coop. Fisioterapia', sub: 'Domiciliar', phone: '(31) 3241-1000', desc: 'Especialistas em reabilitação pós-fratura de fêmur.' },
  { id: 'fis2', cat: 'fisio', name: 'Home Fisio BH', sub: 'Geriatria', phone: '(31) 99999-0000', desc: 'Foco em treino de marcha e fortalecimento.' },

  // Existing Data
  { id: '1', cat: 'medico', name: 'Dra. Samanta Rodrigues', sub: 'Geriatra Domiciliar', phone: '(31) 99108-6138', desc: 'Atendimento domiciliar BH. Especializada em demências.' },
  { id: '2', cat: 'medico', name: 'Dra. Isabela Lopes', sub: 'Geriatra Domiciliar', phone: '(31) 98318-8699', desc: 'Geriatra. Foco em suporte familiar.' },
  { id: '3', cat: 'homecare', name: 'BH Home Care', sub: 'Agência', phone: '(31) 98338-1373', desc: 'Foco em Alzheimer. Urgências.' },
  { id: '4', cat: 'publico', name: 'CERSAM', sub: 'Urgência Mental', phone: 'Busque no Maps', desc: 'Crises graves de agitação.' },
  { id: '5', cat: 'publico', name: 'Prog. Maior Cuidado', sub: 'PBH', phone: 'Ir ao CRAS', desc: 'Cuidadores gratuitos (vulneráveis).' },
  { id: '6', cat: 'insumos', name: 'Araujo', sub: 'Delivery 24h', phone: '(31) 3270-5000', desc: 'Fraldas e remédios.' },
];

const DirectoryTab: React.FC = () => {
  const { showNotification } = useNotification();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  
  // AI State
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasLocationAccess, setHasLocationAccess] = useState(false);

  // Check Location Permission on Mount
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setHasLocationAccess(result.state === 'granted');
        result.onchange = () => setHasLocationAccess(result.state === 'granted');
      });
    }
  }, []);

  const filteredResources = initialResources.filter(r => {
    const matchesFilter = filter === 'all' || r.cat === filter;
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                          r.desc.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleVoiceSearch = () => {
    const windowObj = window as unknown as IWindow;
    const SpeechRecognition = windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showNotification("Seu navegador não suporta busca por voz.", 'info');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
        setIsListening(false);
        let msg = "Erro ao capturar áudio.";
        if (event.error === 'no-speech') msg = "Não ouvi nada. Tente falar mais perto do microfone.";
        if (event.error === 'not-allowed') msg = "Permissão do microfone negada.";
        if (event.error === 'aborted') msg = "Busca por voz cancelada.";
        
        showNotification(msg, 'info');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAiSearchQuery(transcript);
      showNotification("Áudio capturado!", 'success');
    };

    recognition.start();
  };

  const handleAiSearch = async () => {
    if (!aiSearchQuery) return;
    setIsAiLoading(true);
    setAiResult(null);

    try {
        // Try to get location
        let location: GeoLocation | undefined;
        try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => 
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
            );
            location = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            };
            setHasLocationAccess(true);
        } catch (e) {
            console.warn("Location denied or timed out, using default");
            setHasLocationAccess(false);
        }

        const result = await searchNearbyResources(aiSearchQuery, location);
        setAiResult(result);
    } catch (error) {
        setAiResult("Erro ao buscar no Google Maps. Verifique sua conexão e tente novamente.");
    } finally {
        setIsAiLoading(false);
    }
  };

  const clearAiSearch = () => {
    setAiSearchQuery('');
    setAiResult(null);
    setIsAiLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification(`Telefone copiado: ${text}`);
  };

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'medico', label: 'Médicos' },
    { id: 'homecare', label: 'Cuidadores' },
    { id: 'equipamento', label: 'Aluguel Equip.' },
    { id: 'transporte', label: 'Ambulância/Táxi' },
    { id: 'fisio', label: 'Fisioterapia' },
    { id: 'insumos', label: 'Farmácia/Fralda' },
    { id: 'publico', label: 'SUS/Social' },
  ];

  return (
    <div className="animate-fadeIn pb-12">
      {/* Static Directory Search */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow mb-6 sticky top-2 z-40 border border-gray-100 dark:border-slate-700 print:hidden">
        <input 
          type="text" 
          placeholder="Buscar na lista salva (funciona offline)..." 
          className="w-full p-3 border rounded-lg mb-4 bg-gray-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button 
              key={f.id}
              onClick={() => setFilter(f.id)} 
              className={`px-3 py-1 rounded-full text-xs font-bold transition capitalize ${
                filter === f.id 
                  ? 'bg-blue-600 text-white ring-2 ring-offset-1 ring-transparent' 
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Static List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 print:grid-cols-2">
        {filteredResources.map(item => {
           let border = 'border-gray-400';
           let icon = null;

           if(item.cat === 'medico') border = 'border-green-500';
           if(item.cat === 'homecare') border = 'border-blue-500';
           if(item.cat === 'publico') border = 'border-yellow-500';
           if(item.cat === 'insumos') border = 'border-pink-500';
           if(item.cat === 'equipamento') { border = 'border-purple-500'; icon = <Armchair className="w-3 h-3 inline mr-1" />; }
           if(item.cat === 'transporte') { border = 'border-red-500'; icon = <Truck className="w-3 h-3 inline mr-1" />; }
           if(item.cat === 'fisio') { border = 'border-teal-500'; icon = <Activity className="w-3 h-3 inline mr-1" />; }

           return (
            <div key={item.id} className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm hover:shadow-md transition border-l-4 ${border} flex flex-col page-break-inside-avoid`}>
              <div className="mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded inline-block mb-1">
                  {icon} {item.sub}
                </span>
                <h4 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">{item.name}</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">{item.desc}</p>
              <button 
                onClick={() => copyToClipboard(item.phone)} 
                className="w-full py-2 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition text-sm border border-slate-200 dark:border-slate-600 active:scale-95 transform"
              >
                📞 {item.phone}
              </button>
            </div>
           );
        })}
        {filteredResources.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            Nenhum contato salvo encontrado para esta busca. Tente a busca no mapa abaixo.
          </div>
        )}
      </div>

      {/* AI Grounding Search */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-sm relative overflow-hidden print:hidden">
        
        <div className="flex justify-between items-start mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <MapPin className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-indigo-900 dark:text-indigo-200">Não encontrou? Busque no Mapa</h3>
          </div>
          {(aiSearchQuery || aiResult) && (
            <button 
              onClick={clearAiSearch}
              className="text-xs flex items-center gap-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition"
            >
              <X className="w-3 h-3" /> Limpar Busca
            </button>
          )}
        </div>
        
        <p className="text-sm text-indigo-800 dark:text-indigo-300 mb-4 relative z-10">
            Use a inteligência artificial para encontrar farmácias de plantão, especialistas ou clínicas próximas a você.
        </p>

        {hasLocationAccess && (
          <div className="flex items-center gap-1.5 mb-2 text-xs text-green-600 dark:text-green-400 font-semibold animate-fadeIn">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Usando sua localização atual em BH
          </div>
        )}
        
        <div className="flex gap-2 relative z-10">
            <div className="relative flex-grow">
              <input 
                  type="text" 
                  className="w-full p-3 pr-10 rounded-lg border border-indigo-200 dark:border-indigo-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all shadow-sm"
                  placeholder={isListening ? "Ouvindo..." : "Ex: Farmácia 24h no Bairro Floresta..."}
                  value={aiSearchQuery}
                  onChange={(e) => setAiSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                  disabled={isListening}
              />
              <button 
                onClick={handleVoiceSearch}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
                  isListening 
                  ? 'bg-red-100 text-red-600 animate-pulse' 
                  : 'hover:bg-gray-100 text-gray-500 dark:text-gray-400 dark:hover:bg-slate-700'
                }`}
                title="Pesquisa por voz"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            
            <button 
                onClick={handleAiSearch}
                disabled={isAiLoading || !aiSearchQuery}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center min-w-[50px] shadow-md"
            >
                <Search className="h-5 w-5" />
            </button>
        </div>
        
        {isAiLoading && (
          <div className="mt-8 flex flex-col items-center justify-center text-indigo-800 dark:text-indigo-200 animate-pulse py-4">
             <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-bounce" />
                </div>
             </div>
             <span className="font-bold text-lg mt-3">Buscando recursos...</span>
             <span className="text-xs opacity-75 mt-1">Consultando Google Maps e IA</span>
          </div>
        )}

        {aiResult && !isAiLoading && (
            <div className="mt-6 p-5 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-indigo-100 dark:border-slate-700 animate-fadeIn">
                <div className="prose dark:prose-invert max-w-none text-sm">
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => {
                        const isMaps = props.href?.includes('maps') || props.href?.includes('google.com');
                        if (isMaps) {
                          return (
                            <a 
                              {...props} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all border border-blue-100 dark:border-blue-800/50 mt-2 no-underline group font-semibold shadow-sm"
                            >
                              <div className="bg-white dark:bg-blue-800 p-1.5 rounded-md shadow-sm group-hover:scale-110 transition-transform">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <span className="flex-grow">{props.children}</span>
                              <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                            </a>
                          );
                        }
                        return <a {...props} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" />;
                      },
                      ul: ({node, ...props}) => <ul {...props} className="space-y-2 list-none pl-0 mt-4" />,
                      li: ({node, ...props}) => <li {...props} className="mb-0" />
                    }}
                  >
                    {aiResult}
                  </ReactMarkdown>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryTab;
