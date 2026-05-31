import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle2, Plus, Minus } from 'lucide-react';
import { Workout, WorkoutSession, Exercise } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

export function StartWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [sessionExercises, setSessionExercises] = useState<Exercise[]>([]);
  const [startTime] = useState(new Date());
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id && user) {
      const workouts = storage.getWorkouts(user.id);
      const found = workouts.find(w => w.id === id);
      if (found) {
        setWorkout(found);
        setSessionExercises(JSON.parse(JSON.stringify(found.exercises)));
      } else {
        navigate('/');
      }
    }
  }, [id, user, navigate]);

  const handleUpdateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', delta: number) => {
    setSessionExercises(exercises =>
      exercises.map(e =>
        e.id === exerciseId
          ? { ...e, sets: e.sets.map(s => s.id === setId ? { ...s, [field]: Math.max(0, s[field] + delta) } : s) }
          : e
      )
    );
  };

  const handleFinishWorkout = () => {
    if (!workout || !user) return;

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60);

    const session: WorkoutSession = {
      id: Date.now().toString(),
      workoutId: workout.id,
      workoutName: workout.name,
      date: new Date().toISOString(),
      exercises: sessionExercises,
      duration,
      notes
    };

    storage.addSession(session, user.id);
    alert(`Treino concluído! Duração: ${duration} minutos`);
    navigate('/history');
  };

  if (!workout) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (sessionExercises.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200 touch-manipulation">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-bold text-gray-800">Iniciar Treino</h2>
        </div>
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 mb-5">Este treino não possui exercícios.</p>
          <button
            onClick={() => navigate(`/workout/${workout.id}`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold active:bg-blue-700 touch-manipulation"
          >
            Editar Treino
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200 touch-manipulation flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-800 truncate">{workout.name}</h2>
          <p className="text-xs text-green-600 font-medium">Em andamento 💪</p>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-3">
        {sessionExercises.map((exercise, index) => (
          <div key={exercise.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Exercise Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-600">
              <span className="bg-white/30 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white truncate">{exercise.name}</h3>
                {exercise.notes && (
                  <p className="text-xs text-blue-200">💡 {exercise.notes}</p>
                )}
              </div>
            </div>

            {/* Sets */}
            <div className="divide-y divide-gray-100">
              {exercise.sets.map((set, setIndex) => (
                <div key={set.id} className="px-4 py-3">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Série {setIndex + 1}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Reps */}
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 text-center mb-2">Repetições</p>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onPointerDown={(e) => e.preventDefault()}
                          onClick={() => handleUpdateSet(exercise.id, set.id, 'reps', -1)}
                          className="w-11 h-11 bg-red-100 text-red-500 rounded-xl flex items-center justify-center active:bg-red-200 touch-manipulation"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="text-2xl font-bold text-gray-800 w-10 text-center">{set.reps}</span>
                        <button
                          onPointerDown={(e) => e.preventDefault()}
                          onClick={() => handleUpdateSet(exercise.id, set.id, 'reps', 1)}
                          className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center active:bg-green-200 touch-manipulation"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 text-center mb-2">Carga (kg)</p>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onPointerDown={(e) => e.preventDefault()}
                          onClick={() => handleUpdateSet(exercise.id, set.id, 'weight', -2.5)}
                          className="w-11 h-11 bg-red-100 text-red-500 rounded-xl flex items-center justify-center active:bg-red-200 touch-manipulation"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="text-2xl font-bold text-gray-800 w-10 text-center">{set.weight}</span>
                        <button
                          onPointerDown={(e) => e.preventDefault()}
                          onClick={() => handleUpdateSet(exercise.id, set.id, 'weight', 2.5)}
                          className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center active:bg-green-200 touch-manipulation"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Observações do treino (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Como foi o treino hoje? Alguma observação?"
          className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
          rows={3}
        />
      </div>

      {/* Finish button — fixed above bottom nav */}
      <div
        className="fixed left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 64px)' }}
      >
        <button
          onClick={handleFinishWorkout}
          className="w-full bg-green-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-base active:bg-green-600 touch-manipulation shadow-md"
        >
          <CheckCircle2 className="w-6 h-6" />
          Finalizar Treino
        </button>
      </div>
    </div>
  );
}
