import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../contexts';
import { ProtectedRoute } from './components/ProtectedRoute';

const MainPage = lazy(() => import('./Main'));
const ProfilePage = lazy(() => import('../pages/Profile.page'));

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense>
              <MainPage />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense>
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export { App };
