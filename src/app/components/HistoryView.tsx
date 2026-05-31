import { useState, useEffect } from 'react';
import { Calendar, Clock, Trash2, Dumbbell, Timer } from 'lucide-react';
import { WorkoutSession } from '../types';
import { storage } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

export function HistoryView() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    if (user) loadSessions();
  }, [user]);

  const loadSessions = () => {
    const loaded = storage.getSessions(user?.id);
    loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSessions(loaded);
  };

  const handleDeleteSession = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro de treino?') && user) {
      storage.deleteSession(id, user.id);
      loadSessions();
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  const formatDateKey = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const groupedSessions = sessions.reduce<Record<string, WorkoutSession[]>>((acc, session) => {
    const key = formatDateKey(session.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(session);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Histórico</h2>
        {sessions.length > 0 && (
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {sessions.length} treino{sessions.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium mb-1">Nenhum treino registrado</p>
          <p className="text-gray-400 text-sm">Conclua um treino e ele aparecerá aqui</p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(groupedSessions).map(([dateKey, dateSessions]) => (
            <div key={dateKey}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-gray-600 capitalize">
                  {formatDate(dateSessions[0].date)}
                </h3>
              </div>

              <div className="space-y-3">
                {dateSessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Session Header */}
                    <div className="px-4 py-3 flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-gray-800 truncate">{session.workoutName}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTime(session.date)}
                          </span>
                          {session.duration && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Timer className="w-3.5 h-3.5" />
                              {session.duration} min
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-400 active:bg-red-100 touch-manipulation flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Exercises */}
                    <div className="border-t border-gray-100 px-4 py-3 space-y-2">
                      {session.exercises.map((exercise) => (
                        <div key={exercise.id}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Dumbbell className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            <span className="text-sm font-semibold text-gray-700">{exercise.name}</span>
                          </div>
                          <div className="pl-5 flex flex-wrap gap-1.5">
                            {exercise.sets.map((set, index) => (
                              <span key={set.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-lg">
                                {index + 1}ª: {set.reps}× {set.weight}kg
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {session.notes && (
                      <div className="border-t border-gray-100 px-4 py-2.5 bg-amber-50">
                        <p className="text-xs text-amber-700 italic">💭 {session.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
