import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, Edit3, Trash2, Play, Dumbbell, ChevronRight } from 'lucide-react';
import { Workout } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

export function WorkoutList() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');

  useEffect(() => {
    if (user) loadWorkouts();
  }, [user]);

  const loadWorkouts = () => {
    setWorkouts(storage.getWorkouts(user?.id));
  };

  const handleCreateWorkout = () => {
    if (newWorkoutName.trim() && user) {
      const workout: Workout = {
        id: Date.now().toString(),
        name: newWorkoutName,
        exercises: [],
        createdAt: new Date().toISOString()
      };
      storage.addWorkout(workout, user.id);
      loadWorkouts();
      setNewWorkoutName('');
      setIsCreating(false);
    }
  };

  const handleDeleteWorkout = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este treino?') && user) {
      storage.deleteWorkout(id, user.id);
      loadWorkouts();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Meus Treinos</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-1.5 text-sm font-semibold active:bg-blue-700 touch-manipulation shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Novo
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-3 text-gray-800">Criar Novo Treino</h3>
          <input
            type="text"
            value={newWorkoutName}
            onChange={(e) => setNewWorkoutName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkout()}
            placeholder="Ex: Treino A — Peito e Tríceps"
            className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateWorkout}
              className="bg-blue-600 text-white px-4 py-3 rounded-xl flex-1 font-semibold active:bg-blue-700 touch-manipulation"
            >
              Criar
            </button>
            <button
              onClick={() => { setIsCreating(false); setNewWorkoutName(''); }}
              className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl flex-1 font-medium active:bg-gray-200 touch-manipulation"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {workouts.length === 0 && !isCreating ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium mb-1">Nenhum treino ainda</p>
          <p className="text-gray-400 text-sm mb-5">Crie seu primeiro treino para começar</p>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold active:bg-blue-700 touch-manipulation"
          >
            Criar Primeiro Treino
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Card Header */}
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-800 truncate">{workout.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {workout.exercises.length} exercício{workout.exercises.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Link
                      to={`/workout/${workout.id}`}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 active:bg-blue-100 touch-manipulation"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 active:bg-red-100 touch-manipulation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {workout.exercises.length > 0 && (
                  <div className="mt-2 space-y-0.5">
                    {workout.exercises.slice(0, 3).map((exercise) => (
                      <div key={exercise.id} className="text-xs text-gray-500 flex items-center gap-1 truncate">
                        <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                        {exercise.name} — {exercise.sets.length} série{exercise.sets.length !== 1 ? 's' : ''}
                      </div>
                    ))}
                    {workout.exercises.length > 3 && (
                      <div className="text-xs text-gray-400 pl-2">
                        +{workout.exercises.length - 3} mais
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Start Button */}
              <Link
                to={`/workout/${workout.id}/start`}
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-3.5 font-semibold text-sm active:bg-green-600 touch-manipulation"
              >
                <Play className="w-4 h-4 fill-white" />
                Iniciar Treino
                <ChevronRight className="w-4 h-4 ml-auto mr-4 opacity-70" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
