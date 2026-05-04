# Plataforma de Agendamento de Salão — Frontend

Interface web da plataforma de agendamento de salão de beleza, desenvolvida em **Angular 19** com **Angular Material**. Permite que clientes agendem horários, visualizem seus agendamentos e que administradores gerenciem serviços e profissionais.

---

## Sumário

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como rodar](#como-rodar)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Rotas](#rotas)
- [Autenticação e autorização](#autenticação-e-autorização)
- [Comunicação com o backend](#comunicação-com-o-backend)
- [Design e estilo](#design-e-estilo)
- [Modelos de dados](#modelos-de-dados)

---

## Tecnologias

| Tecnologia | Versão |
|---|---|
| Angular | 19.0.0 |
| Angular Material | 19.0.0 |
| TypeScript | 5.6 |
| RxJS | 7.8.0 |
| Node.js | >= 18 |

---

## Pré-requisitos

- **Node.js** >= 18
- **npm** >= 9
- Backend da plataforma rodando em `http://localhost:8080` (veja o repositório `plataforma-agendamento-salao`)

---

## Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd plataforma-agendamento-salao-frontend

# Instale as dependências
npm install
```

---

## Como rodar

### Desenvolvimento

```bash
npm start
```

A aplicação estará disponível em **http://localhost:4200**.

O servidor de desenvolvimento já está configurado com proxy para o backend — todas as requisições para `/api/*` são redirecionadas para `http://localhost:8080`.

### Build de produção

```bash
ng build
```

Os arquivos gerados ficam em `dist/plataforma-agendamento-salao-frontend/`.

### Modo watch (build contínuo)

```bash
npm run watch
```

---

## Estrutura do projeto

```
src/
└── app/
    ├── core/                          # Lógica central da aplicação
    │   ├── guards/
    │   │   ├── auth.guard.ts          # Protege rotas autenticadas
    │   │   └── admin.guard.ts         # Protege rotas de administrador
    │   ├── interceptors/
    │   │   └── auth.interceptor.ts    # Injeta o token JWT em todas as requisições
    │   ├── models/
    │   │   ├── auth.models.ts         # Tipos de autenticação
    │   │   ├── booking.models.ts      # Tipos de agendamento
    │   │   ├── professional.models.ts # Tipos de profissional
    │   │   └── service.models.ts      # Tipos de serviço
    │   └── services/
    │       ├── auth.service.ts        # Autenticação e sessão do usuário
    │       ├── booking.service.ts     # Operações de agendamento
    │       ├── professional.service.ts# Gestão de profissionais
    │       └── service-offering.service.ts # Gestão de serviços do salão
    ├── features/                      # Módulos de funcionalidade
    │   ├── auth/
    │   │   ├── login/                 # Tela de login
    │   │   └── register/              # Tela de cadastro
    │   ├── booking/
    │   │   ├── new-booking/           # Formulário de novo agendamento
    │   │   └── my-bookings/           # Lista de agendamentos do usuário
    │   ├── dashboard/                 # Tela inicial pós-login
    │   └── admin/
    │       ├── services-admin/        # Gestão de serviços (admin)
    │       └── professionals-admin/   # Gestão de profissionais (admin)
    └── shared/
        └── components/
            └── navbar/                # Barra de navegação global
```

---

## Funcionalidades

### Para clientes

- **Cadastro e login** com e-mail e senha
- **Dashboard** com resumo dos próximos agendamentos e ações rápidas
- **Novo agendamento** via formulário em etapas:
  1. Escolha do serviço (nome, duração, preço)
  2. Escolha do profissional
  3. Seleção de data e horário (08h–19h, intervalos de 30 min)
  4. Observações opcionais
- **Meus agendamentos** com separação entre próximos e passados, status e ordenação por data

### Para administradores

- Todas as funcionalidades do cliente
- **Gestão de serviços**: listar, criar e ativar/desativar serviços do salão
- **Gestão de profissionais**: listar, cadastrar e ativar/desativar profissionais

---

## Rotas

| Rota | Componente | Acesso |
|---|---|---|
| `/login` | LoginComponent | Público |
| `/register` | RegisterComponent | Público |
| `/dashboard` | DashboardComponent | Autenticado |
| `/bookings/new` | NewBookingComponent | Autenticado |
| `/bookings/my` | MyBookingsComponent | Autenticado |
| `/admin/services` | ServicesAdminComponent | Admin |
| `/admin/professionals` | ProfessionalsAdminComponent | Admin |
| `/` | — | Redireciona conforme login |
| `**` | — | Redireciona para `/login` |

Todas as rotas de funcionalidade usam **lazy loading**.

---

## Autenticação e autorização

### Fluxo de autenticação

1. O usuário faz login ou se cadastra
2. O backend retorna um **token JWT**
3. O token é salvo no `localStorage` com a chave `salon_current_user`
4. O `authInterceptor` injeta automaticamente o token em todas as requisições HTTP no header `Authorization: Bearer <token>`

### Guards de rota

- **`authGuard`** — redireciona para `/login` se o usuário não estiver autenticado
- **`adminGuard`** — verifica autenticação e perfil `ADMIN`; redireciona não-admins para `/dashboard`

### Perfis de usuário

| Role | Descrição |
|---|---|
| `CUSTOMER` | Cliente comum |
| `ADMIN` | Administrador com acesso ao painel de gestão |
| `PROFESSIONAL` | Profissional do salão |

O estado de autenticação é gerenciado via **Angular Signals** no `AuthService`, com sinais computados `isLoggedIn` e `isAdmin`.

---

## Comunicação com o backend

### Proxy de desenvolvimento

O arquivo `proxy.conf.json` redireciona as chamadas de `/api/*` para o backend:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "pathRewrite": { "^/api": "" },
    "changeOrigin": true
  }
}
```

### Endpoints consumidos

| Serviço | Endpoint base |
|---|---|
| Autenticação | `/api/auth` |
| Agendamentos | `/api/bookings` |
| Profissionais | `/api/professionals` |
| Serviços do salão | `/api/services` |

---

## Design e estilo

### Tema

- **Material Design** com tema Azure Blue como base
- Paleta personalizada com tons de **rosa/vinho** como cor primária e **dourado** como destaque
- Fundo em rosa claro (#fdf6f9) com cards brancos

### Cores principais

| Nome | Valor |
|---|---|
| Primary | `#c2185b` |
| Primary Dark | `#880e4f` |
| Primary Light | `#f48fb1` |
| Accent | `#d4a017` |
| Background | `#fdf6f9` |

### Tipografia

- Fonte **Roboto** (Google Fonts)
- Ícones via **Material Icons**
- Locale configurado para **pt-BR** (datas e moeda em Real brasileiro)

### Responsividade

- Layout mobile-first com breakpoint em `600px`
- Grade de cards com `auto-fill` e largura mínima de `280px`
- Navbar e botões adaptados para telas pequenas

---

## Modelos de dados

### Autenticação

```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'CUSTOMER' | 'PROFESSIONAL';
  timezone: string;
}

interface AuthResponse {
  accessToken: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
}
```

### Agendamento

```typescript
interface CreateBookingRequest {
  professionalId: string;
  serviceId: string;
  startTime: string; // ISO 8601
  notes?: string;
}

interface BookingResponse {
  id: string;
  customerId: string;
  professionalId: string;
  serviceId: string;
  startTimeUtc: string;
  endTimeUtc: string;
  status: 'CREATED' | 'CONFIRMED' | 'CANCELLED';
  notes?: string;
}
```

### Serviço do salão

```typescript
interface ServiceOffering {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
}
```

### Profissional

```typescript
interface Professional {
  id: string;
  fullName: string;
  email: string;
  active: boolean;
}
```
