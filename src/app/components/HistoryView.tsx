import { useState, useEffect } from 'react';
import { Calendar, Clock, Trash2, Dumbbell } from 'lucide-react';
import { WorkoutSession } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

export function HistoryView() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = () => {
    const loadedSessions = storage.getSessions(user?.id);
    // Ordenar por data decrescente (mais recentes primeiro)
    loadedSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSessions(loadedSessions);
  };

  const handleDeleteSession = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro de treino?') && user) {
      storage.deleteSession(id, user.id);
      loadSessions();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupSessionsByDate = () => {
    const grouped: { [key: string]: WorkoutSession[] } = {};
    
    sessions.forEach(session => {
      const dateKey = formatDate(session.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(session);
    });

    return grouped;
  };

  const groupedSessions = groupSessionsByDate();

  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Histórico de Treinos</h2>

      {sessions.length === 0 ? (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
          <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2 text-sm sm:text-base">Nenhum treino registrado ainda</p>
          <p className="text-xs sm:text-sm text-gray-400">
            Comece um treino e ele aparecerá aqui após a conclusão
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {Object.entries(groupedSessions).map(([date, dateSessions]) => (
            <div key={date}>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                {date}
              </h3>
              
              <div className="space-y-3">
                {dateSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                          {session.workoutName}
                        </h4>
                        <div className="flex items-center gap-3 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            {formatTime(session.date)}
                          </span>
                          {session.duration && (
                            <span className="flex items-center gap-1">
                              <Dumbbell className="w-3 h-3 sm:w-4 sm:h-4" />
                              {session.duration} min
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0 ml-2"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Exercícios realizados:
                      </p>
                      <div className="space-y-2">
                        {session.exercises.map((exercise) => (
                          <div key={exercise.id} className="text-xs sm:text-sm">
                            <div className="font-medium text-gray-700 mb-1">• {exercise.name}</div>
                            <div className="ml-3 sm:ml-4 space-y-0.5">
                              {exercise.sets.map((set, index) => (
                                <div key={set.id} className="text-gray-600">
                                  Série {index + 1}: {set.reps} reps × {set.weight}kg
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {session.notes && (
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <p className="text-xs sm:text-sm text-gray-500 italic">
                          💭 {session.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {sessions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-3 sm:p-4 rounded-lg text-center">
          <p className="text-xs sm:text-sm text-blue-800">
            📊 Total de treinos registrados: <strong>{sessions.length}</strong>
          </p>
        </div>
      )}
    </div>
  );
}