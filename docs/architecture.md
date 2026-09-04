# Architecture

This document explains SoroSim's architecture, component interactions, and data flow.

## System Overview

SoroSim is a distributed system with four main components:

```
┌─────────────────────────────────────────────────────────────┐
│                        SoroSim Ecosystem                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │
│  │   Browser    │   │      CLI     │   │  External    │   │
│  │      UI      │   │     Tool     │   │  Integrations│   │
│  │  (React/TS)  │   │  (Node.js)   │   │   (CI/CD)    │   │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   │
│         │                   │                   │            │
│         └───────────────────┼───────────────────┘            │
│                             │                                │
│                    ┌────────▼────────┐                      │
│                    │   REST API      │                      │
│                    │   (Express)     │                      │
│                    └────────┬────────┘                      │
│                             │                                │
│         ┌───────────────────┼───────────────────┐           │
│         │                   │                   │            │
│  ┌──────▼───────┐  ┌───────▼────────┐  ┌──────▼───────┐   │
│  │  Simulation  │  │   Session      │  │   Ledger     │   │
│  │   Engine     │  │   Manager      │  │   Manager    │   │
│  │   (Rust)     │  │  (Node.js)     │  │  (Node.js)   │   │
│  └──────────────┘  └────────┬───────┘  └──────────────┘   │
│                              │                               │
│                     ┌────────▼────────┐                     │
│                     │   PostgreSQL    │                     │
│                     │   + Redis       │                     │
│                     └─────────────────┘                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend (sorosim-frontend)

**Technology:** React 18 + TypeScript + Vite

**Responsibilities:**
- User interface for contract simulation
- WASM file upload and validation
- Mock ledger configuration UI
- State diff visualization
- Session management

**Key Modules:**

```
sorosim-frontend/
├── components/
│   ├── ContractUpload/      # WASM upload and parsing
│   ├── FunctionInvoker/     # Function selection and args input
│   ├── LedgerConfig/        # Mock ledger configuration
│   ├── StateDiff/           # State change visualization
│   ├── AuthPanel/           # Authorization configuration
│   └── SessionManager/      # Save/load sessions
├── pages/
│   ├── Simulate/            # Main simulation page
│   ├── Sessions/            # Session history
│   └── Docs/                # In-app documentation
├── hooks/
│   ├── useSimulation/       # Simulation state management
│   ├── useContract/         # Contract management
│   └── useLedger/           # Ledger state management
└── api/
    └── client.ts            # API client wrapper
```

**Data Flow:**

```
User Action
    ↓
React Component
    ↓
Custom Hook (State Management)
    ↓
API Client
    ↓
REST API
    ↓
Response
    ↓
State Update
    ↓
UI Re-render
```

---

### Backend (sorosim-backend)

**Technology:** Node.js (Express) + Rust (simulation core)

**Responsibilities:**
- REST API endpoints
- Request validation
- Simulation orchestration
- Session persistence
- Rate limiting and caching

**Key Modules:**

```
sorosim-backend/
├── api/
│   ├── routes/
│   │   ├── simulate.ts      # POST /simulate
│   │   ├── contracts.ts     # Contract management
│   │   ├── sessions.ts      # Session CRUD
│   │   └── health.ts        # Health checks
│   └── middleware/
│       ├── validation.ts    # Request validation
│       ├── rateLimit.ts     # Rate limiting
│       └── errorHandler.ts  # Error handling
├── services/
│   ├── SimulationService/   # Orchestrates simulations
│   ├── ContractService/     # Contract management
│   ├── SessionService/      # Session persistence
│   └── CacheService/        # Redis caching
├── models/
│   ├── Contract.ts          # Contract model
│   ├── Session.ts           # Session model
│   └── Simulation.ts        # Simulation result model
└── simulator-core/          # Rust simulation engine
    ├── vm/                  # WASM VM integration
    ├── ledger/              # Ledger simulation
    ├── diff/                # State diff computation
    └── auth/                # Authorization handling
```

**API Layer (Node.js):**
- Handles HTTP requests
- Validates input
- Manages sessions in PostgreSQL
- Caches results in Redis
- Delegates simulation to Rust core

**Simulation Core (Rust):**
- WASM execution
- Ledger state management
- State diff computation
- Footprint analysis
- ScVal serialization/deserialization

---

### CLI (sorosim-cli)

**Technology:** Node.js + Commander.js

**Responsibilities:**
- Command-line interface
- Local WASM file handling
- API client for backend
- Output formatting (text, JSON, YAML)
- Session snapshot management

**Key Modules:**

```
sorosim-cli/
├── commands/
│   ├── simulate.ts          # Simulate command
│   ├── init.ts              # Init command
│   ├── inspect.ts           # Inspect command
│   ├── validate.ts          # Validate command
│   └── sessions.ts          # Session management
├── lib/
│   ├── api-client.ts        # Backend API client
│   ├── wasm-parser.ts       # WASM file parsing
│   ├── formatter.ts         # Output formatting
│   └── config.ts            # Config file handling
└── index.ts                 # CLI entry point
```

---

### Sample Contracts (sorosim-contracts)

**Technology:** Rust + Soroban SDK

**Responsibilities:**
- Pre-built example contracts
- Testing utilities
- Documentation examples

---

## Data Flow

### Simulation Request Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Upload WASM + Configure Ledger
     ▼
┌─────────────┐
│  Frontend   │
└────┬────────┘
     │ 2. POST /v1/simulate
     │    {wasm, function, args, ledger, auth}
     ▼
┌─────────────┐
│  REST API   │
│  (Express)  │
└────┬────────┘
     │ 3. Validate request
     │ 4. Check cache (Redis)
     ▼
┌─────────────┐
│ Simulation  │
│  Service    │
└────┬────────┘
     │ 5. Prepare simulation context
     │    - Parse WASM
     │    - Setup ledger state
     │    - Configure auth
     ▼
┌─────────────┐
│ Rust Core   │
│ (WASM VM)   │
└────┬────────┘
     │ 6. Execute contract
     │    - Invoke function
     │    - Track state changes
     │    - Compute footprint
     │    - Measure metrics
     ▼
┌─────────────┐
│ Rust Core   │
│ (Diff)      │
└────┬────────┘
     │ 7. Compute state diff
     │    - Compare before/after
     │    - Categorize changes
     │    - Analyze footprint
     ▼
┌─────────────┐
│  REST API   │
└────┬────────┘
     │ 8. Format response
     │ 9. Cache result (Redis)
     │ 10. Return JSON
     ▼
┌─────────────┐
│  Frontend   │
└────┬────────┘
     │ 11. Parse response
     │ 12. Update UI
     │     - Display result
     │     - Show state diff
     │     - Render metrics
     ▼
┌─────────┐
│  User   │
└─────────┘
```

---

## Detailed Component Interactions

### 1. Contract Upload

```
Frontend                API                 Storage
   │                    │                     │
   │ POST /contracts    │                     │
   │ {wasm, name}      │                     │
   ├──────────────────>│                     │
   │                    │ Validate WASM      │
   │                    │ Parse metadata     │
   │                    │ Generate hash      │
   │                    │                     │
   │                    │ Store contract     │
   │                    ├────────────────────>│
   │                    │                     │
   │                    │<────────────────────┤
   │                    │ Contract ID         │
   │                    │                     │
   │<──────────────────┤                     │
   │ {contractId,       │                     │
   │  functions, ...}   │                     │
```

### 2. Simulation Execution

```
API                Rust Core           Ledger State
 │                    │                      │
 │ simulate()         │                      │
 ├───────────────────>│                      │
 │                    │ Load WASM           │
 │                    │ Initialize VM       │
 │                    │                      │
 │                    │ Load ledger state   │
 │                    ├─────────────────────>│
 │                    │<─────────────────────┤
 │                    │ Initial state        │
 │                    │                      │
 │                    │ Execute function    │
 │                    │ (read/write ops)    │
 │                    │<────────────────────>│
 │                    │ State modifications │
 │                    │                      │
 │                    │ Capture final state │
 │                    ├─────────────────────>│
 │                    │<─────────────────────┤
 │                    │                      │
 │                    │ Compute diff        │
 │                    │ Calculate footprint │
 │                    │                      │
 │<───────────────────┤                      │
 │ {result, diff,     │                      │
 │  footprint, ...}   │                      │
```

### 3. State Diff Computation

```
Before State         Diff Engine         After State
     │                   │                    │
     │ Read entries      │                    │
     ├──────────────────>│                    │
     │                   │                    │
     │                   │ Read entries       │
     │                   │<───────────────────┤
     │                   │                    │
     │                   │ Compare:           │
     │                   │ - Detect Added     │
     │                   │ - Detect Modified  │
     │                   │ - Detect Deleted   │
     │                   │ - Mark Unchanged   │
     │                   │                    │
     │                   │ Categorize:        │
     │                   │ - Read-only        │
     │                   │ - Read-write       │
     │                   │                    │
     │                   │ Output diff        │
     │<──────────────────┤                    │
     │ StateChanges[]    │                    │
```

---

## Storage Architecture

### PostgreSQL Schema

**Contracts Table:**
```sql
CREATE TABLE contracts (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    wasm_hash VARCHAR(64) UNIQUE,
    wasm_blob BYTEA,
    size INTEGER,
    sdk_version VARCHAR(20),
    functions JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_contracts_hash ON contracts(wasm_hash);
```

**Sessions Table:**
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    contract_id UUID REFERENCES contracts(id),
    ledger_config JSONB,
    auth_config JSONB,
    created_at TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_sessions_contract ON sessions(contract_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
```

**Invocations Table:**
```sql
CREATE TABLE invocations (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES sessions(id),
    function_name VARCHAR(100),
    args JSONB,
    result JSONB,
    state_changes JSONB,
    metrics JSONB,
    success BOOLEAN,
    created_at TIMESTAMP
);

CREATE INDEX idx_invocations_session ON invocations(session_id);
```

### Redis Caching

**Cache Keys:**
```
simulation:{wasm_hash}:{function}:{args_hash} → SimulationResult (TTL: 1 hour)
contract:{contract_id} → ContractMetadata (TTL: 24 hours)
session:{session_id} → SessionData (TTL: 12 hours)
```

**Cache Strategy:**
- Cache simulation results for identical requests
- Invalidate on contract update
- Use LRU eviction policy

---

## Security Architecture

### Input Validation

```
Request
   ↓
Schema Validation (Joi/Zod)
   ↓
WASM Validation
   ↓
Size Limits Check
   ↓
Rate Limiting
   ↓
Process Request
```

### Sandboxing

**WASM Execution:**
- Isolated WASM VM
- Memory limits enforced
- CPU instruction limits
- No network access
- No file system access

**Resource Limits:**
```rust
const MAX_MEMORY: usize = 100 * 1024 * 1024; // 100 MB
const MAX_CPU_INSTRUCTIONS: u64 = 10_000_000; // 10M instructions
const MAX_EXECUTION_TIME: Duration = Duration::from_secs(30);
```

---

## Performance Optimizations

### Frontend

1. **Code Splitting:** Lazy load components
2. **Memoization:** Cache expensive computations
3. **Virtual Scrolling:** For large state diffs
4. **Web Workers:** WASM parsing in background

### Backend

1. **Redis Caching:** Cache simulation results
2. **Connection Pooling:** PostgreSQL connection pool
3. **Async Processing:** Non-blocking I/O
4. **WASM Compilation Cache:** Reuse compiled modules

### Rust Core

1. **Zero-Copy Parsing:** Minimize allocations
2. **Parallel Diff Computation:** Multi-threaded state comparison
3. **Memory Pooling:** Reuse allocations
4. **Incremental State Tracking:** Track changes during execution

---

## Scalability

### Horizontal Scaling

```
         Load Balancer
              │
    ┌─────────┼─────────┐
    │         │         │
  API 1     API 2     API 3
    │         │         │
    └─────────┼─────────┘
              │
      ┌───────┴───────┐
      │               │
  PostgreSQL       Redis
  (Primary)      (Cluster)
      │
  PostgreSQL
  (Replica)
```

**Scaling Strategy:**
- Stateless API nodes (scale horizontally)
- Read replicas for PostgreSQL
- Redis cluster for distributed caching
- CDN for frontend assets

---

## Monitoring & Observability

### Metrics Collected

**Application Metrics:**
- Simulation requests per second
- Average simulation time
- Cache hit rate
- Error rate by type
- API endpoint latency

**System Metrics:**
- CPU usage
- Memory usage
- Disk I/O
- Network throughput

**Business Metrics:**
- Daily active users
- Contracts simulated
- Popular functions
- Session durations

### Logging

**Log Levels:**
- ERROR: Failures requiring attention
- WARN: Potential issues
- INFO: Normal operations
- DEBUG: Detailed debugging info

**Structured Logging:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "component": "SimulationService",
  "message": "Simulation completed",
  "metadata": {
    "contractId": "abc123",
    "function": "transfer",
    "duration": 45,
    "success": true
  }
}
```

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────┐
│               Cloudflare CDN                │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│            Load Balancer (nginx)            │
└────────────────┬────────────────────────────┘
                 │
        ┌────────┼────────┐
        │        │        │
┌───────▼───┐ ┌─▼──────┐ ┌▼────────┐
│  API Pod  │ │ API Pod │ │ API Pod │
│(Container)│ │(Container)│(Container)│
└───────────┘ └─────────┘ └─────────┘
        │        │        │
        └────────┼────────┘
                 │
        ┌────────┼────────┐
        │                 │
┌───────▼────────┐  ┌─────▼──────┐
│  PostgreSQL    │  │   Redis    │
│   (RDS/Cloud)  │  │  (Cluster) │
└────────────────┘  └────────────┘
```

---

## Technology Choices

### Why React?

- Component-based architecture
- Large ecosystem
- Excellent TypeScript support
- Rich UI libraries

### Why Rust for Simulation Core?

- Memory safety
- Zero-cost abstractions
- Excellent WASM support
- Predictable performance

### Why Node.js for API?

- Fast development
- Easy Rust integration (N-API)
- Strong async I/O
- Large ecosystem

### Why PostgreSQL?

- JSONB support for flexible storage
- ACID compliance
- Mature and stable
- Good performance

### Why Redis?

- Fast in-memory caching
- TTL support
- Pub/sub for real-time features
- Simple key-value model

---

## Future Architecture Considerations

### Planned Improvements

1. **Distributed Simulation:** Run simulations across multiple workers
2. **Real-time Collaboration:** WebSocket support for shared sessions
3. **GraphQL API:** Alternative to REST for frontend
4. **Event Sourcing:** Track all simulation events
5. **Microservices:** Split into smaller services as needed

---

## Related Documentation

- **[Contributing Guide](/docs/contributing)** — How to contribute to each component
- **[API Reference](/docs/api/overview)** — REST API specification
- **[CLI Reference](/docs/cli/commands)** — CLI architecture and commands

---

## Questions?

- 💬 **Discord**: [Architecture discussions](https://discord.gg/stellar)
- 📖 **GitHub**: [Architecture decisions (ADRs)](https://github.com/sorosim/sorosim/tree/main/docs/adr)
- 📧 **Email**: architecture@sorosim.dev
