import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { WorkoutList } from './components/WorkoutList';
import { WorkoutDetail } from './components/WorkoutDetail';
import { StartWorkout } from './components/StartWorkout';
import { HistoryView } from './components/HistoryView';
import { ProgressView } from './components/ProgressView';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/signup',
    Component: SignUp,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: WorkoutList },
      { path: 'workout/:id', Component: WorkoutDetail },
      { path: 'workout/:id/start', Component: StartWorkout },
      { path: 'history', Component: HistoryView },
      { path: 'progress', Component: ProgressView },
    ],
  },
]);
