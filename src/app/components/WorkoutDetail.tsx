import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Plus, Trash2, Minus } from 'lucide-react';
import { Workout, Exercise, Set } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center active:bg-gray-200 touch-manipulation"
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        <span className="w-12 text-center text-base font-bold text-gray-800">{value}</span>
        <button
          onClick={() => onChange(value + step)}
          className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center active:bg-blue-100 touch-manipulation"
        >
          <Plus className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </div>
  );
}

export function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', numSets: 3, reps: 10, weight: 0, notes: '' });

  useEffect(() => {
    if (id && user) {
      const workouts = storage.getWorkouts(user.id);
      const found = workouts.find(w => w.id === id);
      if (found) setWorkout(found);
      else navigate('/');
    }
  }, [id, user, navigate]);

  const save = (updated: Workout) => {
    storage.updateWorkout(updated.id, updated, user?.id);
    setWorkout(updated);
  };

  const handleAddExercise = () => {
    if (!workout || !newExercise.name.trim()) return;
    const sets: Set[] = Array.from({ length: newExercise.numSets }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      reps: newExercise.reps,
      weight: newExercise.weight,
    }));
    const exercise: Exercise = { id: Date.now().toString(), name: newExercise.name, sets, notes: newExercise.notes };
    save({ ...workout, exercises: [...workout.exercises, exercise] });
    setNewExercise({ name: '', numSets: 3, reps: 10, weight: 0, notes: '' });
    setIsAddingExercise(false);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    if (!workout || !user) return;
    save({ ...workout, exercises: workout.exercises.filter(e => e.id !== exerciseId) });
  };

  const handleUpdateExerciseName = (exerciseId: string, name: string) => {
    if (!workout || !user) return;
    save({ ...workout, exercises: workout.exercises.map(e => e.id === exerciseId ? { ...e, name } : e) });
  };

  const handleUpdateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => {
    if (!workout || !user) return;
    save({
      ...workout,
      exercises: workout.exercises.map(e =>
        e.id === exerciseId
          ? { ...e, sets: e.sets.map(s => s.id === setId ? { ...s, [field]: value } : s) }
          : e
      ),
    });
  };

  const handleAddSet = (exerciseId: string) => {
    if (!workout || !user) return;
    const exercise = workout.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    const last = exercise.sets[exercise.sets.length - 1];
    const newSet: Set = { id: `${Date.now()}`, reps: last?.reps ?? 10, weight: last?.weight ?? 0 };
    save({
      ...workout,
      exercises: workout.exercises.map(e =>
        e.id === exerciseId ? { ...e, sets: [...e.sets, newSet] } : e
      ),
    });
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    if (!workout || !user) return;
    save({
      ...workout,
      exercises: workout.exercises.map(e =>
        e.id === exerciseId ? { ...e, sets: e.sets.filter(s => s.id !== setId) } : e
      ),
    });
  };

  if (!workout) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200 touch-manipulation flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-lg font-bold text-gray-800 truncate flex-1">{workout.name}</h2>
      </div>

      <button
        onClick={() => setIsAddingExercise(true)}
        className="w-full bg-blue-600 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold active:bg-blue-700 touch-manipulation shadow-sm"
      >
        <Plus className="w-5 h-5" />
        Adicionar Exercício
      </button>

      {isAddingExercise && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4 text-gray-800">Novo Exercício</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Nome</label>
              <input
                type="text"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                placeholder="ex: Supino Reto"
                className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                autoFocus
              />
            </div>

            <div className="flex justify-around py-2">
              <Stepper
                label="Séries"
                value={newExercise.numSets}
                onChange={(v) => setNewExercise({ ...newExercise, numSets: v })}
                min={1}
              />
              <Stepper
                label="Reps"
                value={newExercise.reps}
                onChange={(v) => setNewExercise({ ...newExercise, reps: v })}
              />
              <Stepper
                label="Carga (kg)"
                value={newExercise.weight}
                onChange={(v) => setNewExercise({ ...newExercise, weight: v })}
                step={2.5}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Observações (opcional)</label>
              <input
                type="text"
                value={newExercise.notes}
                onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                placeholder="ex: Pegada larga"
                className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddExercise}
              className="bg-blue-600 text-white px-4 py-3 rounded-xl flex-1 font-semibold active:bg-blue-700 touch-manipulation"
            >
              Adicionar
            </button>
            <button
              onClick={() => { setIsAddingExercise(false); setNewExercise({ name: '', numSets: 3, reps: 10, weight: 0, notes: '' }); }}
              className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl flex-1 font-medium active:bg-gray-200 touch-manipulation"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {workout.exercises.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">Nenhum exercício adicionado ainda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {workout.exercises.map((exercise, index) => (
            <div key={exercise.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Exercise Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => handleUpdateExerciseName(exercise.id, e.target.value)}
                  className="flex-1 text-base font-semibold text-gray-800 bg-transparent focus:outline-none border-b border-transparent focus:border-blue-400 min-w-0"
                />
                <button
                  onClick={() => handleDeleteExercise(exercise.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 active:bg-red-100 touch-manipulation flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Sets */}
              <div className="px-4 py-3 space-y-3">
                {exercise.sets.map((set, setIndex) => (
                  <div key={set.id} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Série {setIndex + 1}
                      </span>
                      {exercise.sets.length > 1 && (
                        <button
                          onClick={() => handleDeleteSet(exercise.id, set.id)}
                          className="text-red-400 active:text-red-600 touch-manipulation text-xs"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                    <div className="flex justify-around">
                      <Stepper
                        label="Reps"
                        value={set.reps}
                        onChange={(v) => handleUpdateSet(exercise.id, set.id, 'reps', v)}
                      />
                      <Stepper
                        label="Carga (kg)"
                        value={set.weight}
                        onChange={(v) => handleUpdateSet(exercise.id, set.id, 'weight', v)}
                        step={2.5}
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => handleAddSet(exercise.id)}
                  className="w-full py-2.5 border border-dashed border-blue-300 rounded-xl text-blue-600 text-sm font-medium flex items-center justify-center gap-1.5 active:bg-blue-50 touch-manipulation"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Série
                </button>

                {exercise.notes && (
                  <p className="text-xs text-gray-400 italic">💡 {exercise.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
