import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useUserData } from '../hooks/useUserData';
import { useTheme } from '../hooks/useTheme';
import Card from '../components/Card';
import { themes } from '../styles/themes';
import type { AppSettings } from '../types';

const Settings: React.FC = () => {
    const { data, updateSettings, exportData, importData, resetData } = useUserData();
    const { themeKey, changeTheme } = useTheme();
    
    // Local state for form edits
    const [localSettings, setLocalSettings] = useState<AppSettings>(data.settings);
    const [localThemeKey, setLocalThemeKey] = useState<string>(themeKey);
    // State to control the visibility of the success message
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    
    const importFileRef = useRef<HTMLInputElement>(null);

    // Sync local state with global data when it changes
    useEffect(() => {
        setLocalSettings(data.settings);
        setLocalThemeKey(themeKey);
    }, [data.settings, themeKey]);

    // Check for unsaved changes, including theme selection
    const isDirty = useMemo(() => {
        const settingsChanged = JSON.stringify(data.settings) !== JSON.stringify(localSettings);
        const themeChanged = themeKey !== localThemeKey;
        return settingsChanged || themeChanged;
    }, [data.settings, localSettings, themeKey, localThemeKey]);
    
    // Hide success message if user makes new changes
    useEffect(() => {
        if (isDirty) {
            setShowSuccessMessage(false);
        }
    }, [isDirty]);

    const handleSettingChange = (key: keyof AppSettings, value: any) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleNotificationChange = (key: keyof AppSettings['notifications'], value: boolean) => {
        setLocalSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: value
            }
        }));
    };

    const handleSave = () => {
        if (!isDirty) return;
        
        // Save settings if they changed
        if (JSON.stringify(data.settings) !== JSON.stringify(localSettings)) {
            updateSettings(localSettings);
        }
        
        // Save theme if it changed
        if (themeKey !== localThemeKey) {
            changeTheme(localThemeKey);
        }

        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
    };


    const handleImportClick = () => {
        importFileRef.current?.click();
    };

    const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                importData(text);
                alert('Dados importados com sucesso! A página será recarregada.');
                window.location.reload();
            } catch (error) {
                alert('Erro ao importar o ficheiro. Verifique se o formato é JSON válido.');
                console.error("Import error:", error);
            }
        };
        reader.readAsText(file);
    };

    const handleResetData = () => {
        if (window.confirm('TEM A CERTEZA? Esta ação irá apagar TODOS os seus dados e restaurar a aplicação para o estado inicial. Esta ação não pode ser revertida.')) {
            if (window.confirm('Confirmação final: Tem mesmo a certeza de que deseja apagar todos os dados?')) {
                resetData();
                alert('Dados reiniciados. A página será recarregada.');
                window.location.reload();
            }
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-brand-text dark:text-brand-text-dark">Configurações</h1>
                <p className="text-brand-subtle dark:text-brand-subtle-dark mt-1">Personalize a sua experiência na aplicação.</p>
            </header>

            <Card title="Preferências Gerais" icon={<i className="fas fa-sliders-h"></i>}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-brand-text dark:text-brand-text-dark mb-2">Unidade de Medida</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="units"
                                    value="kg"
                                    checked={localSettings.units === 'kg'}
                                    onChange={() => handleSettingChange('units', 'kg')}
                                    className="form-radio text-brand-primary focus:ring-brand-primary"
                                />
                                Quilogramas (kg)
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="units"
                                    value="lbs"
                                    checked={localSettings.units === 'lbs'}
                                    onChange={() => handleSettingChange('units', 'lbs')}
                                    className="form-radio text-brand-primary focus:ring-brand-primary"
                                />
                                Libras (lbs)
                            </label>
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="Notificações" icon={<i className="fas fa-bell"></i>}>
                 <div className="flex justify-between items-center">
                    <span className="font-medium text-brand-text dark:text-brand-text-dark">Lembretes de treino</span>
                    <label htmlFor="notification-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            id="notification-toggle"
                            className="sr-only peer"
                            checked={localSettings.notifications.workoutReminders}
                            onChange={(e) => handleNotificationChange('workoutReminders', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-brand-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                    </label>
                </div>
            </Card>

            <Card title="Tema de Cores" icon={<i className="fas fa-palette"></i>}>
                <div className="flex flex-wrap gap-4">
                    {Object.entries(themes).map(([key, themeOption]) => (
                        <div key={key} className="text-center">
                            <button
                                onClick={() => setLocalThemeKey(key)}
                                className={`w-16 h-10 rounded-lg border-2 transition-all ring-offset-brand-surface dark:ring-offset-brand-surface-dark ${
                                    localThemeKey === key ? 'border-brand-primary ring-2 ring-brand-primary' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                style={{ backgroundColor: themeOption.colors['brand-primary'].DEFAULT }}
                                aria-label={`Selecionar tema ${themeOption.name}`}
                            />
                            <p className="text-xs mt-2 text-brand-subtle">{themeOption.name}</p>
                        </div>
                    ))}
                </div>
            </Card>
            
            <Card title="Gestão de Dados" icon={<i className="fas fa-database"></i>}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={exportData} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
                        <i className="fas fa-file-export"></i>
                        Exportar Dados
                    </button>
                    <button onClick={handleImportClick} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
                        <i className="fas fa-file-import"></i>
                        Importar Dados
                    </button>
                    <input type="file" ref={importFileRef} onChange={handleImportFile} className="hidden" accept="application/json" />
                </div>
                <div className="mt-6 border-t border-red-500/30 pt-4">
                    <button onClick={handleResetData} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
                        <i className="fas fa-exclamation-triangle"></i>
                        Reiniciar Todos os Dados
                    </button>
                    <p className="text-xs text-center text-red-500 mt-2">Atenção: Esta ação é irreversível e irá apagar todo o seu progresso.</p>
                </div>
            </Card>

            <div className="flex flex-col items-end mt-8">
                <button
                    onClick={handleSave}
                    disabled={!isDirty}
                    className="px-8 py-3 rounded-lg bg-brand-primary text-white hover:bg-brand-primary-dark font-semibold transition-colors shadow disabled:bg-brand-subtle disabled:cursor-not-allowed"
                >
                    Salvar Alterações
                </button>
                {showSuccessMessage && !isDirty && <p className="text-right text-sm text-green-600 mt-2 animate-fadeIn">Configurações salvas com sucesso!</p>}
            </div>
        </div>
    );
};

export default Settings;