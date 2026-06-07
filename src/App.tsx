import { Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from './layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/markets/:coinId" element={<Markets />} />
      </Route>
    </Routes>
  );
}

export default App;