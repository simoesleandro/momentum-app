import React, { useState } from 'react';
import { useUserData } from '../hooks/useUserData';
import { useTheme } from '../hooks/useTheme';
import Logo from '../components/Logo';

interface OnboardingPageProps {
  onComplete: () => void;
}

const InputField: React.FC<{
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder: string;
    type?: string;
    unit?: string;
}> = ({ label, id, value, onChange, error, placeholder, type = 'text', unit }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-subtle dark:text-brand-subtle-dark mb-1">{label}</label>
        <div className="relative">
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-brand-background dark:bg-brand-surface-dark border p-3 rounded-md focus:outline-none focus:ring-2 ${error ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-brand-primary'}`}
            />
            {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-subtle">{unit}</span>}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
    const { initializeUser } = useUserData();
    const [name, setName] = useState('');
    const [height, setHeight] = useState('');
    const [initialWeight, setInitialWeight] = useState('');
    const [goalWeight, setGoalWeight] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { mode, toggleMode } = useTheme();

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = 'O nome é obrigatório.';

        const heightNum = parseFloat(height);
        if (!height.trim() || isNaN(heightNum) || heightNum <= 0.5 || heightNum > 2.5) {
            newErrors.height = 'Insira uma altura válida (ex: 1.67).';
        }

        const initialWeightNum = parseFloat(initialWeight);
        if (!initialWeight.trim() || isNaN(initialWeightNum) || initialWeightNum <= 20) {
            newErrors.initialWeight = 'Insira um peso inicial válido.';
        }

        const goalWeightNum = parseFloat(goalWeight);
        if (!goalWeight.trim() || isNaN(goalWeightNum) || goalWeightNum <= 20) {
            newErrors.goalWeight = 'Insira um peso-alvo válido.';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            initializeUser({
                userName: name.trim(),
                height: parseFloat(height),
                initialWeight: parseFloat(initialWeight),
                goalWeight: parseFloat(goalWeight),
            });
            onComplete();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-background dark:bg-brand-background-dark font-sans transition-colors duration-300">
             <button
                onClick={toggleMode}
                className="absolute top-6 right-6 w-12 h-12 bg-brand-surface/80 dark:bg-brand-surface-dark/70 backdrop-blur-md border border-gray-200/30 dark:border-white/10 rounded-full flex items-center justify-center text-brand-subtle hover:text-brand-primary dark:hover:text-brand-primary-light transition-colors"
                aria-label="Toggle dark mode"
                >
                {mode === 'light' ? <i className="fas fa-moon text-xl"></i> : <i className="fas fa-sun text-xl"></i>}
            </button>
            <div className="w-full max-w-lg p-8 space-y-8 bg-brand-surface dark:bg-brand-surface-dark rounded-2xl shadow-2xl m-4">
                <div className="text-center">
                    <Logo className="w-48 mx-auto text-brand-primary" />
                    <p className="mt-4 text-brand-subtle dark:text-brand-subtle-dark">Vamos configurar o seu perfil para começar.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                        label="Como podemos chamar-lhe?"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                        placeholder="Ex: Marta Simões"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                            label="Altura"
                            id="height"
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            error={errors.height}
                            placeholder="1.67"
                            unit="m"
                        />
                        <InputField
                            label="Peso Inicial"
                            id="initialWeight"
                            type="number"
                            value={initialWeight}
                            onChange={(e) => setInitialWeight(e.target.value)}
                            error={errors.initialWeight}
                            placeholder="65.0"
                            unit="kg"
                        />
                        <InputField
                            label="Meta de Peso"
                            id="goalWeight"
                            type="number"
                            value={goalWeight}
                            onChange={(e) => setGoalWeight(e.target.value)}
                            error={errors.goalWeight}
                            placeholder="60.0"
                            unit="kg"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg text-lg shadow-lg hover:bg-brand-primary-dark transition-transform transform hover:scale-105"
                    >
                        Começar Jornada
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OnboardingPage;