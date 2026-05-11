import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { WorkoutSession, ExerciseProgress } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

export function ProgressView() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [progressData, setProgressData] = useState<ExerciseProgress | null>(null);

  useEffect(() => {
    if (user) {
      loadExercises();
    }
  }, [user]);

  useEffect(() => {
    if (selectedExercise && user) {
      loadProgressData(selectedExercise);
    }
  }, [selectedExercise, user]);

  const loadExercises = () => {
    const sessions = storage.getSessions(user?.id);
    const exerciseSet = new Set<string>();

    sessions.forEach(session => {
      session.exercises.forEach(exercise => {
        exerciseSet.add(exercise.name);
      });
    });

    const exerciseList = Array.from(exerciseSet).sort();
    setExercises(exerciseList);
    
    if (exerciseList.length > 0 && !selectedExercise) {
      setSelectedExercise(exerciseList[0]);
    }
  };

  const loadProgressData = (exerciseName: string) => {
    const sessions = storage.getSessions(user?.id);
    const history: ExerciseProgress['history'] = [];

    sessions.forEach(session => {
      const exercise = session.exercises.find(e => e.name === exerciseName);
      if (exercise) {
        history.push({
          date: session.date,
          sets: exercise.sets
        });
      }
    });

    // Ordenar por data
    history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setProgressData({
      exerciseName,
      history
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getChartData = () => {
    if (!progressData) return [];

    return progressData.history.map(entry => {
      // Calcular carga máxima e volume total
      const maxWeight = Math.max(...entry.sets.map(s => s.weight));
      const totalVolume = entry.sets.reduce((acc, s) => acc + (s.weight * s.reps), 0);
      const avgWeight = entry.sets.reduce((acc, s) => acc + s.weight, 0) / entry.sets.length;

      return {
        date: formatDate(entry.date),
        'Carga Máxima (kg)': maxWeight,
        'Carga Média (kg)': parseFloat(avgWeight.toFixed(1)),
        'Volume Total (kg)': totalVolume
      };
    });
  };

  const getStats = () => {
    if (!progressData || progressData.history.length === 0) return null;

    const allWeights = progressData.history.flatMap(h => h.sets.map(s => s.weight));
    const maxWeight = Math.max(...allWeights);
    const minWeight = Math.min(...allWeights);
    const avgWeight = allWeights.reduce((a, b) => a + b, 0) / allWeights.length;
    
    const firstMaxWeight = Math.max(...progressData.history[0].sets.map(s => s.weight));
    const lastMaxWeight = Math.max(...progressData.history[progressData.history.length - 1].sets.map(s => s.weight));
    const improvement = lastMaxWeight - firstMaxWeight;
    const improvementPercent = firstMaxWeight > 0 ? (improvement / firstMaxWeight) * 100 : 0;

    const totalVolume = progressData.history.reduce((acc, h) => {
      return acc + h.sets.reduce((sum, s) => sum + (s.weight * s.reps), 0);
    }, 0);

    return {
      maxWeight,
      minWeight,
      avgWeight: avgWeight.toFixed(1),
      improvement: improvement.toFixed(1),
      improvementPercent: improvementPercent.toFixed(1),
      totalSessions: progressData.history.length,
      totalVolume: totalVolume.toFixed(0)
    };
  };

  const stats = getStats();

  if (exercises.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Progresso</h2>
        
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Nenhum dado de progresso disponível</p>
          <p className="text-sm text-gray-400">
            Complete alguns treinos para visualizar seu progresso
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Progresso</h2>

      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecione um exercício
        </label>
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="w-full px-3 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {exercises.map(exercise => (
            <option key={exercise} value={exercise}>
              {exercise}
            </option>
          ))}
        </select>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Carga Máxima</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.maxWeight} kg</p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Carga Média</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.avgWeight} kg</p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Evolução</p>
            <p className={`text-xl sm:text-2xl font-bold ${parseFloat(stats.improvement) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(stats.improvement) >= 0 ? '+' : ''}{stats.improvement} kg
            </p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Progresso %</p>
            <p className={`text-xl sm:text-2xl font-bold ${parseFloat(stats.improvementPercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(stats.improvementPercent) >= 0 ? '+' : ''}{stats.improvementPercent}%
            </p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Total de Treinos</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{stats.totalSessions}</p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Volume Total</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.totalVolume} kg</p>
          </div>
        </div>
      )}

      {progressData && progressData.history.length > 0 && (
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Evolução de Carga</h3>
          
          <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
            <div className="min-w-[300px]">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="Carga Máxima (kg)" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Carga Média (kg)" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {progressData && progressData.history.length > 0 && (
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Histórico Detalhado</h3>
          
          <div className="space-y-3">
            {progressData.history.slice().reverse().map((entry, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                  <p className="text-sm sm:text-base font-medium text-gray-800">
                    {new Date(entry.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {entry.sets.length} série(s)
                  </p>
                </div>
                <div className="space-y-1">
                  {entry.sets.map((set, setIndex) => (
                    <div key={set.id} className="text-xs sm:text-sm text-gray-600 flex justify-between gap-2">
                      <span>Série {setIndex + 1}</span>
                      <span className="font-medium whitespace-nowrap">
                        {set.reps} reps × {set.weight}kg = {(set.reps * set.weight).toFixed(1)}kg
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Volume Total:</span>
                    <span className="font-semibold">
                      {entry.sets.reduce((acc, s) => acc + (s.weight * s.reps), 0).toFixed(1)}kg
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}