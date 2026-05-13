import { Routes, Route } from "react-router-dom"
import { LoginPage } from "#/pages/login"
import { RecuperarPage } from "#/pages/recuperar-password"
import { RedefinirPage } from "#/pages/redefinir-password"
import { DashboardLayout } from "#/components/dashboard-layout"
import { DashboardPage } from "#/pages/dashboard"
import { ManutencaoPage } from "#/pages/manutencao"
import { UtilizadoresPage } from "#/pages/utilizadores"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recuperar-password" element={<RecuperarPage />} />
      <Route path="/redefinir-password" element={<RedefinirPage />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/manutencao" element={<ManutencaoPage />} />
        <Route path="/dashboard/utilizadores" element={<UtilizadoresPage />} />
      </Route>
    </Routes>
  )
}

export default App
