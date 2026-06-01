import { ErrorPage } from "#/components/error-page"

export function ForbiddenPage() {
  return (
    <ErrorPage
      code="403"
      title="Acesso negado"
      description="Não tem permissões para aceder a este recurso. Contacte um administrador se acha que é um engano."
      actions={[
        { to: "/admin", label: "Voltar ao portal" },
        { to: "/", label: "Ir para o início", variant: "outline" },
      ]}
    />
  )
}
