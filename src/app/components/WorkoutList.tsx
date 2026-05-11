import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, Edit, Trash2, Play, Dumbbell } from 'lucide-react';
import { Workout } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

export function WorkoutList() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');

  useEffect(() => {
    if (user) {
      loadWorkouts();
    }
  }, [user]);

  const loadWorkouts = () => {
    const loadedWorkouts = storage.getWorkouts(user?.id);
    setWorkouts(loadedWorkouts);
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Meus Treinos</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-4 py-2 sm:py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 hover:bg-blue-700 transition w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Novo Treino
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="font-semibold mb-3 text-base sm:text-lg">Criar Novo Treino</h3>
          <input
            type="text"
            value={newWorkoutName}
            onChange={(e) => setNewWorkoutName(e.target.value)}
            placeholder="Nome do treino (ex: Treino A - Peito e Tríceps)"
            className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateWorkout}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex-1 sm:flex-initial"
            >
              Criar
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewWorkoutName('');
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex-1 sm:flex-initial"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {workouts.length === 0 && !isCreating ? (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
          <Dumbbell className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4 text-sm sm:text-base">Nenhum treino criado ainda</p>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Criar Primeiro Treino
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{workout.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {workout.exercises.length} exercício(s)
                  </p>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0 ml-2">
                  <Link
                    to={`/workout/${workout.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteWorkout(workout.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {workout.exercises.length > 0 && (
                <div className="mb-3 space-y-1">
                  {workout.exercises.slice(0, 3).map((exercise) => (
                    <div key={exercise.id} className="text-xs sm:text-sm text-gray-600 truncate">
                      • {exercise.name} - {exercise.sets.length} série(s)
                    </div>
                  ))}
                  {workout.exercises.length > 3 && (
                    <div className="text-xs sm:text-sm text-gray-400">
                      +{workout.exercises.length - 3} exercício(s)
                    </div>
                  )}
                </div>
              )}

              <Link
                to={`/workout/${workout.id}/start`}
                className="w-full bg-green-600 text-white px-4 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition text-sm sm:text-base"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                Iniciar Treino
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}