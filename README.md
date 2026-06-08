# Projeto II — Plataforma de Gestão de Espaços Verdes Municipais

Plataforma web para uma Câmara Municipal gerir os espaços verdes urbanos: zonas, sensores IoT, tarefas de manutenção, alertas e denúncias submetidas pelos cidadãos — com um site público e um back office administrativo baseado em permissões.

## Funcionalidades

- **Espaços verdes e zonas** — catalogar parques e jardins, subdividi-los em zonas e associar imagens.
- **Sensores** — registar sensores IoT por espaço, recolher leituras (com unidades) e apresentá-las num dashboard e mapa.
- **Manutenção** — agendar e acompanhar tarefas de manutenção por espaço.
- **Alertas** — alertas operacionais derivados dos dados dos sensores e das tarefas.
- **Denúncias de cidadãos** — o público pode submeter denúncias sobre um espaço; os funcionários fazem a triagem.
- **Autenticação e permissões (RBAC)** — autenticação baseada em sessões com papéis e permissões granulares, e recuperação de password por email.
- **Site público + administrativo** — um único front end que serve o site público e o host administrativo em subdomínios separados.

## Arquitetura

Monorepo com duas aplicações:

| Aplicação | Stack |
|-----------|-------|
| [`server/`](server) | Express 5, Sequelize + MySQL, cache de sessões Dragonfly (compatível com Redis), armazenamento de objetos Hetzner (compatível com S3), email Resend, documentação OpenAPI/Swagger |
| [`web/`](web) | React 19 (React Compiler) com React Server Components via `@vitejs/plugin-rsc`, React Router 7, Tailwind CSS v4, Radix UI, React Leaflet (mapas), React DnD |

O runtime é o **[Bun](https://bun.sh)**. A infraestrutura local (MySQL + Dragonfly) corre via Docker Compose. Em produção corre como uma stack Docker Compose num único servidor, atrás do Caddy (HTTPS automático), em três subdomínios: site público, administrativo (`ADMIN_DOMAIN`) e API (`API_DOMAIN`).

## Pré-requisitos

- [Bun](https://bun.sh)
- Docker + Docker Compose
- JMeter (opcional, para testes de carga)

## Começar

```bash
# 1. Configurar o ambiente
cp .env.example .env        # depois editar os valores

# 2. Instalar dependências
cd server && bun install && cd ../web && bun install && cd ..

# 3. Arrancar infra, correr migrações e popular dados
make setup                  # = up + migrate + seed

# 4. Correr ambas as aplicações (server + web)
make dev
```

- Web (Vite): http://localhost:5173
- API: http://localhost:3000/api
- Documentação da API (Swagger): http://localhost:3000/docs

### Comandos Make úteis

| Comando | Faz |
|---------|-----|
| `make up` / `make down` | Arrancar / parar MySQL + Dragonfly locais (`down` também apaga `.data`) |
| `make reset` | Destruir e voltar a correr `setup` |
| `make migrate` | Correr as migrações da BD |
| `make seed` | Popular dados de desenvolvimento |
| `make seed-prod` | Migrar e correr o seed de produção (idempotente) |
| `make dev` | Correr server e web em conjunto |
| `make load-test` | Teste de carga JMeter à API (sobrepor `THREADS`, `LOOPS`, etc.) |

## Configuração

Copiar `.env.example` para `.env`. Grupos principais:

- **Server** — `PORT`
- **Base de dados** — `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
- **Cache** — `CACHE_HOST`, `CACHE_PORT` (Dragonfly; se não definido, a autenticação recorre só à BD)
- **Frontend** — `FRONTEND_URL`
- **Email** — `RESEND_API_KEY`, `RESEND_FROM`
- **Armazenamento de objetos** — `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`

Para produção, ver `.env.prod.example` (acrescenta `DOMAIN`, `ADMIN_DOMAIN`, `API_DOMAIN`, `ACME_EMAIL`).

## Base de dados

As migrações Sequelize estão em [`server/src/database/migrations`](server/src/database/migrations).

```bash
cd server
bun run db:migrate                              # aplicar
bun run db:migrate:undo                         # reverter a última
bun run db:create-migration <nome>              # gerar uma nova migração
```

## Testes

**Server** (Vitest; os testes de integração usam Testcontainers para MySQL):

```bash
cd server
bun run test              # testes unitários (exclui integração)
bun run test:integration  # testes de integração
bun run test:all          # tudo
bun run lint              # Biome
```

**Web** (Vitest + Testing Library; Playwright para E2E; Lighthouse CI):

```bash
cd web
bun run test              # testes unitários/de componentes
bun run test:e2e          # Playwright
bun run lighthouse        # Lighthouse CI
bun run lint              # ESLint
```

**Carga** — plano JMeter em [`load-tests/`](load-tests):

```bash
make load-test            # relatório → load-tests/report/index.html
```

O CI corre no GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)).

## Deployment

Produção é uma stack Docker Compose ([`docker-compose.prod.yml`](docker-compose.prod.yml)) — MySQL, Dragonfly, server, web e Caddy — construída e executada num único servidor Hetzner. As imagens do server e do web são publicadas no GHCR. As migrações correm no arranque do server.

```bash
cp .env.prod.example .env   # preencher os valores de produção
make prod                   # construir + arrancar a stack
make prod-logs              # seguir os logs
make prod-down              # parar
```
