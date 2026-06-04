'use client'

import { BrowserRouter, StaticRouter, Routes, Route } from "react-router-dom"
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
import { PermissoesPage } from "#/pages/permissoes"
import { PermissaoDetalhePage } from "#/pages/permissao-detalhe"
import { AlertasPage } from "#/pages/alertas"
import { SensoresPage } from "#/pages/sensores"
import { LandingPage } from "#/pages/landing-page"
import { SpacePage } from "#/pages/space-page"
import { TermsPage } from "#/pages/terms"
import { PrivacyPage } from "#/pages/privacy"
import { NotFoundPage } from "#/pages/not-found"
import { ForbiddenPage } from "#/pages/forbidden"
import { RequireAuth, RedirectIfAuth } from "#/components/auth-guards"
import { AuthProvider } from "#/hooks/use-auth"
import "#/styles.css"

const isBrowser = typeof window !== "undefined"

export default function App({ initialUser = null, initialUrl = "/" }) {
  const initialStatus = initialUser ? "authenticated" : null
  const Router = isBrowser ? BrowserRouter : StaticRouter
  const routerProps = isBrowser ? {} : { location: initialUrl }

  return (
    <Router {...routerProps}>
      <AuthProvider initialUser={initialUser} initialStatus={initialStatus}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/termos-utilizacao" element={<TermsPage />} />
          <Route path="/politica-privacidade" element={<PrivacyPage />} />
          <Route path="/space-public-page" element={<SpacePage />} />
          <Route path="/403" element={<ForbiddenPage />} />
          <Route element={<RedirectIfAuth />}>
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/recuperar-password" element={<RecuperarPage />} />
            <Route path="/admin/redefinir-password" element={<RedefinirPage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/manutencao" element={<ManutencaoPage />} />
              <Route path="/admin/utilizadores" element={<UtilizadoresPage />} />
              <Route path="/admin/utilizadores/:id" element={<UtilizadorPage />} />
              <Route path="/admin/conta" element={<ContaPage />} />
              <Route path="/admin/relatorios" element={<RelatoriosPage />} />
              <Route path="/admin/espacos" element={<EspacosPage />} />
              <Route path="/admin/espacos/:id/:tab?" element={<EspacoDetalhePage />} />
              <Route path="/admin/roles" element={<PermissoesPage />} />
              <Route path="/admin/roles/:id" element={<PermissaoDetalhePage />} />
              <Route path="/admin/alertas" element={<AlertasPage />} />
              <Route path="/admin/sensores" element={<SensoresPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
