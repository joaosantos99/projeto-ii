import { Routes, Route } from "react-router-dom"
import { LoginPage } from "#/pages/login"
import { RecuperarPage } from "#/pages/recuperar-password"
import { RedefinirPage } from "#/pages/redefinir-password"
import { DashboardLayout } from "#/components/dashboard-layout"
import { DashboardPage } from "#/pages/dashboard"
import { ManutencaoPage } from "#/pages/manutencao"
import { UtilizadoresPage } from "#/pages/utilizadores"
import { UtilizadorPage } from "#/pages/utilizador"
import { ContaPage } from "#/pages/conta"
import { RelatoriosPage } from "#/pages/relatorios"
import { EspacosPage } from "#/pages/espacos"

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
        <Route path="/dashboard/utilizadores/:id" element={<UtilizadorPage />} />
        <Route path="/dashboard/conta" element={<ContaPage />} />
        <Route path="/dashboard/relatorios" element={<RelatoriosPage />} />
        <Route path="/dashboard/espacos" element={<EspacosPage />} />
      </Route>
    </Routes>
  )
}

export default App
