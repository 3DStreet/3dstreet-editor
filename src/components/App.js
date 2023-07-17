import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../contexts';

const MainPage = lazy(() => import('./Main'));

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
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export { App };
