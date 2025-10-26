import React, { useState, useMemo, useRef } from 'react';
import { useUserData } from '../hooks/useUserData';
import Card from '../components/Card';
import type { ReportsData } from '../types';

// Since html2canvas is loaded from a script tag, we need to declare it for TypeScript
declare const html2canvas: any;

// =================================================================
// Share Report Modal Component
// =================================================================
interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportsData: ReportsData;
  timeframeLabel: string;
  userName: string;
}

const measurementLabels: { [key: string]: string } = {
  waist: 'Cintura',
  hips: 'Quadril',
  chest: 'Peito',
  arms: 'Braços',
  legs: 'Pernas'
};

const ShareReportModal: React.FC<ShareReportModalProps> = ({
  isOpen,
  onClose,
  reportsData,
  timeframeLabel,
  userName
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!reportRef.current) return;
    setIsLoading(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `relatorio_progresso_${userName.split(' ')[0].toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Ocorreu um erro ao gerar a imagem. Tente novamente.");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };
  
  const topExerciseProgress = [...reportsData.exerciseProgress]
    .sort((a, b) => b.increase - a.increase)
    .slice(0, 5);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-brand-surface dark:bg-brand-surface-dark rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-brand-text dark:text-brand-text-dark">Compartilhar Relatório</h2>
          <button onClick={onClose} className="text-brand-subtle dark:text-brand-subtle-dark hover:text-brand-text dark:hover:text-brand-text-dark text-2xl">&times;</button>
        </div>

        <div className="overflow-y-auto flex-grow mb-6 pr-2">
            <div ref={reportRef} className="p-8 bg-white text-gray-800">
                 <header className="text-center mb-8 border-b-2 border-brand-primary pb-4">
                    <h1 className="text-3xl font-bold text-brand-primary-dark">Relatório de Progresso</h1>
                    <p className="text-lg text-gray-600">{userName}</p>
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{timeframeLabel}</p>
                </header>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-brand-primary/10 p-4 rounded-lg text-center">
                        <p className="text-4xl font-bold text-brand-primary">{reportsData.totalWorkouts}</p>
                        <p className="text-sm text-brand-subtle font-medium">Treinos Feitos</p>
                    </div>
                    <div className="bg-brand-primary/10 p-4 rounded-lg text-center">
                        <p className="text-4xl font-bold text-brand-primary">{reportsData.attendanceRate.toFixed(0)}%</p>
                        <p className="text-sm text-brand-subtle font-medium">Assiduidade</p>
                    </div>
                </div>

                 <div className="mb-8">
                    <h2 className="text-xl font-bold text-brand-primary-dark mb-3">Evolução Corporal</h2>
                    <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                        <div className="text-center border-r border-gray-200">
                             <p className={`text-3xl font-bold ${reportsData.weightChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>{reportsData.weightChange.toFixed(1)} kg</p>
                            <p className="text-sm text-gray-500">Variação de Peso</p>
                        </div>
                        <div className="text-sm space-y-1">
                            {Object.entries(reportsData.measurementChanges).map(([key, value]: [string, number]) => (
                                <div key={key} className="flex justify-between">
                                    <span className="text-gray-600">{measurementLabels[key]}:</span>
                                    <span className={`font-bold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>{value.toFixed(1)} cm</span>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>

                <div>
                    <h2 className="text-xl font-bold text-brand-primary-dark mb-3">Maiores Progressos de Carga</h2>
                    <table className="w-full text-left text-sm">
                        <thead className="border-b-2 border-gray-300 bg-gray-50">
                            <tr>
                                <th className="p-2">Exercício</th>
                                <th className="p-2 text-center">Aumento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topExerciseProgress.map((ex) => (
                                <tr key={ex.name} className="border-b border-gray-200 last:border-b-0">
                                <td className="p-2 font-medium">{ex.name}</td>
                                <td className={`p-2 text-center font-bold text-green-600`}>
                                    {ex.increase > 0 ? '+' : ''}{ex.increase.toFixed(1)}%
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <footer className="text-center mt-8 text-xs text-gray-400">
                    Gerado por Marta's Dashboard
                </footer>
            </div>
        </div>

        <div className="flex justify-end gap-4 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-brand-subtle/20 text-brand-subtle dark:text-brand-subtle-dark hover:bg-brand-subtle/30 font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="px-6 py-2 rounded-md bg-brand-primary text-white hover:bg-brand-primary-dark font-semibold transition-colors shadow flex items-center gap-2 disabled:bg-brand-subtle disabled:cursor-wait"
          >
            {isLoading ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>A Gerar...</span>
                </>
            ) : (
                <>
                    <i className="fas fa-download"></i>
                    <span>Baixar Imagem</span>
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// =================================================================
// Main Reports Component
// =================================================================
const Reports: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | 'all'>('30d');
  const { getReportsData, data } = useUserData();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const reports: ReportsData = useMemo(() => getReportsData(timeframe), [timeframe, getReportsData]);
  
  const timeframeLabels = {
    '30d': 'Últimos 30 dias',
    '90d': 'Últimos 90 dias',
    'all': 'Desde o início'
  };

  const TimeframeButton: React.FC<{ value: '30d' | '90d' | 'all'; label: string }> = ({ value, label }) => (
    <button
      onClick={() => setTimeframe(value)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${timeframe === value ? 'bg-brand-primary text-white' : 'bg-brand-surface dark:bg-brand-surface-dark hover:bg-brand-primary/10'}`}
    >
      {label}
    </button>
  );
  
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-text dark:text-brand-text-dark">Relatórios de Desempenho</h1>
          <p className="text-brand-subtle dark:text-brand-subtle-dark mt-1">Analise a sua evolução ao longo do tempo.</p>
        </div>
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-brand-primary-dark transition-colors flex items-center gap-2 self-start md:self-center"
        >
          <i className="fas fa-share-alt"></i>
          Compartilhar
        </button>
      </header>
      
      <div className="flex space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-brand-surface dark:bg-brand-surface-dark w-fit">
        <TimeframeButton value="30d" label="Últimos 30 dias" />
        <TimeframeButton value="90d" label="Últimos 90 dias" />
        <TimeframeButton value="all" label="Desde o início" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Resumo de Treinos" icon={<i className="fas fa-clipboard-list"></i>}>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-brand-primary">{reports.totalWorkouts}</p>
              <p className="text-brand-subtle dark:text-brand-subtle-dark">Treinos Feitos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand-primary">{reports.attendanceRate.toFixed(0)}%</p>
              <p className="text-brand-subtle dark:text-brand-subtle-dark">Assiduidade</p>
            </div>
          </div>
        </Card>
        <Card title="Evolução Corporal" icon={<i className="fas fa-user-check"></i>}>
           <div className="grid grid-cols-2 gap-4 text-center">
             <div>
                <p className={`text-3xl font-bold ${reports.weightChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>{reports.weightChange.toFixed(1)} kg</p>
                <p className="text-brand-subtle dark:text-brand-subtle-dark">Variação de Peso</p>
            </div>
            <div className="text-sm">
                {Object.keys(reports.measurementChanges).length > 0 ? Object.entries(reports.measurementChanges).map(([key, value]: [string, number]) => (
                    <div key={key} className="flex justify-between">
                        <span className="text-brand-subtle dark:text-brand-subtle-dark">{measurementLabels[key]}:</span>
                        <span className={`font-bold ${value <= 0 ? 'text-green-500' : 'text-red-500'}`}>{value.toFixed(1)} cm</span>
                    </div>
                )) : <p className="text-brand-subtle dark:text-brand-subtle-dark text-center h-full flex items-center justify-center">Sem dados</p>}
            </div>
          </div>
        </Card>
      </div>

      <Card title="Progresso de Carga por Exercício" icon={<i className="fas fa-sort-amount-up-alt"></i>}>
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-left">
            <thead className="border-b-2 border-gray-200 dark:border-gray-700 sticky top-0 bg-brand-surface dark:bg-brand-surface-dark">
              <tr>
                <th className="p-3">Exercício</th>
                <th className="p-3 text-center">Carga Inicial (kg)</th>
                <th className="p-3 text-center">Carga Atual (kg)</th>
                <th className="p-3 text-center">Aumento (%)</th>
              </tr>
            </thead>
            <tbody>
              {reports.exerciseProgress.sort((a,b) => b.increase - a.increase).map((ex) => (
                <tr key={ex.name} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <td className="p-3 font-medium text-brand-text dark:text-brand-text-dark">{ex.name}</td>
                  <td className="p-3 text-center text-brand-subtle dark:text-brand-subtle-dark">{ex.startLoad.toFixed(1)}</td>
                  <td className="p-3 text-center text-brand-primary font-bold">{ex.currentLoad.toFixed(1)}</td>
                  <td className={`p-3 text-center font-bold ${ex.increase >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {ex.increase > 0 ? '+' : ''}{ex.increase.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ShareReportModal 
          isOpen={isShareModalOpen} 
          onClose={() => setIsShareModalOpen(false)} 
          reportsData={reports}
          timeframeLabel={timeframeLabels[timeframe]}
          userName={data.userName}
        />
    </div>
  );
};

export default Reports;