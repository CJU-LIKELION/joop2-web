import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import CitizenMap from './pages/CitizenMap'
import DeptDashboard from './pages/DeptDashboard'
import Mileage from './pages/Mileage'

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<CitizenMap />} />
        <Route path="/dashboard" element={<DeptDashboard />} />
        <Route path="/mileage" element={<Mileage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}
