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
import { EspacoDetalhePage } from "#/pages/espaco-detalhe"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recuperar-password" element={<RecuperarPage />} />
      <Route path="/redefinir-password" element={<RedefinirPage />} />
      <Route element={<DashboardLayout />}>
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/manutencao" element={<ManutencaoPage />} />
        <Route path="/admin/utilizadores" element={<UtilizadoresPage />} />
        <Route path="/admin/utilizadores/:id" element={<UtilizadorPage />} />
        <Route path="/admin/conta" element={<ContaPage />} />
        <Route path="/admin/relatorios" element={<RelatoriosPage />} />
        <Route path="/admin/espacos" element={<EspacosPage />} />
        <Route path="/admin/espacos/:id" element={<EspacoDetalhePage />} />
      </Route>
    </Routes>
  )
}

export default App
