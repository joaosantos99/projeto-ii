import { ErrorPage } from "#/components/error-page"

export function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      title="Página não encontrada"
      description="A página que procura não existe ou foi movida."
      actions={[
        { to: "/", label: "Voltar ao início" },
        { to: "/admin", label: "Ir para o portal", variant: "outline" },
      ]}
    />
  )
}
