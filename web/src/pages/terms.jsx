import { Navbar } from "#/components/navbar"
import { Footer } from "#/components/footer"

export function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      <main className="flex-1 px-12 py-12 max-w-4xl mx-auto">
        <h1 className="font-landing text-3xl mb-8">Termos e Condições</h1>

        <div className="flex flex-col gap-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-semibold text-base mb-2">1. Aceitação dos Termos</h2>
            <p>Ao aceder e utilizar o Green Space, aceita estes Termos e Condições na integra. Se não concordar, não utilize a plataforma.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">2. Descrição do Serviço</h2>
            <p>O Green Space é uma plataforma de monitorização ambiental de espaços verdes. Fornece dados de sensores, alertas e ferramentas de gestão de manutenção.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">3. Contas de Utilizador</h2>
            <p>É responsável por manter a confidencialidade das suas credenciais. Todas as atividades realizadas com a sua conta são da sua responsabilidade.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">4. Uso Adequado</h2>
            <p>Não pode utilizar a plataforma para atividades ilegais, disruptivas ou que comprometam a segurança dos sistemas.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">5. Propriedade Intelectual</h2>
            <p>Todos os conteúdos, marcas e software do Green Space são propriedade dos respetivos titulares. Não é permitida cópia ou distribuição sem autorização.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">6. Limitação de Responsabilidade</h2>
            <p>A plataforma é fornecida "tal como está". Não garantimos disponibilidade ininterrupta ou ausência total de erros nos dados dos sensores.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">7. Alterações aos Termos</h2>
            <p>Podemos atualizar estes termos periodicamente. A continuação da utilização após alterações constitui aceitação.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">8. Contacto</h2>
            <p>Para questões sobre estes termos, contacte o administrador do sistema através do portal do município.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
