import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Check, Plus, Minus } from 'lucide-react';
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
          ? {
              ...e,
              sets: e.sets.map(s =>
                s.id === setId
                  ? { ...s, [field]: Math.max(0, s[field] + delta) }
                  : s
              )
            }
          : e
      )
    );
  };

  const handleFinishWorkout = () => {
    if (!workout || !user) return;

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60); // em minutos

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
    return <div>Carregando...</div>;
  }

  if (sessionExercises.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Iniciar Treino</h2>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-500 mb-4">
            Este treino não possui exercícios cadastrados.
          </p>
          <button
            onClick={() => navigate(`/workout/${workout.id}`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Editar Treino
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-200 rounded-lg transition flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{workout.name}</h2>
          <p className="text-xs sm:text-sm text-gray-500">Em andamento...</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-3 sm:p-4 rounded-lg">
        <p className="text-xs sm:text-sm text-blue-800">
          💪 Ajuste as cargas e reps de cada série conforme necessário durante o treino.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {sessionExercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="bg-blue-600 text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold flex-shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{exercise.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {exercise.sets.length} série(s)
                </p>
                {exercise.notes && (
                  <p className="text-xs sm:text-sm text-gray-500 italic mt-1">💡 {exercise.notes}</p>
                )}
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {exercise.sets.map((set, setIndex) => (
                <div key={set.id} className="bg-gray-50 p-2.5 sm:p-3 rounded-lg">
                  <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Série {setIndex + 1}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {/* Repetições */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Repetições</label>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                          onClick={() => handleUpdateSet(exercise.id, set.id, 'reps', -1)}
                          className="bg-red-100 text-red-600 p-1.5 sm:p-2 rounded-lg hover:bg-red-200 transition active:scale-95 touch-manipulation"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <div className="flex-1 text-center">
                          <span className="text-xl sm:text-2xl font-bold text-gray-800">
                            {set.reps}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleUpdateSet(exercise.id, set.id, 'reps', 1)}
                          className="bg-green-100 text-green-600 p-1.5 sm:p-2 rounded-lg hover:bg-green-200 transition active:scale-95 touch-manipulation"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Carga */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Carga (kg)</label>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                          onClick={() => handleUpdateSet(exercise.id, set.id, 'weight', -2.5)}
                          className="bg-red-100 text-red-600 p-1.5 sm:p-2 rounded-lg hover:bg-red-200 transition active:scale-95 touch-manipulation"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <div className="flex-1 text-center">
                          <span className="text-xl sm:text-2xl font-bold text-gray-800">
                            {set.weight}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleUpdateSet(exercise.id, set.id, 'weight', 2.5)}
                          className="bg-green-100 text-green-600 p-1.5 sm:p-2 rounded-lg hover:bg-green-200 transition active:scale-95 touch-manipulation"
                        >
                          <Plus className="w-4 h-4" />
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

      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observações do treino (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Como foi o treino hoje? Alguma observação?"
          className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="fixed bottom-16 sm:bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 shadow-lg z-40">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleFinishWorkout}
            className="w-full bg-green-600 text-white px-6 py-3 sm:py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition font-semibold text-base sm:text-lg active:scale-95 touch-manipulation"
          >
            <Check className="w-5 h-5 sm:w-6 sm:h-6" />
            Finalizar Treino
          </button>
        </div>
      </div>
    </div>
  );
}