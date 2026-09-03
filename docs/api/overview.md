# API Reference

The SoroSim backend provides a REST API for programmatic access to simulation capabilities. This reference documents all available endpoints, request/response formats, and usage examples.

## Base URL

**Production:**
```
https://api.sorosim.dev/v1
```

**Development:**
```
http://localhost:3000/v1
```

## Authentication

Currently, the SoroSim API is **public and does not require authentication**. Rate limiting applies (see [Rate Limits](#rate-limits)).

Future versions will support API keys for higher rate limits and premium features.

---

## Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| [`/simulate`](#post-simulate) | POST | Simulate a contract invocation |
| [`/contracts`](#post-contracts) | POST | Upload and validate a contract |
| [`/contracts/:id`](#get-contractsid) | GET | Get contract metadata |
| [`/contracts/:id/functions`](#get-contractsidfunctions) | GET | List contract functions |
| [`/ledger/validate`](#post-ledgervalidate) | POST | Validate ledger configuration |
| [`/sessions`](#post-sessions) | POST | Create a simulation session |
| [`/sessions/:id`](#get-sessionsid) | GET | Get session details |
| [`/sessions/:id/snapshot`](#get-sessionsidsnapshot) | GET | Download session snapshot |
| [`/health`](#get-health) | GET | API health check |

---

## POST /simulate

Simulates a contract function invocation.

### Request

**Endpoint:** `POST /v1/simulate`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "wasm": "AGFzbQEAAAABpICAgAABYAN...",
  "function": "transfer",
  "args": [
    {"type": "Address", "value": "GALICE...XYZ"},
    {"type": "Address", "value": "GBOB...DEF"},
    {"type": "I128", "value": "500"}
  ],
  "ledger": {
    "entries": [
      {
        "type": "ContractData",
        "contract": "CURRENT_CONTRACT",
        "key": {"type": "Symbol", "value": "Balance"},
        "value": {"type": "I128", "value": "1000"},
        "durability": "Persistent"
      }
    ]
  },
  "auth": {
    "address": "GALICE...XYZ"
  }
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `wasm` | string | Yes | Base64-encoded WASM bytecode |
| `function` | string | Yes | Function name to invoke |
| `args` | array | No | Function arguments (ScVal format) |
| `ledger` | object | No | Mock ledger configuration |
| `auth` | object | No | Authorization context |

### Response

**Success (200):**
```json
{
  "success": true,
  "result": {
    "type": "Void"
  },
  "stateChanges": [
    {
      "type": "Modified",
      "entry": {
        "type": "ContractData",
        "key": {"type": "Symbol", "value": "Balance"}
      },
      "before": {"type": "I128", "value": "1000"},
      "after": {"type": "I128", "value": "500"}
    }
  ],
  "footprint": {
    "readOnly": [],
    "readWrite": [
      {
        "type": "ContractData",
        "key": {"type": "Symbol", "value": "Balance"}
      }
    ]
  },
  "metrics": {
    "cpuInstructions": 12450,
    "memoryBytes": 2048,
    "executionTimeMs": 45
  },
  "events": [],
  "simulationId": "sim_1234567890abcdef"
}
```

**Error (400):**
```json
{
  "error": {
    "code": "INVALID_WASM",
    "message": "Failed to parse WASM bytecode",
    "details": "Invalid magic number"
  }
}
```

**Error (422):**
```json
{
  "error": {
    "code": "SIMULATION_FAILED",
    "message": "Contract invocation failed",
    "details": "Authorization required from GALICE...XYZ"
  }
}
```

### Example

**cURL:**
```bash
curl -X POST https://api.sorosim.dev/v1/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "wasm": "AGFzbQEAAAABpICAgAABYAN...",
    "function": "increment",
    "args": []
  }'
```

**JavaScript:**
```javascript
const response = await fetch('https://api.sorosim.dev/v1/simulate', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    wasm: wasmBase64,
    function: 'increment',
    args: []
  })
});

const result = await response.json();
console.log(result.metrics.cpuInstructions);
```

---

## POST /contracts

Uploads and validates a contract WASM.

### Request

**Endpoint:** `POST /v1/contracts`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "wasm": "AGFzbQEAAAABpICAgAABYAN...",
  "name": "my_token_contract"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `wasm` | string | Yes | Base64-encoded WASM bytecode |
| `name` | string | No | Friendly name for the contract |

### Response

**Success (201):**
```json
{
  "contractId": "contract_abc123def456",
  "name": "my_token_contract",
  "hash": "a1b2c3d4e5f6...",
  "size": 45678,
  "functions": [
    {
      "name": "initialize",
      "parameters": [
        {"name": "admin", "type": "Address"},
        {"name": "name", "type": "String"},
        {"name": "symbol", "type": "String"}
      ],
      "returns": "Void"
    },
    {
      "name": "transfer",
      "parameters": [
        {"name": "from", "type": "Address"},
        {"name": "to", "type": "Address"},
        {"name": "amount", "type": "I128"}
      ],
      "returns": "Void"
    }
  ],
  "sdkVersion": "20.5.0",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error (400):**
```json
{
  "error": {
    "code": "INVALID_WASM",
    "message": "WASM validation failed",
    "details": "Unsupported Soroban SDK version"
  }
}
```

---

## GET /contracts/:id

Retrieves contract metadata.

### Request

**Endpoint:** `GET /v1/contracts/:id`

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Contract ID (from upload) |

### Response

**Success (200):**
```json
{
  "contractId": "contract_abc123def456",
  "name": "my_token_contract",
  "hash": "a1b2c3d4e5f6...",
  "size": 45678,
  "sdkVersion": "20.5.0",
  "createdAt": "2024-01-15T10:30:00Z",
  "invocations": 42,
  "lastInvoked": "2024-01-15T14:22:00Z"
}
```

**Error (404):**
```json
{
  "error": {
    "code": "CONTRACT_NOT_FOUND",
    "message": "Contract not found",
    "details": "No contract with ID contract_abc123def456"
  }
}
```

---

## GET /contracts/:id/functions

Lists all functions in a contract.

### Request

**Endpoint:** `GET /v1/contracts/:id/functions`

### Response

**Success (200):**
```json
{
  "contractId": "contract_abc123def456",
  "functions": [
    {
      "name": "initialize",
      "parameters": [
        {"name": "admin", "type": "Address"},
        {"name": "name", "type": "String"},
        {"name": "symbol", "type": "String"},
        {"name": "decimals", "type": "U32"}
      ],
      "returns": "Void",
      "visibility": "public"
    },
    {
      "name": "mint",
      "parameters": [
        {"name": "to", "type": "Address"},
        {"name": "amount", "type": "I128"}
      ],
      "returns": "Void",
      "visibility": "public",
      "requiresAuth": true
    },
    {
      "name": "transfer",
      "parameters": [
        {"name": "from", "type": "Address"},
        {"name": "to", "type": "Address"},
        {"name": "amount", "type": "I128"}
      ],
      "returns": "Void",
      "visibility": "public",
      "requiresAuth": true
    },
    {
      "name": "balance",
      "parameters": [
        {"name": "id", "type": "Address"}
      ],
      "returns": "I128",
      "visibility": "public"
    }
  ]
}
```

---

## POST /ledger/validate

Validates a ledger configuration.

### Request

**Endpoint:** `POST /v1/ledger/validate`

**Body:**
```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "COUNTER"},
      "value": {"type": "U32", "value": 0},
      "durability": "Persistent"
    },
    {
      "type": "Account",
      "accountId": "GALICE...XYZ",
      "balance": "10000000000",
      "seqNum": "1"
    }
  ]
}
```

### Response

**Success (200):**
```json
{
  "valid": true,
  "entryCount": 2,
  "totalSize": 1234,
  "warnings": []
}
```

**Error (400):**
```json
{
  "valid": false,
  "errors": [
    {
      "entry": 0,
      "field": "value",
      "message": "Invalid ScVal type: expected U32, got String"
    }
  ]
}
```

---

## POST /sessions

Creates a new simulation session.

### Request

**Endpoint:** `POST /v1/sessions`

**Body:**
```json
{
  "name": "Token Transfer Test",
  "description": "Testing token transfer functionality",
  "contractId": "contract_abc123def456",
  "ledger": {
    "entries": [...]
  },
  "auth": {
    "address": "GALICE...XYZ"
  }
}
```

### Response

**Success (201):**
```json
{
  "sessionId": "session_xyz789abc123",
  "name": "Token Transfer Test",
  "description": "Testing token transfer functionality",
  "contractId": "contract_abc123def456",
  "createdAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2024-01-15T22:30:00Z"
}
```

---

## GET /sessions/:id

Retrieves session details and invocation history.

### Request

**Endpoint:** `GET /v1/sessions/:id`

### Response

**Success (200):**
```json
{
  "sessionId": "session_xyz789abc123",
  "name": "Token Transfer Test",
  "contractId": "contract_abc123def456",
  "invocations": [
    {
      "invocationId": "inv_123",
      "function": "initialize",
      "timestamp": "2024-01-15T10:30:00Z",
      "success": true
    },
    {
      "invocationId": "inv_124",
      "function": "mint",
      "timestamp": "2024-01-15T10:31:00Z",
      "success": true
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "lastActivity": "2024-01-15T10:31:00Z"
}
```

---

## GET /sessions/:id/snapshot

Downloads a session snapshot.

### Request

**Endpoint:** `GET /v1/sessions/:id/snapshot`

**Query Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `format` | string | No | Snapshot format: `json` (default) or `binary` |

### Response

**Success (200):**
```json
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "name": "Token Transfer Test",
  "contracts": [...],
  "ledger": {...},
  "invocations": [...],
  "auth": {...}
}
```

**Headers:**
```
Content-Type: application/json
Content-Disposition: attachment; filename="session-snapshot.sorosim"
```

---

## GET /health

Health check endpoint.

### Request

**Endpoint:** `GET /v1/health`

### Response

**Success (200):**
```json
{
  "status": "healthy",
  "version": "0.3.0",
  "uptime": 86400,
  "checks": {
    "database": "healthy",
    "simulator": "healthy",
    "storage": "healthy"
  }
}
```

**Degraded (200):**
```json
{
  "status": "degraded",
  "version": "0.3.0",
  "uptime": 86400,
  "checks": {
    "database": "healthy",
    "simulator": "healthy",
    "storage": "degraded"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_WASM` | 400 | WASM bytecode is invalid or corrupted |
| `INVALID_FUNCTION` | 400 | Function name doesn't exist in contract |
| `INVALID_ARGS` | 400 | Function arguments are malformed |
| `INVALID_LEDGER` | 400 | Ledger configuration is invalid |
| `SIMULATION_FAILED` | 422 | Contract invocation failed during execution |
| `AUTH_REQUIRED` | 422 | Authorization required but not provided |
| `CONTRACT_NOT_FOUND` | 404 | Contract ID doesn't exist |
| `SESSION_NOT_FOUND` | 404 | Session ID doesn't exist |
| `SESSION_EXPIRED` | 410 | Session has expired |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limits

**Current Limits:**

| Endpoint | Rate Limit | Window |
|----------|-----------|--------|
| `/simulate` | 60 requests | per minute |
| `/contracts` | 20 requests | per minute |
| Other endpoints | 120 requests | per minute |

**Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705318200
```

**Rate Limit Exceeded (429):**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 30
  }
}
```

---

## Pagination

Endpoints returning lists support pagination:

**Query Parameters:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page (max: 100) |

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Webhooks

**Coming Soon:** Subscribe to events for automated workflows.

Planned events:
- `simulation.completed`
- `simulation.failed`
- `contract.uploaded`
- `session.created`

---

## OpenAPI Specification

Download the complete OpenAPI 3.0 specification:

**JSON:** [https://api.sorosim.dev/v1/openapi.json](https://api.sorosim.dev/v1/openapi.json)  
**YAML:** [https://api.sorosim.dev/v1/openapi.yaml](https://api.sorosim.dev/v1/openapi.yaml)

### Using with Tools

**Postman:**
```
1. Open Postman
2. Import → Link
3. Paste: https://api.sorosim.dev/v1/openapi.json
4. Import
```

**Swagger UI:**
```
https://api.sorosim.dev/docs
```

**Code Generation:**
```bash
# Generate TypeScript client
openapi-generator-cli generate \
  -i https://api.sorosim.dev/v1/openapi.json \
  -g typescript-axios \
  -o ./src/api-client
```

---

## Client Libraries

### Official SDKs

**JavaScript/TypeScript:**
```bash
npm install @sorosim/client
```

```typescript
import { SoroSimClient } from '@sorosim/client';

const client = new SoroSimClient({
  baseUrl: 'https://api.sorosim.dev/v1'
});

const result = await client.simulate({
  wasm: wasmBase64,
  function: 'transfer',
  args: [...]
});
```

**Python:**
```bash
pip install sorosim-client
```

```python
from sorosim import SoroSimClient

client = SoroSimClient(base_url='https://api.sorosim.dev/v1')
result = client.simulate(
    wasm=wasm_base64,
    function='transfer',
    args=[...]
)
```

**Rust:**
```toml
[dependencies]
sorosim-client = "0.3.0"
```

```rust
use sorosim_client::SoroSimClient;

let client = SoroSimClient::new("https://api.sorosim.dev/v1");
let result = client.simulate(SimulateRequest {
    wasm: wasm_bytes,
    function: "transfer".into(),
    args: vec![...],
}).await?;
```

---

## Examples

### Complete Workflow

```javascript
// 1. Upload contract
const uploadResponse = await fetch('https://api.sorosim.dev/v1/contracts', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    wasm: wasmBase64,
    name: 'my_token'
  })
});
const {contractId} = await uploadResponse.json();

// 2. Create session
const sessionResponse = await fetch('https://api.sorosim.dev/v1/sessions', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    name: 'Token Test Session',
    contractId: contractId,
    ledger: {entries: [...]}
  })
});
const {sessionId} = await sessionResponse.json();

// 3. Simulate invocation
const simResponse = await fetch('https://api.sorosim.dev/v1/simulate', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    wasm: wasmBase64,
    function: 'transfer',
    args: [...]
  })
});
const result = await simResponse.json();

console.log('CPU:', result.metrics.cpuInstructions);
console.log('State Changes:', result.stateChanges.length);

// 4. Download snapshot
const snapshotUrl = `https://api.sorosim.dev/v1/sessions/${sessionId}/snapshot`;
const snapshotResponse = await fetch(snapshotUrl);
const snapshot = await snapshotResponse.json();
```

---

## Best Practices

### ✅ Do

- **Cache contract uploads** — Reuse `contractId` for multiple simulations
- **Use sessions** — Group related invocations
- **Handle rate limits** — Implement exponential backoff
- **Validate inputs** — Use `/ledger/validate` before simulation
- **Check health** — Monitor `/health` endpoint

### ❌ Don't

- **Don't upload contracts repeatedly** — Cache and reuse
- **Don't ignore errors** — Check `error.code` for proper handling
- **Don't exceed rate limits** — Respect `X-RateLimit-*` headers
- **Don't send secrets** — API responses may be logged

---

## Related Guides

- **[CLI Quickstart](/docs/quickstart/cli)** — CLI uses the API internally
- **[CI Integration](/docs/guides/ci-integration)** — API usage in CI/CD
- **[Browser Quickstart](/docs/quickstart/browser)** — UI calls the API

---

## Need Help?

- 📖 **API Status**: [status.sorosim.dev](https://status.sorosim.dev)
- 💬 **Discord**: [Ask about the API](https://discord.gg/stellar)
- 🐛 **Report Issues**: [API bugs](https://github.com/sorosim/sorosim-backend/issues)
- 📧 **Support**: api-support@sorosim.dev
