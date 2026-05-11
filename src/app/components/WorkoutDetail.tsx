import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Plus, Trash2, X } from 'lucide-react';
import { Workout, Exercise, Set } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

export function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    numSets: 3,
    reps: 10,
    weight: 0,
    notes: ''
  });

  useEffect(() => {
    if (id && user) {
      const workouts = storage.getWorkouts(user.id);
      const found = workouts.find(w => w.id === id);
      if (found) {
        setWorkout(found);
      } else {
        navigate('/');
      }
    }
  }, [id, user, navigate]);

  const handleAddExercise = () => {
    if (!workout || !newExercise.name.trim()) return;

    // Criar séries baseado no número de séries
    const sets: Set[] = Array.from({ length: newExercise.numSets }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      reps: newExercise.reps,
      weight: newExercise.weight
    }));

    const exercise: Exercise = {
      id: Date.now().toString(),
      name: newExercise.name,
      sets: sets,
      notes: newExercise.notes
    };

    const updatedWorkout = {
      ...workout,
      exercises: [...workout.exercises, exercise]
    };

    storage.updateWorkout(workout.id, updatedWorkout, user?.id);
    setWorkout(updatedWorkout);
    setNewExercise({ name: '', numSets: 3, reps: 10, weight: 0, notes: '' });
    setIsAddingExercise(false);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    if (!workout || !user) return;

    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.filter(e => e.id !== exerciseId)
    };

    storage.updateWorkout(workout.id, updatedWorkout, user.id);
    setWorkout(updatedWorkout);
  };

  const handleUpdateExerciseName = (exerciseId: string, name: string) => {
    if (!workout || !user) return;

    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.map(e =>
        e.id === exerciseId ? { ...e, name } : e
      )
    };

    storage.updateWorkout(workout.id, updatedWorkout, user.id);
    setWorkout(updatedWorkout);
  };

  const handleUpdateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => {
    if (!workout || !user) return;

    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.map(e =>
        e.id === exerciseId
          ? {
              ...e,
              sets: e.sets.map(s =>
                s.id === setId ? { ...s, [field]: value } : s
              )
            }
          : e
      )
    };

    storage.updateWorkout(workout.id, updatedWorkout, user.id);
    setWorkout(updatedWorkout);
  };

  const handleAddSet = (exerciseId: string) => {
    if (!workout || !user) return;

    const exercise = workout.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;

    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.map(e =>
        e.id === exerciseId
          ? {
              ...e,
              sets: [
                ...e.sets,
                {
                  id: `${Date.now()}`,
                  reps: e.sets.length > 0 ? e.sets[e.sets.length - 1].reps : 10,
                  weight: e.sets.length > 0 ? e.sets[e.sets.length - 1].weight : 0
                }
              ]
            }
          : e
      )
    };

    storage.updateWorkout(workout.id, updatedWorkout, user.id);
    setWorkout(updatedWorkout);
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    if (!workout || !user) return;

    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.map(e =>
        e.id === exerciseId
          ? { ...e, sets: e.sets.filter(s => s.id !== setId) }
          : e
      )
    };

    storage.updateWorkout(workout.id, updatedWorkout, user.id);
    setWorkout(updatedWorkout);
  };

  if (!workout) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-200 rounded-lg transition flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{workout.name}</h2>
      </div>

      <button
        onClick={() => setIsAddingExercise(true)}
        className="w-full bg-blue-600 text-white px-4 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition text-sm sm:text-base"
      >
        <Plus className="w-5 h-5" />
        Adicionar Exercício
      </button>

      {isAddingExercise && (
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="font-semibold mb-3 text-base sm:text-lg">Novo Exercício</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Exercício
              </label>
              <input
                type="text"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                placeholder="ex: Supino Reto"
                className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Séries
                </label>
                <input
                  type="number"
                  value={newExercise.numSets}
                  onChange={(e) => setNewExercise({ ...newExercise, numSets: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="w-full px-2 sm:px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Reps
                </label>
                <input
                  type="number"
                  value={newExercise.reps}
                  onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 sm:px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Carga
                </label>
                <input
                  type="number"
                  value={newExercise.weight}
                  onChange={(e) => setNewExercise({ ...newExercise, weight: parseFloat(e.target.value) || 0 })}
                  step="0.5"
                  className="w-full px-2 sm:px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações (opcional)
              </label>
              <input
                type="text"
                value={newExercise.notes}
                onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                placeholder="ex: Pegada larga"
                className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddExercise}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex-1 sm:flex-initial"
            >
              Adicionar
            </button>
            <button
              onClick={() => {
                setIsAddingExercise(false);
                setNewExercise({ name: '', numSets: 3, reps: 10, weight: 0, notes: '' });
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex-1 sm:flex-initial"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {workout.exercises.length === 0 ? (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-sm sm:text-base">Nenhum exercício adicionado ainda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {workout.exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => handleUpdateExerciseName(exercise.id, e.target.value)}
                      className="text-base sm:text-lg font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none flex-1 min-w-0"
                    />
                  </div>

                  {/* Tabela de séries */}
                  <div className="mb-3 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
                    <div className="min-w-[280px]">
                      <div className="grid grid-cols-12 gap-1 sm:gap-2 mb-2 text-xs font-medium text-gray-600">
                        <div className="col-span-2">Série</div>
                        <div className="col-span-4">Reps</div>
                        <div className="col-span-4">Carga (kg)</div>
                        <div className="col-span-2"></div>
                      </div>
                      {exercise.sets.map((set, setIndex) => (
                        <div key={set.id} className="grid grid-cols-12 gap-1 sm:gap-2 mb-2">
                          <div className="col-span-2 flex items-center">
                            <span className="text-xs sm:text-sm font-medium text-gray-700">{setIndex + 1}ª</span>
                          </div>
                          <div className="col-span-4">
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) => handleUpdateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                              className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="col-span-4">
                            <input
                              type="number"
                              value={set.weight}
                              onChange={(e) => handleUpdateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                              step="0.5"
                              className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="col-span-2 flex items-center justify-center">
                            {exercise.sets.length > 1 && (
                              <button
                                onClick={() => handleDeleteSet(exercise.id, set.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                              >
                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddSet(exercise.id)}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    Adicionar Série
                  </button>
                  
                  {exercise.notes && (
                    <p className="text-xs sm:text-sm text-gray-500 italic mt-2">💡 {exercise.notes}</p>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteExercise(exercise.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition ml-2 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}