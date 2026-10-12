# Deploy de Produção (M15)

Runbook para publicar o PipeFlow CRM em produção.

**Decisões para este go-live** (primeira publicação, validando o fluxo completo antes de abrir cobrança real):
- **Domínio:** subdomínio gratuito `*.vercel.app` do projeto já existente na Vercel — sem domínio próprio por enquanto. Revisitar a seção 3 quando um domínio for comprado.
- **Stripe:** permanece em modo **sandbox/test** (mesma conta `pipeflow-crm` já autenticada no Stripe CLI deste ambiente) — sem cobranças reais ainda. Revisitar a seção 4 quando o time decidir abrir cobrança real (trocar chaves `sk_live_`/`pk_live_`, recriar o produto/preço Pro em Live e registrar um novo webhook em Live mode).
- **Projeto Vercel:** já existe, conectado ao repo `atalopereira/PipeFlow-CRM` no GitHub — falta apenas configurar as env vars de produção nele.

A aplicação já lê toda configuração de ambiente — nenhuma URL de `localhost` está hardcoded no código (confirmado via grep). Isso significa que o go-live é, na prática, um checklist de configuração + verificação, não uma mudança de código.

## 1. Projeto Supabase de produção

1. Criar um projeto novo no [dashboard do Supabase](https://supabase.com/dashboard) dedicado a produção (separado do projeto usado em dev/staging).
2. Aplicar o schema: `npx supabase link --project-ref <ref-do-projeto-prod>` e depois `npx supabase db push`, ou rodar manualmente, em ordem, os arquivos de `supabase/migrations/` via SQL Editor.
3. Aplicar as policies de `supabase/policies/*.sql` (se ainda não estiverem embutidas nas migrations).
4. Confirmar RLS: toda tabela de dados de workspace precisa ter `ENABLE ROW LEVEL SECURITY` + `FORCE ROW LEVEL SECURITY` — já é o caso hoje (`profiles`, `workspaces`, `workspace_members`, `leads`, `deals`, `activities`, `subscriptions`, `workspace_invites`). Antes de ir pra produção, rode novamente: `grep -rn "enable row level security" supabase/migrations/`.
5. Copiar do dashboard: Project URL, `anon` key e `service_role` key — vão para `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`.
6. Em **Authentication → URL Configuration**, configurar o Site URL e Redirect URLs com a URL `*.vercel.app` do projeto — necessário para o link de confirmação de e-mail do signup funcionar.

## 2. Variáveis de ambiente na Vercel

O projeto já existe na Vercel (importado do GitHub). Configurar em **Settings → Environment Variables** (ambiente **Production**):

| Variável | Valor em produção |
|---|---|
| `NEXT_PUBLIC_APP_URL` | URL de produção do projeto, ex. `https://pipeflow-crm.vercel.app` (sem barra no final) |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL do Supabase de produção |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key do Supabase de produção |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key do Supabase de produção (nunca expor ao client) |
| `STRIPE_SECRET_KEY` | secret key **Test** da conta `pipeflow-crm` (`sk_test_...`) — mesma conta já usada em dev, mantendo sandbox mode |
| `STRIPE_WEBHOOK_SECRET` | signing secret do endpoint de produção criado na seção 4 (`whsec_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | publishable key **Test** (`pk_test_...`) |
| `STRIPE_PRO_PRICE_ID` | Price ID (`price_...`) do plano Pro em modo Test |
| `RESEND_API_KEY` | API key de produção da Resend |
| `RESEND_FROM_EMAIL` | endereço verificado (ou o sandbox padrão da Resend, que só entrega para o e-mail verificado da conta, enquanto não houver domínio próprio) |

Lista de referência local: [.env.local.example](../.env.local.example).

Redeploy após qualquer mudança de env var — a Vercel não aplica env vars novas a um build já existente.

## 3. Domínio (adiado — usando `*.vercel.app` por agora)

Quando um domínio próprio for comprado:

1. Em **Vercel → Settings → Domains**, adicionar o domínio e seguir a verificação (CNAME/A record no DNS).
2. Atualizar `NEXT_PUBLIC_APP_URL` na Vercel para o domínio final (usado em redirect de confirmação de e-mail, links de convite e URLs de retorno do Stripe Checkout/Portal — ver `lib/actions/auth.ts`, `lib/resend.ts` e `lib/actions/billing.ts`) e em **Authentication → URL Configuration** no Supabase.
3. Recriar o webhook da Stripe (seção 4) apontando para o novo domínio.
4. Redeploy.

## 4. Webhook da Stripe (sandbox/test mode)

O endpoint já implementado é idempotente (`upsert` por `workspace_id`) e valida a assinatura antes de processar — ver [app/api/webhooks/stripe/route.ts](../app/api/webhooks/stripe/route.ts). Falta só registrá-lo apontando para a URL de produção:

1. No [dashboard da Stripe](https://dashboard.stripe.com/test/webhooks), com **Test mode** ativo, criar um endpoint apontando para `https://<projeto>.vercel.app/api/webhooks/stripe`.
2. Eventos a assinar (os mesmos tratados no handler): `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`.
3. Copiar o **Signing secret** gerado e colocar em `STRIPE_WEBHOOK_SECRET` na Vercel (Production).
4. Alternativa via CLI, já autenticada neste ambiente em modo sandbox (`stripe config --list` mostra a conta `pipeflow-crm`):
   ```bash
   stripe webhook_endpoints create \
     --url https://<projeto>.vercel.app/api/webhooks/stripe \
     --enabled-events checkout.session.completed,customer.subscription.deleted,invoice.payment_failed
   ```

> Quando o time decidir abrir cobrança real: alternar para **Live mode** na Stripe, recriar o produto/preço Pro em Live (produtos/preços de Test e Live são entidades separadas), trocar as chaves na Vercel para `sk_live_`/`pk_live_` e repetir este passo para registrar o webhook em Live mode.

## 5. Checklist final (fluxo completo em produção)

Testar direto na URL `*.vercel.app` de produção, não em preview local:

- [ ] **Signup**: criar conta nova → e-mail de confirmação chega e o link redireciona para a URL de produção (não localhost)
- [ ] **Workspace**: onboarding cria o workspace inicial
- [ ] **Lead**: criar, editar e excluir um lead; busca e filtro funcionando
- [ ] **Pipeline**: criar negócio, arrastar entre colunas, persistência confirmada após reload
- [ ] **Atividades**: registrar atividade na timeline do lead
- [ ] **Convite**: convidar um segundo usuário por e-mail, aceitar o convite, confirmar papel (Admin/Membro) e troca de workspace
- [ ] **Billing**: upgrade Free → Pro via Checkout (cartão de teste da Stripe — modo sandbox), webhook atualiza o plano do workspace, Customer Portal abre corretamente
- [ ] **Limites do Free**: confirmar que um workspace novo (ainda Free) bloqueia no limite de 2 colaboradores / 50 leads
- [ ] Logs da Vercel (Functions) sem erros durante o teste
- [ ] Logs do webhook na Stripe (dashboard → Webhooks → endpoint) mostram `200` para os eventos disparados

## Checagens locais já validadas nesta branch

- `npm run typecheck` — sem erros
- `npm run lint` — sem erros
- `npm run build` — build de produção completa com sucesso
- RLS habilitada em todas as tabelas de dados de workspace (`supabase/migrations/`)
- Nenhuma URL `localhost` hardcoded em código de aplicação (`app/`, `lib/`, `components/`)
