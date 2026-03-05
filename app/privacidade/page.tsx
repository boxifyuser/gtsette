import type { Metadata } from "next"
import Link from "next/link"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gtsette.com.br"

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de Privacidade da GTSETTE Soluções Financeiras, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).",
  openGraph: {
    title: "Política de Privacidade - GTSETTE Soluções Financeiras",
    description: "Conheça como tratamos seus dados pessoais em conformidade com a LGPD.",
    url: `${siteUrl}/privacidade`,
  },
}

export default function PrivacidadePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="bg-background px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">Documento legal</span>
          </div>

          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Política de Privacidade</h1>
          <p className="mb-8 text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-muted-foreground">
            <p className="text-base leading-relaxed">
              A GTSETTE Soluções Financeiras (&quot;GTSETTE&quot;, &quot;nós&quot; ou &quot;nosso&quot;) está comprometida com a proteção dos seus
              dados pessoais. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos
              suas informações, em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018)</strong> e
              demais normas aplicáveis.
            </p>

            <section>
              <h2 className="mb-3 text-xl font-bold text-foreground">1. Controlador e Encarregado</h2>
              <p className="leading-relaxed">
                O <strong>controlador</strong> dos dados pessoais é a GTSETTE Soluções Financeiras. Para exercer seus
                direitos ou esclarecer dúvidas sobre o tratamento de dados, entre em contato:{" "}
                <a href="mailto:contato@gtsette.com.br" className="text-primary underline hover:no-underline">
                  contato@gtsette.com.br
                </a>
                , telefone (31) 98250-6478, ou endereço Av. Augusto de Lima, 407 – Loja 11, Lourdes – Belo Horizonte/MG.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-foreground">2. Dados Pessoais que Coletamos</h2>
              <p className="mb-2 leading-relaxed">Podemos coletar, conforme o uso dos nossos serviços e do site:</p>
              <ul className="list-inside list-disc space-y-1 pl-2">
                <li><strong>Identificação:</strong> nome completo, CPF, CNPJ (quando aplicável), data de nascimento</li>
                <li><strong>Contato:</strong> e-mail, telefone, endereço</li>
                <li><strong>Cadastro e acesso:</strong> usuário e senha (armazenados de forma segura), dados de uso da área logada</li>
                <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas, cookies (conforme seção 7)</li>
                <li><strong>Dados relacionados ao processo:</strong> informações sobre seu processo de limpeza de nome ou recuperação de crédito, quando você nos envia ou quando obtemos com seu consentimento para fins de prestação do serviço</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-foreground">3. Finalidades e Base Legal (art. 7º LGPD)</h2>
              <p className="mb-2 leading-relaxed">Utilizamos seus dados para:</p>
              <ul className="list-inside list-disc space-y-1 pl-2">
                <li>Prestação de serviços de limpeza de nome, negociação de dívidas e recuperação de crédito</li>
                <li>Cadastro, autenticação e acesso à área do cliente (&quot;Minha Conta&quot;)</li>
                <li>Comunicação com você (respostas, atualizações de processo, envio de informações)</li>
                <li>Cumprimento de obrigações legais e regulatórias</li>
                <li>Melhoria do site, segurança e experiência do usuário</li>
                <li>Proteção ao crédito e análise de elegibilidade, quando aplicável</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                As bases legais para o tratamento incluem: <strong>consentimento</strong> (quando você aceita esta política ou
                termos específicos), <strong>execução de contrato</strong>, <strong>legítimo interesse</strong> e <strong>cumprimento de obrigação legal</strong>.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-foreground">4. Compartilhamento de Dados</h2>
              <p className="leading-relaxed">
                Seus dados podem ser compartilhados apenas quando necessário com: parceiros operacionais (por exemplo,
                plataformas de gestão de leads e atendimento), prestadores de serviços de tecnologia (hospedagem,
                e-mail, banco de dados), autoridades públicas quando exigido por lei, e demais destinatários previstos em
                lei. Não vendemos seus dados pessoais. Exigimos que parceiros e operadores de tratamento também
                respeitem a LGPD e medidas de segurança.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-foreground">5. Armazenamento e Segurança</h2>
              <p className="leading-relaxed">
                Mantemos seus dados pelo tempo necessário às finalidades descritas, inclusive para cumprimento de
                obrigações legais e exercício de direitos. Adotamos medidas técnicas e organizacionais para proteger
                seus dados contra acesso não autorizado, perda, alteração ou destruição (incluindo criptografia,
                controle de acesso e ambientes seguros).
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-foreground">6. Seus Direitos (art. 18 LGPD)</h2>
              <p className="mb-2 leading-relaxed">Você tem direito a:</p>
              <ul className="list-inside list-disc space-y-1 pl-2">
                <li>Confirmação da existência de tratamento e acesso aos dados</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade</li>
                <li>Portabilidade dos dados a outro fornecedor de serviço</li>
                <li>Informação sobre com quem compartilhamos seus dados</li>
                <li>Revogação do consentimento (quando o tratamento tiver como base o consentimento)</li>
                <li>Oposição a tratamentos realizados com base em alguma das hipóteses de dispensa de consentimento</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                Para exercer esses direitos, entre em contato pelo e-mail{" "}
                <a href="mailto:contato@gtsette.com.br" className="text-primary underline hover:no-underline">
                  contato@gtsette.com.br
                </a>
                . Responderemos em prazo razoável, nos termos da LGPD. Você também pode apresentar reclamação perante a
                Autoridade Nacional de Proteção de Dados (ANPD).
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-foreground">7. Cookies e Tecnologias Similares</h2>
              <p className="leading-relaxed">
                Utilizamos cookies e tecnologias semelhantes para funcionamento do site (por exemplo, sessão de login,
                preferências) e, quando aplicável, para análise de uso. Você pode configurar seu navegador para recusar
                ou limitar cookies; parte das funcionalidades do site pode ficar limitada.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-foreground">8. Consentimento LGPD no Cadastro</h2>
              <p className="leading-relaxed">
                Na área &quot;Minha Conta&quot;, ao completar seu cadastro com nome, CPF, e-mail e CNPJ (opcional), solicitamos que
                você aceite expressamente o consentimento para tratamento dos seus dados pessoais em conformidade com a
                LGPD. O aceite é registrado com data e hora, para fins de comprovação e transparência.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-foreground">9. Alterações nesta Política</h2>
              <p className="leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. A data da última atualização consta no
                topo desta página. Alterações relevantes serão comunicadas por meio do site ou canais de contato. O uso
                continuado dos nossos serviços após a divulgação das alterações pode constituir aceitação da nova versão.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-foreground">10. Contato</h2>
              <p className="leading-relaxed">
                Dúvidas sobre esta Política de Privacidade ou sobre o tratamento dos seus dados pessoais:{" "}
                <a href="mailto:contato@gtsette.com.br" className="text-primary underline hover:no-underline">
                  contato@gtsette.com.br
                </a>
                , telefone (31) 98250-6478, ou nosso endereço em Belo Horizonte/MG.
              </p>
            </section>
          </div>

          <div className="mt-12 border-t pt-8">
            <Link
              href="/"
              className="text-primary underline underline-offset-2 hover:no-underline"
            >
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
