import { Workout, WorkoutSession, Exercise, Set } from '../types';

const WORKOUTS_KEY = 'gym_workouts';
const SESSIONS_KEY = 'gym_sessions';

// Função para obter a chave com prefixo do usuário
function getUserKey(baseKey: string, userId?: string): string {
  if (!userId) return baseKey;
  return `${baseKey}_user_${userId}`;
}

// Função para migrar exercícios antigos para o novo formato
function migrateExercise(exercise: any): Exercise {
  // Se já está no formato novo (sets é array), retorna como está
  if (Array.isArray(exercise.sets)) {
    return exercise as Exercise;
  }
  
  // Formato antigo: { sets: number, reps: number, weight: number }
  // Converter para novo formato: { sets: Set[] }
  const numSets = exercise.sets || 3;
  const reps = exercise.reps || 10;
  const weight = exercise.weight || 0;
  
  const sets: Set[] = Array.from({ length: numSets }, (_, i) => ({
    id: `${exercise.id}-set-${i}`,
    reps: reps,
    weight: weight
  }));
  
  return {
    id: exercise.id,
    name: exercise.name,
    sets: sets,
    notes: exercise.notes
  };
}

// Função para migrar workout
function migrateWorkout(workout: any): Workout {
  return {
    ...workout,
    exercises: workout.exercises.map((e: any) => migrateExercise(e))
  };
}

// Função para migrar sessão
function migrateSession(session: any): WorkoutSession {
  return {
    ...session,
    exercises: session.exercises.map((e: any) => migrateExercise(e))
  };
}

export const storage = {
  getWorkouts: (userId?: string): Workout[] => {
    const key = getUserKey(WORKOUTS_KEY, userId);
    const data = localStorage.getItem(key);
    if (!data) return [];
    
    const workouts = JSON.parse(data);
    // Migrar dados se necessário
    const migratedWorkouts = workouts.map((w: any) => migrateWorkout(w));
    
    // Salvar dados migrados
    if (JSON.stringify(workouts) !== JSON.stringify(migratedWorkouts)) {
      localStorage.setItem(key, JSON.stringify(migratedWorkouts));
    }
    
    return migratedWorkouts;
  },

  saveWorkouts: (workouts: Workout[], userId?: string): void => {
    const key = getUserKey(WORKOUTS_KEY, userId);
    localStorage.setItem(key, JSON.stringify(workouts));
  },

  getSessions: (userId?: string): WorkoutSession[] => {
    const key = getUserKey(SESSIONS_KEY, userId);
    const data = localStorage.getItem(key);
    if (!data) return [];
    
    const sessions = JSON.parse(data);
    // Migrar dados se necessário
    const migratedSessions = sessions.map((s: any) => migrateSession(s));
    
    // Salvar dados migrados
    if (JSON.stringify(sessions) !== JSON.stringify(migratedSessions)) {
      localStorage.setItem(key, JSON.stringify(migratedSessions));
    }
    
    return migratedSessions;
  },

  saveSessions: (sessions: WorkoutSession[], userId?: string): void => {
    const key = getUserKey(SESSIONS_KEY, userId);
    localStorage.setItem(key, JSON.stringify(sessions));
  },

  addWorkout: (workout: Workout, userId?: string): void => {
    const workouts = storage.getWorkouts(userId);
    workouts.push(workout);
    storage.saveWorkouts(workouts, userId);
  },

  updateWorkout: (id: string, updatedWorkout: Workout, userId?: string): void => {
    const workouts = storage.getWorkouts(userId);
    const index = workouts.findIndex(w => w.id === id);
    if (index !== -1) {
      workouts[index] = updatedWorkout;
      storage.saveWorkouts(workouts, userId);
    }
  },

  deleteWorkout: (id: string, userId?: string): void => {
    const workouts = storage.getWorkouts(userId).filter(w => w.id !== id);
    storage.saveWorkouts(workouts, userId);
  },

  addSession: (session: WorkoutSession, userId?: string): void => {
    const sessions = storage.getSessions(userId);
    sessions.push(session);
    storage.saveSessions(sessions, userId);
  },

  deleteSession: (id: string, userId?: string): void => {
    const sessions = storage.getSessions(userId).filter(s => s.id !== id);
    storage.saveSessions(sessions, userId);
  }
};