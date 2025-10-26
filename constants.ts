import type { AppData } from './types';

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];

const createInitialSchedule = () => {
  const schedule: { [key: string]: string } = {};
  const d = new Date();
  
  // Monday of the current week
  d.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1));
  schedule[formatDate(d)] = 'A';
  
  // Tuesday
  d.setDate(d.getDate() + 1);
  schedule[formatDate(d)] = 'B';
  
  // Wednesday
  d.setDate(d.getDate() + 1);
  schedule[formatDate(d)] = 'C';
  
  // Thursday
  d.setDate(d.getDate() + 1);
  schedule[formatDate(d)] = 'A';

  // Friday
  d.setDate(d.getDate() + 1);
  schedule[formatDate(d)] = 'B';
  
  return schedule;
};


export const INITIAL_USER_DATA: AppData = {
  userName: 'Marta Miranda Simões',
  profilePictureUrl: 'https://ui-avatars.com/api/?name=Marta+Simões&background=7c3aed&color=fff&size=128',
  height: 1.67,
  goalWeight: 60.0,
  initialWeight: 57.0,
  level: 1,
  xp: 0,
  weightLog: [{ date: '2024-01-01', weight: 57.0 }, { date: '2024-01-08', weight: 56.5 }],
  waterIntakeLog: [],
  waterGoal: 2.5,
  attendance: [],
  bodyMeasurements: [],
  progressPhotos: [],
  calendarSchedule: createInitialSchedule(),
  unlockedAchievements: [],
  nutritionChatHistory: [],
  settings: {
    units: 'kg',
    notifications: {
      workoutReminders: true,
    },
  },
  workouts: [
    {
      id: 'A',
      name: '🔥 TREINO A – Quadríceps (Foco Máximo)',
      intensity: 5,
      exercises: [
        { id: 'a1', name: 'Agachamento Livre Profundo', group: 'Quadríceps', setsReps: '5x5-6', currentLoad: 0, loadHistory: [] },
        { id: 'a2', name: 'Afundo / Passada Frontal com Halteres', group: 'Quadríceps', setsReps: '4x10-12', currentLoad: 0, loadHistory: [] },
        { id: 'a3', name: 'Step-up em Banco com Halteres', group: 'Quadríceps', setsReps: '3x12', currentLoad: 0, loadHistory: [] },
        { id: 'a4', name: 'Cadeira Extensora', group: 'Quadríceps', setsReps: '3x12-15', currentLoad: 0, loadHistory: [] },
        { id: 'a5', name: 'Cadeira Adutora', group: 'Adutores', setsReps: '3x15-20', currentLoad: 0, loadHistory: [] },
      ],
    },
    {
      id: 'B',
      name: '🔥 TREINO B – Posterior + Glúteos + Panturrilha',
      intensity: 5,
      exercises: [
        { id: 'b1', name: 'Stiff (Levantamento Terra Romeno)', group: 'Posteriores', setsReps: '4x6-8', currentLoad: 0, loadHistory: [] },
        { id: 'b2', name: 'Hip Thrust (Elevação Pélvica)', group: 'Glúteos', setsReps: '4x8-10', currentLoad: 0, loadHistory: [] },
        { id: 'b3', name: 'Agachamento Búlgaro', group: 'Glúteos', setsReps: '3x10-12', currentLoad: 0, loadHistory: [] },
        { id: 'b4', name: 'Mesa Flexora (Flexora Deitada)', group: 'Posteriores', setsReps: '4x10-12', currentLoad: 0, loadHistory: [] },
        { id: 'b5', name: 'Cadeira Abdutora', group: 'Glúteos', setsReps: '3x15-20', currentLoad: 0, loadHistory: [] },
        { id: 'b6', name: 'Panturrilha sentado', group: 'Panturrilha', setsReps: '4x15-20', currentLoad: 0, loadHistory: [] },
      ],
    },
    {
      id: 'C',
      name: '🔥 TREINO C – Superiores (Enxuto)',
      intensity: 4,
      exercises: [
        { id: 'c1', name: 'Supino Reto com Barra', group: 'Peito', setsReps: '4x6-8', currentLoad: 0, loadHistory: [] },
        { id: 'c2', name: 'Remada Curvada', group: 'Costas', setsReps: '4x8-10', currentLoad: 0, loadHistory: [] },
        { id: 'c3', name: 'Elevação Lateral', group: 'Ombros', setsReps: '3x10-12', currentLoad: 0, loadHistory: [] },
        { id: 'c4', name: 'Rosca Direta', group: 'Bíceps', setsReps: '3x8-10', currentLoad: 0, loadHistory: [] },
        { id: 'c5', name: 'Tríceps Corda', group: 'Tríceps', setsReps: '3x10-12', currentLoad: 0, loadHistory: [] },
      ],
    },
  ],
};

export const EXERCISE_ALTERNATIVES: { [key: string]: string[] } = {
    'Quadríceps': ['Agachamento Hack', 'Leg Press Unilateral', 'Agachamento Sumô'],
    'Posteriores': ['Stiff com Halteres', 'Good Morning', 'Cadeira Flexora'],
    'Glúteos': ['Glúteo na Polia', 'Coice na Máquina', 'Ponte Unilateral com Halter'],
    'Costas': ['Remada Cavalinho', 'Puxada Neutra', 'Serrote'],
    'Ombros': ['Elevação Frontal', 'Desenvolvimento Arnold', 'Crucifixio Inverso'],
    'Peito': ['Supino Inclinado com Halteres', 'Crucifixo na Máquina', 'Flexões'],
    'Bíceps': ['Rosca Scott', 'Rosca Martelo', 'Rosca Concentrada'],
    'Tríceps': ['Tríceps Testa', 'Tríceps Francês', 'Mergulho no Banco'],
    'Panturrilha': ['Panturrilha no Leg Press', 'Panturrilha em pé', 'Panturrilha Burrinho'],
    'Adutores': ['Agachamento Sumô'],
    'Abdômen/Core': ['Elevação de Pernas Deitado', 'Abdominal "Bicicleta"', 'Ponte de Glúteos'],
};

export const NUTRITION_TIPS = [
  { icon: '🍗', text: 'Consuma proteína em todas as refeições para maximizar a síntese de massa muscular.' },
  { icon: '💧', text: 'A hidratação é crucial para a performance. Beba água consistentemente durante o dia, não apenas durante o treino.' },
  { icon: '😴', text: 'O sono de qualidade é quando os seus músculos realmente crescem e recuperam. Tente dormir 7-9 horas por noite.' },
  { icon: '🥦', text: 'Não negligencie vegetais e frutas. Eles fornecem micronutrientes essenciais para a recuperação e saúde geral.' },
  { icon: '🥑', text: 'Gorduras saudáveis (abacate, nozes, azeite) são vitais para a produção hormonal, incluindo hormonas que ajudam no ganho muscular.' },
  { icon: '🍚', text: 'Carboidratos complexos (aveia, batata doce, arroz integral) são a sua principal fonte de energia para treinos intensos.' },
  { icon: '🕒', text: 'Tente fazer uma refeição rica em proteínas e carboidratos até 90 minutos após o treino para otimizar a recuperação.' },
];