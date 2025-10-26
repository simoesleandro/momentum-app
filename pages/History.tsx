import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useUserData } from '../hooks/useUserData';
import Card from '../components/Card';
import ProgressChart from '../components/ProgressChart';
import type { ProgressPhoto, BodyMeasurement } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ConfirmationModal from '../components/ConfirmationModal';

type ProgressTab = 'Medidas Corporais' | 'Peso & Cargas' | 'Fotos de Progresso';

// =================================================================
// Helper Component: Input Field
// =================================================================
const Input: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; tooltip?: string; }> = ({ label, name, value, onChange, placeholder = "00.0", tooltip }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-brand-subtle dark:text-brand-subtle-dark mb-1 flex items-center gap-1">
          <span>{label}</span>
          {tooltip && (
            <span className="relative group">
              <i className="fas fa-info-circle text-xs cursor-help"></i>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                  {tooltip}
              </span>
            </span>
          )}
        </label>
        <input type="number" id={name} name={name} value={value} onChange={onChange} className="w-full bg-brand-background dark:bg-brand-surface-dark border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder={placeholder} />
    </div>
);


// =================================================================
// Helper Component: Photo Modal
// =================================================================
const PhotoModal: React.FC<{
  photo: ProgressPhoto;
  onClose: () => void;
  onUpdate: (photoId: string, updatedData: { photoUrl?: string; notes?: string }) => void;
  onDelete: () => void;
}> = ({ photo, onClose, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentNotes, setCurrentNotes] = useState(photo.notes || '');
    const [currentPhotoUrl, setCurrentPhotoUrl] = useState(photo.photoUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        const updatedData: { photoUrl?: string; notes?: string } = {};
        if (currentPhotoUrl !== photo.photoUrl) {
            updatedData.photoUrl = currentPhotoUrl;
        }
        if (currentNotes !== (photo.notes || '')) {
            updatedData.notes = currentNotes;
        }
        if (Object.keys(updatedData).length > 0) {
           onUpdate(photo.id, updatedData);
        }
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete();
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setCurrentPhotoUrl(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const triggerFileSelect = () => fileInputRef.current?.click();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
                <div className="bg-brand-surface dark:bg-brand-surface-dark rounded-lg shadow-2xl overflow-hidden">
                    <img
                        src={currentPhotoUrl}
                        alt={`Foto de ${photo.date}`}
                        className={`w-full max-h-[70vh] object-contain ${isEditing ? 'cursor-pointer' : ''}`}
                        onClick={isEditing ? triggerFileSelect : undefined}
                        title={isEditing ? 'Clique para alterar a imagem' : ''}
                    />
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                             <p className="font-bold text-brand-text dark:text-brand-text-dark">{new Date(photo.date).toLocaleDateString('pt-BR', { dateStyle: 'long' })}</p>
                              {!isEditing ? (
                                <p className="text-sm text-brand-subtle dark:text-brand-subtle-dark mt-1">{currentNotes || 'Sem notas.'}</p>
                              ) : (
                                <textarea
                                    value={currentNotes}
                                    onChange={(e) => setCurrentNotes(e.target.value)}
                                    placeholder="Adicione as suas notas aqui..."
                                    className="w-full mt-2 bg-brand-background dark:bg-brand-background-dark border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    rows={3}
                                />
                              )}
                           </div>
                           <button onClick={onClose} className="absolute top-2 right-2 text-white bg-black/40 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-black/60 transition-colors">&times;</button>
                        </div>
                        <div className="flex gap-2 mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                           {isEditing ? (
                            <>
                                <button onClick={handleDelete} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-semibold text-sm">Eliminar</button>
                                <div className="flex-grow"></div>
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm rounded-md bg-brand-subtle/20 text-brand-subtle hover:bg-brand-subtle/30 font-semibold transition-colors">Cancelar</button>
                                <button onClick={handleSave} className="px-4 py-2 text-sm rounded-md bg-brand-primary text-white hover:bg-brand-primary-dark font-semibold transition-colors shadow">Salvar</button>
                            </>
                           ) : (
                                <>
                                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm rounded-md bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 font-semibold transition-colors">Editar Foto</button>
                                    <div className="flex-grow"></div>
                                    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-semibold text-sm">Eliminar</button>
                                </>
                           )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =================================================================
// Helper Component: Comparison Modal
// =================================================================
const ComparisonModal: React.FC<{
  photoIds: string[];
  onClose: () => void;
}> = ({ photoIds, onClose }) => {
    const { data } = useUserData();
    const [photo1, photo2] = useMemo(() => {
        const p1 = data.progressPhotos.find(p => p.id === photoIds[0]);
        const p2 = data.progressPhotos.find(p => p.id === photoIds[1]);
        if (p1 && p2 && new Date(p1.date) > new Date(p2.date)) {
            return [p2, p1];
        }
        return [p1, p2];
    }, [data.progressPhotos, photoIds]);

    if (!photo1 || !photo2) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-surface dark:bg-brand-surface-dark rounded-lg shadow-2xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-brand-text dark:text-brand-text-dark">Comparar Progresso</h2>
                    <button onClick={onClose} className="text-brand-subtle hover:text-brand-primary text-2xl">&times;</button>
                </div>
                <div className="flex-grow overflow-y-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[photo1, photo2].map((photo) => (
                            <div key={photo.id} className="flex flex-col">
                                <img src={photo.photoUrl} alt={`Foto de ${photo.date}`} className="w-full h-auto object-contain rounded-lg shadow-md mb-3" />
                                <div className="text-center bg-brand-background dark:bg-brand-background-dark p-3 rounded-md">
                                    <p className="font-bold text-brand-text dark:text-brand-text-dark">{new Date(photo.date).toLocaleDateString('pt-BR', { dateStyle: 'long' })}</p>
                                    <p className="text-sm text-brand-subtle dark:text-brand-subtle-dark mt-1">{photo.notes || 'Sem notas.'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// =================================================================
// 1. Body Measurements Tab
// =================================================================
const BodyMeasurementsTab: React.FC = () => {
    const { data, addBodyMeasurement, getFormattedBodyMeasurements } = useUserData();

    const [newMeasurements, setNewMeasurements] = useState({ waist: '', hips: '', chest: '', arms: '', legs: '' });
    const [saveFeedback, setSaveFeedback] = useState('');
    
    const [calculator, setCalculator] = useState({
        gender: 'female',
        age: '40',
        neck: '',
        waist: '',
        hips: '',
        height: (data.height * 100).toFixed(0),
        weight: data.weightLog.length > 0 ? [...data.weightLog].pop()!.weight.toString() : ''
    });
    const [bodyFatResult, setBodyFatResult] = useState<number | null>(null);
    const [bodyFatCategory, setBodyFatCategory] = useState<string | null>(null);
    const [calculatorError, setCalculatorError] = useState('');

    const handleNewMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMeasurements(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveMeasurements = () => {
        const toSave: Omit<BodyMeasurement, 'date'> = Object.entries(newMeasurements)
            .reduce((acc, [key, value]: [string, string]) => {
                const numVal = parseFloat(value);
                if (numVal > 0) acc[key as keyof typeof newMeasurements] = numVal;
                return acc;
            }, {} as Omit<BodyMeasurement, 'date'>);

        if (Object.keys(toSave).length > 0) {
            addBodyMeasurement(toSave);
            setSaveFeedback('Medidas salvas com sucesso!');
            setNewMeasurements({ waist: '', hips: '', chest: '', arms: '', legs: '' });
            setTimeout(() => setSaveFeedback(''), 3000);
        }
    };
    
    const handleCalculatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCalculator(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAutofill = useCallback(() => {
        const latestMeasurements: Partial<BodyMeasurement> = data.bodyMeasurements.length > 0 ? [...data.bodyMeasurements].pop()! : {};
        const latestWeight = data.weightLog.length > 0 ? [...data.weightLog].pop()!.weight : 0;
        setCalculator(prev => ({
            ...prev,
            waist: latestMeasurements.waist?.toString() || '',
            hips: latestMeasurements.hips?.toString() || '',
            height: (data.height * 100).toFixed(0),
            weight: latestWeight > 0 ? latestWeight.toString() : ''
        }));
        setBodyFatResult(null);
        setBodyFatCategory(null);
    }, [data]);

    const bodyFatCategories = [
        { gender: 'female', age: [20, 39], range: [10, 13], cat: 'Gordura Essencial' },
        { gender: 'female', age: [20, 39], range: [13.1, 20.9], cat: 'Atleta' },
        { gender: 'female', age: [20, 39], range: [21, 24.9], cat: 'Fitness' },
        { gender: 'female', age: [20, 39], range: [25, 31.9], cat: 'Aceitável' },
        { gender: 'female', age: [20, 39], range: [32, 100], cat: 'Obesidade' },
        { gender: 'female', age: [40, 59], range: [10, 13], cat: 'Gordura Essencial' },
        { gender: 'female', age: [40, 59], range: [13.1, 23.9], cat: 'Atleta' },
        { gender: 'female', age: [40, 59], range: [24, 27.9], cat: 'Fitness' },
        { gender: 'female', age: [40, 59], range: [28, 35.9], cat: 'Aceitável' },
        { gender: 'female', age: [40, 59], range: [36, 100], cat: 'Obesidade' },
        { gender: 'male', age: [20, 39], range: [2, 5], cat: 'Gordura Essencial' },
        { gender: 'male', age: [20, 39], range: [5.1, 12.9], cat: 'Atleta' },
        { gender: 'male', age: [20, 39], range: [13, 16.9], cat: 'Fitness' },
        { gender: 'male', age: [20, 39], range: [17, 23.9], cat: 'Aceitável' },
        { gender: 'male', age: [20, 39], range: [24, 100], cat: 'Obesidade' },
        { gender: 'male', age: [40, 59], range: [2, 5], cat: 'Gordura Essencial' },
        { gender: 'male', age: [40, 59], range: [5.1, 15.9], cat: 'Atleta' },
        { gender: 'male', age: [40, 59], range: [16, 19.9], cat: 'Fitness' },
        { gender: 'male', age: [40, 59], range: [20, 27.9], cat: 'Aceitável' },
        { gender: 'male', age: [40, 59], range: [28, 100], cat: 'Obesidade' },
    ];

    const getBodyFatCategory = (percentage: number, gender: string, age: number): string => {
        const ageGroup = age < 40 ? [20, 39] : [40, 59];
        const category = bodyFatCategories.find(c => 
            c.gender === gender &&
            c.age[0] === ageGroup[0] &&
            percentage >= c.range[0] &&
            percentage <= c.range[1]
        );
        return category ? category.cat : 'Não classificado';
    }

    const getCategoryStyle = (category: string) => {
        switch (category) {
            case 'Gordura Essencial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
            case 'Atleta':
            case 'Fitness':
                return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
            case 'Aceitável':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
            case 'Obesidade':
                return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const calculateBodyFat = () => {
        setCalculatorError('');
        setBodyFatResult(null);
        setBodyFatCategory(null);
        
        const { gender } = calculator;
        const age = parseInt(calculator.age, 10) || 0;
        const waist = parseFloat(calculator.waist) || 0;
        const neck = parseFloat(calculator.neck) || 0;
        const height = parseFloat(calculator.height) || 0;
        const hips = parseFloat(calculator.hips) || 0;

        let result: number | null = null;
        if (gender === 'female') {
            if (!waist || !neck || !height || !hips) { setCalculatorError('Preencha todos os campos para o sexo feminino.'); return; }
            
            const circumferenceValue = waist + hips - neck;
            if (circumferenceValue <= 0) {
                setCalculatorError('A soma da cintura e do quadril deve ser maior que a medida do pescoço.');
                return;
            }
            result = 495 / (1.29579 - 0.35004 * Math.log10(circumferenceValue) + 0.22100 * Math.log10(height)) - 450;
        } else {
            if (!waist || !neck || !height) { setCalculatorError('Preencha todos os campos para o sexo masculino.'); return; }

            const circumferenceValue = waist - neck;
            if (circumferenceValue <= 0) {
                setCalculatorError('A medida do abdómen deve ser maior que a do pescoço.');
                return;
            }
            result = 495 / (1.0324 - 0.19077 * Math.log10(circumferenceValue) + 0.15456 * Math.log10(height)) - 450;
        }

        if (result !== null && result > 0) {
            setBodyFatResult(result);
            setBodyFatCategory(getBodyFatCategory(result, gender, age));
        } else {
            setCalculatorError('Não foi possível calcular com os valores fornecidos. Verifique as medidas.');
        }
    };
    
    const bodyMeasurementsData = useMemo(() => getFormattedBodyMeasurements(), [getFormattedBodyMeasurements]);
    const measurementKeys = useMemo(() => Array.from(new Set(bodyMeasurementsData.flatMap(d => Object.keys(d).filter(k => k !== 'date')))), [bodyMeasurementsData]);
    const measurementColors: {[key: string]: string} = { 'Cintura': '#7c3aed', 'Quadril': '#f43f5e', 'Peito': '#10b981', 'Braços': '#0ea5e9', 'Pernas': '#f97316' };
    const [hiddenLegends, setHiddenLegends] = useState<Set<string>>(new Set());
    const handleLegendClick = (e: any) => setHiddenLegends(p => new Set(p.has(e.dataKey) ? [...p].filter(k => k !== e.dataKey) : [...p, e.dataKey]));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <Card title="Registrar Novas Medidas (cm)" icon={<i className="fas fa-ruler-horizontal" />}>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Cintura" name="waist" value={newMeasurements.waist} onChange={handleNewMeasurementChange} />
                            <Input label="Quadril" name="hips" value={newMeasurements.hips} onChange={handleNewMeasurementChange} />
                            <Input label="Peito" name="chest" value={newMeasurements.chest} onChange={handleNewMeasurementChange} />
                            <Input label="Braços" name="arms" value={newMeasurements.arms} onChange={handleNewMeasurementChange} />
                            <div className="col-span-2 sm:col-span-1">
                               <Input label="Pernas" name="legs" value={newMeasurements.legs} onChange={handleNewMeasurementChange} />
                            </div>
                        </div>
                        <button onClick={handleSaveMeasurements} className="w-full mt-6 bg-brand-primary text-white font-bold py-2.5 px-4 rounded-md hover:bg-brand-primary-dark transition-colors shadow-md">
                            Salvar Medidas de Hoje
                        </button>
                        {saveFeedback && <p className="text-center text-sm text-green-600 mt-2 animate-fadeIn">{saveFeedback}</p>}
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card title="Calculadora de Gordura Corporal" icon={<i className="fas fa-calculator" />}>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4 text-sm"><span className="font-medium text-brand-subtle">Sexo:</span>
                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gender" value="female" checked={calculator.gender === 'female'} onChange={handleCalculatorChange} className="form-radio text-brand-primary" /> Feminino</label>
                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="gender" value="male" checked={calculator.gender === 'male'} onChange={handleCalculatorChange} className="form-radio text-brand-primary" /> Masculino</label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Input label="Idade" name="age" value={calculator.age} onChange={handleCalculatorChange} placeholder="Anos" />
                                <Input 
                                    label="Pescoço (cm)" 
                                    name="neck" 
                                    value={calculator.neck} 
                                    onChange={handleCalculatorChange} 
                                    tooltip="Meça na parte mais larga do pescoço."
                                />
                                <Input 
                                    label={calculator.gender === 'female' ? "Cintura (cm)" : "Abdómen (cm)"}
                                    name="waist" 
                                    value={calculator.waist} 
                                    onChange={handleCalculatorChange} 
                                    tooltip={calculator.gender === 'female' ? "Meça na parte mais estreita, geralmente acima do umbigo." : "Meça horizontalmente, ao nível do umbigo."}
                                />
                                {calculator.gender === 'female' && (
                                    <Input 
                                        label="Quadril (cm)" 
                                        name="hips" 
                                        value={calculator.hips} 
                                        onChange={handleCalculatorChange}
                                        tooltip="Meça na parte mais larga dos glúteos."
                                    />
                                )}
                                <Input label="Altura (cm)" name="height" value={calculator.height} onChange={handleCalculatorChange} />
                                <Input label="Peso (Kg)" name="weight" value={calculator.weight} onChange={handleCalculatorChange} />
                            </div>
                            <div className="flex gap-2 pt-1">
                                <button onClick={calculateBodyFat} className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-primary-dark transition-colors">Calcular</button>
                                <button onClick={handleAutofill} className="w-full bg-brand-subtle/20 text-brand-subtle font-bold py-2 px-4 rounded-md hover:bg-brand-subtle/30 transition-colors text-sm">Preencher</button>
                            </div>
                            {calculatorError && <p className="text-red-500 text-xs text-center">{calculatorError}</p>}
                            {bodyFatResult !== null && (
                                <div className="mt-2 text-center bg-brand-primary/10 dark:bg-brand-primary/20 p-3 rounded-lg animate-fadeIn">
                                    <p className="text-brand-subtle dark:text-brand-subtle-dark text-xs">Gordura Corporal Estimada</p>
                                    <p className="text-2xl font-bold text-brand-primary dark:text-brand-primary-light">{bodyFatResult.toFixed(1)}%</p>
                                    {bodyFatCategory && (
                                        <p className={`mt-2 text-sm font-bold px-3 py-1 rounded-full inline-block ${getCategoryStyle(bodyFatCategory)}`}>
                                            {bodyFatCategory}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
            <Card title="Evolução das Medidas Corporais" icon={<i className="fas fa-chart-line" />}>
                <p className="text-center text-xs text-brand-subtle -mt-3 mb-2">Clique nas legendas abaixo para mostrar ou ocultar medidas no gráfico.</p>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <LineChart data={bodyMeasurementsData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                            <XAxis dataKey="date" className="text-xs" stroke="currentColor" />
                            <YAxis className="text-xs" stroke="currentColor" unit=" cm" />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--brand-surface)', border: '1px solid #e5e7eb' }} wrapperClassName="rounded-md shadow-lg dark:!bg-brand-surface-dark dark:!border-gray-700" formatter={(value: number) => [`${value.toFixed(1)} cm`, null]}/>
                            <Legend onClick={handleLegendClick} wrapperStyle={{fontSize: '0.8rem'}} />
                            {measurementKeys.map(key => <Line key={key} type="monotone" dataKey={key} stroke={measurementColors[key] || '#8884d8'} strokeWidth={2} hide={hiddenLegends.has(key)} dot={{r: 3}} activeDot={{ r: 6 }} />)}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

// =================================================================
// 2. Weight & Loads Tab
// =================================================================
const WeightAndLoadsTab: React.FC = () => {
    const { data, getFormattedWeightLog, getExerciseLoadHistory, addWeightEntry } = useUserData();
    const [newWeight, setNewWeight] = useState('');
    const [weightFeedback, setWeightFeedback] = useState('');
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>(data.workouts[0]?.id || '');
    const [selectedExerciseId, setSelectedExerciseId] = useState<string>(data.workouts[0]?.exercises[0]?.id || '');
    const [loadChartType, setLoadChartType] = useState<'line' | 'bar'>('line');
    const [loadTimeframe, setLoadTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
    
    const handleSaveWeight = () => {
        const weightValue = parseFloat(newWeight);
        if (isNaN(weightValue) || weightValue <= 0) {
            setWeightFeedback('Por favor, insira um peso válido.'); setTimeout(() => setWeightFeedback(''), 3000); return;
        }
        addWeightEntry(weightValue);
        setWeightFeedback('Peso registrado com sucesso!'); setNewWeight(''); setTimeout(() => setWeightFeedback(''), 3000);
    };

    const handleWorkoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWorkoutId(e.target.value);
        setSelectedExerciseId(data.workouts.find(w => w.id === e.target.value)?.exercises[0]?.id || '');
    };
    
    const selectedWorkout = data.workouts.find(w => w.id === selectedWorkoutId);
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <ProgressChart data={getFormattedWeightLog()} dataKey="peso" title="Evolução do Peso Corporal" type='line' timeframe='all' onTypeChange={()=>{}} onTimeframeChange={()=>{}} color="var(--brand-primary)" unit="kg" />
                </div>
                <Card title="Registrar Peso de Hoje" icon={<i className="fas fa-weight-hanging"></i>}>
                     <Input label="Novo Peso (Kg)" name="newWeight" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} />
                     <button onClick={handleSaveWeight} className="w-full mt-4 bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-primary-dark transition-colors">Salvar Peso</button>
                    {weightFeedback && <p className="text-center text-sm text-green-600 mt-2 animate-fadeIn">{weightFeedback}</p>}
                </Card>
            </div>
            <Card title="Evolução da Carga nos Exercícios" icon={<i className="fas fa-level-up-alt"></i>}>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <select value={selectedWorkoutId} onChange={handleWorkoutChange} className="w-full sm:w-1/2 bg-brand-background dark:bg-brand-surface-dark border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary">
                        {data.workouts.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                    <select value={selectedExerciseId} onChange={(e) => setSelectedExerciseId(e.target.value)} className="w-full sm:w-1/2 bg-brand-background dark:bg-brand-surface-dark border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" disabled={!selectedWorkout}>
                        {selectedWorkout?.exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                    </select>
                </div>
                {selectedExerciseId ? <ProgressChart data={getExerciseLoadHistory(selectedWorkoutId, selectedExerciseId)} dataKey="carga" title="" type={loadChartType} timeframe={loadTimeframe} onTypeChange={setLoadChartType} onTimeframeChange={setLoadTimeframe} color="var(--brand-primary-light)" unit="kg" /> : <p className="text-center text-brand-subtle p-8">Selecione um exercício para ver o histórico.</p>}
            </Card>
        </div>
    );
};

// =================================================================
// 3. Progress Photos Tab
// =================================================================
const ProgressPhotosTab: React.FC = () => {
    const { data, addProgressPhoto, updateProgressPhoto, deleteProgressPhoto } = useUserData();
    const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [uploadNotes, setUploadNotes] = useState('');
    const [uploadFeedback, setUploadFeedback] = useState('');
    const [isComparing, setIsComparing] = useState(false);
    const [comparisonSelection, setComparisonSelection] = useState<string[]>([]);
    const [showComparisonModal, setShowComparisonModal] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);

    const handleRequestDelete = (photoId: string) => {
        setPhotoToDelete(photoId);
    };

    const confirmDelete = () => {
        if (photoToDelete) {
            deleteProgressPhoto(photoToDelete);
            if (selectedPhoto?.id === photoToDelete) {
                setSelectedPhoto(null);
            }
            setPhotoToDelete(null);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setUploadPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleAddPhoto = () => {
        if (!uploadPreview) {
            setUploadFeedback('Por favor, selecione uma foto para carregar.');
            setTimeout(() => setUploadFeedback(''), 3000);
            return;
        }
        addProgressPhoto({ photoUrl: uploadPreview, notes: uploadNotes || undefined });
        setUploadPreview(null);
        setUploadNotes('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setUploadFeedback('Foto adicionada com sucesso!');
        setTimeout(() => setUploadFeedback(''), 3000);
    };

    const handleUpdatePhoto = (photoId: string, updatedData: { photoUrl?: string; notes?: string }) => {
        updateProgressPhoto(photoId, updatedData);
        setSelectedPhoto(prev => prev && prev.id === photoId ? { ...prev, ...updatedData } : prev);
    };

    const handleCancelUpload = () => {
        setUploadPreview(null);
        setUploadNotes('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSelectForComparison = (photoId: string) => {
        setComparisonSelection(prev => {
            if (prev.includes(photoId)) return prev.filter(id => id !== photoId);
            if (prev.length < 2) return [...prev, photoId];
            return prev;
        });
    };
    
    const handleCloseComparisonModal = () => {
        setShowComparisonModal(false);
        setIsComparing(false);
        setComparisonSelection([]);
    };
    
    const handleViewPhoto = (photo: ProgressPhoto, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedPhoto(photo);
    };

    const compareButton = data.progressPhotos.length > 1 ? (
        <button
            onClick={() => { setIsComparing(!isComparing); setComparisonSelection([]); }}
            className="px-3 py-1 text-sm rounded-md bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 font-semibold transition-colors flex items-center gap-2"
        >
            <i className="fas fa-exchange-alt"></i>
            {isComparing ? 'Cancelar' : 'Comparar Fotos'}
        </button>
    ) : null;

    const sortedPhotos = [...data.progressPhotos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6">
            <Card title="Adicionar Nova Foto" icon={<i className="fas fa-camera"></i>}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {uploadPreview ? (
                        <div className="text-center relative">
                            <img src={uploadPreview} alt="Pré-visualização" className="max-h-48 mx-auto rounded-lg shadow-md" />
                            <button onClick={handleCancelUpload} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-7 w-7 flex items-center justify-center text-sm font-bold shadow-lg hover:bg-red-600 transition-transform transform hover:scale-110">
                                &times;
                            </button>
                        </div>
                    ) : (
                         <button onClick={() => fileInputRef.current?.click()} className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center text-brand-subtle hover:border-brand-primary hover:text-brand-primary transition-colors flex flex-col items-center justify-center">
                            <i className="fas fa-upload text-3xl"></i>
                            <p className="mt-2 font-semibold">Clique para escolher o ficheiro</p>
                        </button>
                    )}
                    <div className="space-y-4">
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                        <textarea 
                            value={uploadNotes} 
                            onChange={(e) => setUploadNotes(e.target.value)} 
                            placeholder="Adicione uma legenda ou notas (opcional)..." 
                            className="w-full bg-brand-background dark:bg-brand-surface-dark border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                            rows={3}
                        />
                        <button 
                            onClick={handleAddPhoto} 
                            disabled={!uploadPreview}
                            className="w-full bg-brand-primary text-white font-bold py-2.5 px-4 rounded-md hover:bg-brand-primary-dark transition-colors shadow-md disabled:bg-brand-subtle disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-save"></i>
                            <span>Adicionar Foto</span>
                        </button>
                    </div>
                </div>
                 {uploadFeedback && <p className="text-center text-sm text-green-600 mt-3 animate-fadeIn">{uploadFeedback}</p>}
            </Card>

            <Card title="Galeria de Progresso" icon={<i className="fas fa-images"></i>} headerActions={compareButton}>
                {sortedPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {sortedPhotos.map(photo => (
                            <div 
                                key={photo.id} 
                                className={`group relative rounded-lg overflow-hidden shadow-md aspect-square ${isComparing ? 'cursor-pointer' : ''}`}
                                onClick={isComparing ? () => handleSelectForComparison(photo.id) : undefined}
                            >
                                <img src={photo.photoUrl} alt={`Progresso em ${photo.date}`} className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button 
                                        onClick={(e) => handleViewPhoto(photo, e)} 
                                        className="bg-black/50 text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-black/70 transition-colors" 
                                        title="Ver/Editar"
                                    >
                                        <i className="fas fa-eye text-sm"></i>
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleRequestDelete(photo.id); }}
                                        className="bg-black/50 text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-red-600 transition-colors" 
                                        title="Eliminar"
                                    >
                                        <i className="fas fa-trash-alt text-sm"></i>
                                    </button>
                                </div>

                                <div className="absolute bottom-0 left-0 p-3 text-white">
                                    <p className="font-bold text-sm">{new Date(photo.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', year: 'numeric'})}</p>
                                </div>

                                {isComparing && (
                                     <div className={`absolute inset-0 transition-all duration-200 border-4 ${comparisonSelection.includes(photo.id) ? 'border-brand-primary' : 'border-transparent hover:bg-black/30'}`}>
                                        {comparisonSelection.includes(photo.id) && (
                                            <div className="absolute top-2 right-2 bg-brand-primary text-white rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                                                <i className="fas fa-check text-sm"></i>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-brand-subtle p-8">Nenhuma foto de progresso ainda. Adicione fotos para acompanhar a sua evolução!</p>
                )}
            </Card>

            {isComparing && (
                <div className="fixed bottom-20 md:bottom-4 inset-x-0 mx-auto w-fit p-2 bg-brand-surface dark:bg-brand-surface-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20 animate-fadeIn">
                    <div className="flex items-center gap-4">
                        <p className="text-sm font-semibold text-brand-subtle">{comparisonSelection.length} / 2 fotos selecionadas</p>
                        <button onClick={() => setShowComparisonModal(true)} disabled={comparisonSelection.length !== 2} className="px-4 py-2 text-sm rounded-md bg-brand-primary text-white hover:bg-brand-primary-dark font-semibold transition-colors shadow disabled:bg-brand-subtle disabled:cursor-not-allowed">
                            Comparar Selecionadas
                        </button>
                    </div>
                </div>
            )}

            {selectedPhoto && <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} onUpdate={handleUpdatePhoto} onDelete={() => handleRequestDelete(selectedPhoto.id)} />}
            {showComparisonModal && <ComparisonModal photoIds={comparisonSelection} onClose={handleCloseComparisonModal} />}
            <ConfirmationModal
                isOpen={!!photoToDelete}
                onClose={() => setPhotoToDelete(null)}
                onConfirm={confirmDelete}
                title="Confirmar Eliminação"
                message={<>Tem a certeza que deseja eliminar esta foto? <br/><strong>Esta ação não pode ser revertida.</strong></>}
                confirmText="Sim, Eliminar"
            />
        </div>
    );
};


// =================================================================
// Main History Component
// =================================================================
const History: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ProgressTab>('Fotos de Progresso');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Medidas Corporais': return <BodyMeasurementsTab />;
            case 'Peso & Cargas': return <WeightAndLoadsTab />;
            case 'Fotos de Progresso': return <ProgressPhotosTab />;
            default: return null;
        }
    };
    
    const TabButton: React.FC<{ name: ProgressTab }> = ({ name }) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`px-4 py-2 font-semibold text-sm rounded-md transition-colors duration-200 whitespace-nowrap ${
                activeTab === name
                ? 'bg-brand-primary text-white shadow'
                : 'text-brand-subtle hover:bg-brand-primary/10'
            }`}
        >
            {name}
        </button>
    );

    return (
        <div className="space-y-6">
             <style>{`
                @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
            <header>
                <h1 className="text-3xl font-bold text-brand-text dark:text-brand-text-dark">Acompanhamento de Progresso</h1>
                <p className="text-brand-subtle dark:text-brand-subtle-dark mt-1">Visualize a sua jornada e celebre as suas conquistas.</p>
            </header>

            <div className="w-full overflow-x-auto pb-2">
                <div className="inline-flex space-x-1 bg-gray-100 dark:bg-brand-surface-dark p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                    <TabButton name="Medidas Corporais" />
                    <TabButton name="Peso & Cargas" />
                    <TabButton name="Fotos de Progresso" />
                </div>
            </div>

            <div key={activeTab} className="animate-fadeIn">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default History;