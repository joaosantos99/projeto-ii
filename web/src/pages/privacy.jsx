import { Navbar } from "#/components/navbar"
import { Footer } from "#/components/footer"

export function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Navbar />
      <main className="flex-1 px-12 py-12 max-w-4xl mx-auto">
        <h1 className="font-landing text-3xl mb-8">Política de Privacidade</h1>

        <div className="flex flex-col gap-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-semibold text-base mb-2">1. Dados Recolhidos</h2>
            <p>Recolhemos nome, email e função necessários à gestão de acesso. Dados de sensores ambientais são processados para monitorização dos espaços verdes.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">2. Finalidade do Tratamento</h2>
            <p>Os dados servem para autenticação, gestão de utilizadores, envio de alertas e geração de relatórios de monitorização ambiental.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">3. Base Legal</h2>
            <p>O tratamento baseia-se no interesse público da gestão ambiental municipal e na execução do serviço prestado às entidades aderentes.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">4. Conservação</h2>
            <p>Conservamos os dados apenas pelo tempo necessário às finalidades declaradas ou por imposição legal.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">5. Partilha</h2>
            <p>Não vendemos dados. Partilha limita-se a prestadores de serviço essenciais e obrigações legais.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">6. Segurança</h2>
            <p>Aplicamos medidas técnicas e organizativas para proteger dados contra acesso não autorizado, alteração ou destruição.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">7. Direitos do Titular</h2>
            <p>Tem direito a aceder, retificar, apagar, limitar ou opor-se ao tratamento. Contacte o administrador do sistema para exercer esses direitos.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">8. Cookies e Tecnologias</h2>
            <p>Utilizamos cookies essenciais para autenticação e segurança da sessão. Não utilizamos cookies de rastreamento de terceiros.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">9. Alterações</h2>
            <p>Podemos atualizar esta política. A versão em vigor está sempre disponível nesta página.</p>
          </section>

          <section>
            <h2 className="font-semibold text-base mb-2">10. Contacto</h2>
            <p>Para questões de privacidade, contacte o administrador do sistema através do portal do município.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
