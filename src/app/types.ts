export interface Set {
  id: string;
  reps: number;
  weight: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: string;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  workoutName: string;
  date: string;
  exercises: Exercise[];
  duration?: number;
  notes?: string;
}

export interface ExerciseProgress {
  exerciseName: string;
  history: {
    date: string;
    sets: Set[];
  }[];
}