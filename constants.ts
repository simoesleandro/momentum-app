import type { AppData } from './types';

export const INITIAL_USER_DATA: AppData = {
  userName: 'Atleta',
  profilePictureUrl: 'https://ui-avatars.com/api/?name=A&background=7c3aed&color=fff&size=128',
  height: 1.65,
  goalWeight: 60.0,
  initialWeight: 65.0,
  level: 1,
  xp: 0,
  workouts: [
    {
      id: 'A',
      name: '🔥 Treino A - Inferiores (Foco Quadríceps & Glúteos)',
      intensity: 4,
      exercises: [
        { id: 'a1', name: 'Agachamento na Máquina Smith', group: 'Quadríceps', sets: 4, reps: '10', currentLoad: 0, loadHistory: [] },
        { id: 'a2', name: 'Leg Press 45', group: 'Quadríceps', sets: 3, reps: '12', currentLoad: 0, loadHistory: [] },
        { id: 'a3', name: 'Cadeira Extensora', group: 'Quadríceps', sets: 3, reps: '15', currentLoad: 0, loadHistory: [] },
        { id: 'a4', name: 'Hip Thrust (Elevação Pélvica)', group: 'Glúteos', sets: 4, reps: '12', currentLoad: 0, loadHistory: [] },
        { id: 'a5', name: 'Stiff (Levantamento Terra Romeno)', group: 'Posteriores', sets: 3, reps: '12', currentLoad: 0, loadHistory: [] },
        { id: 'a6', name: 'Cadeira Abdutora', group: 'Glúteos', sets: 3, reps: '15', currentLoad: 0, loadHistory: [] },
        { id: 'a7', name: 'Panturrilha em pé', group: 'Panturrilha', sets: 4, reps: '20', currentLoad: 0, loadHistory: [] }
      ]
    },
    {
      id: 'B',
      name: '🔥 Treino B - Superiores (Foco Costas & Ombros)',
      intensity: 3,
      exercises: [
        { id: 'b1', name: 'Puxada Frontal', group: 'Costas', sets: 4, reps: '10', currentLoad: 0, loadHistory: [] },
        { id: 'b2', name: 'Remada Curvada', group: 'Costas', sets: 3, reps: '12', currentLoad: 0, loadHistory: [] },
        { id: 'b3', name: 'Desenvolvimento com Halteres', group: 'Ombros', sets: 4, reps: '10', currentLoad: 0, loadHistory: [] },
        { id: 'b4', name: 'Elevação Lateral', group: 'Ombros', sets: 3, reps: '15', currentLoad: 0, loadHistory: [] },
        { id: 'b5', name: 'Rosca Direta', group: 'Bíceps', sets: 3, reps: '12', currentLoad: 0, loadHistory: [] },
        { id: 'b6', name: 'Tríceps Corda', group: 'Tríceps', sets: 3, reps: '12', currentLoad: 0, loadHistory: [] }
      ]
    },
    {
      id: 'C',
      name: '🔥 Treino C - Inferiores (Foco Posteriores & Glúteos)',
      intensity: 4,
      exercises: [
        { id: 'c1', name: 'Stiff (Levantamento Terra Romeno)', group: 'Posteriores', sets: 4, reps: '10', currentLoad: 0, loadHistory: [] },
        { id: 'c2', name: 'Mesa Flexora (Flexora Deitada)', group: 'Posteriores', sets: 3, reps: '12', currentLoad: 0, loadHistory: [] },
        { id: 'c3', name: 'Agachamento Búlgaro', group: 'Glúteos', sets: 3, reps: '12', currentLoad: 0, loadHistory: [] },
        { id: 'c4', name: 'Hip Thrust (Elevação Pélvica)', group: 'Glúteos', sets: 4, reps: '15', currentLoad: 0, loadHistory: [] },
        { id: 'c5', name: 'Cadeira Adutora', group: 'Adutores', sets: 3, reps: '15', currentLoad: 0, loadHistory: [] },
        { id: 'c6', name: 'Panturrilha sentado', group: 'Panturrilha', sets: 4, reps: '20', currentLoad: 0, loadHistory: [] }
      ]
    }
  ],
  weightLog: [],
  waterIntakeLog: [],
  waterGoal: 2.5,
  attendance: [],
  bodyMeasurements: [],
  progressPhotos: [],
  calendarSchedule: {},
  unlockedAchievements: [],
  nutritionChatHistory: [],
  settings: {
    units: 'kg',
    notifications: {
      workoutReminders: true,
    },
  },
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