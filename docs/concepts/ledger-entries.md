# Soroban Ledger Entries

Understanding ledger entries is fundamental to working with SoroSim. This guide explains the three types of ledger entries in Soroban and how to configure them for simulation.

## Overview

The Soroban ledger stores all blockchain state in **ledger entries**. Every piece of data—from account balances to contract storage—exists as a typed entry in the ledger.

When you simulate a contract invocation in SoroSim, you're working with a **mock ledger** that behaves exactly like the real Soroban ledger, but runs entirely locally.

## The Three Ledger Entry Types

Soroban uses three distinct ledger entry types:

| Entry Type | Purpose | Contains |
|------------|---------|----------|
| **Account** | Stellar account data | Balance, sequence number, signers |
| **ContractData** | Contract storage | Key-value pairs stored by contracts |
| **ContractCode** | Deployed WASM | Contract bytecode and metadata |

Let's explore each type in detail.

---

## 1. Account Entries

Account entries represent **Stellar accounts** on the network. These are the same accounts used in classic Stellar operations.

### Structure

```typescript
{
  type: "Account",
  accountId: string,        // Stellar address (G...)
  balance: string,          // Stroops (1 XLM = 10,000,000 stroops)
  seqNum: string,           // Account sequence number
  numSubEntries: number,    // Number of sub-entries (trustlines, offers, etc.)
  flags: number,            // Account flags
  homeDomain: string,       // Optional home domain
  thresholds: {             // Signature thresholds
    low: number,
    medium: number,
    high: number,
    masterWeight: number
  },
  signers: Array<{          // Additional signers
    key: string,
    weight: number
  }>
}
```

### When to Use Account Entries

You need account entries when your contract:
- **Checks account balances** (e.g., payment validation)
- **Requires authorization** from a Stellar account
- **Interacts with classic Stellar operations** (payments, trustlines)
- **Validates account existence** before performing actions

### Example: Basic Account

```json
{
  "type": "Account",
  "accountId": "GABC123...XYZ",
  "balance": "10000000000",
  "seqNum": "100",
  "numSubEntries": 0,
  "flags": 0,
  "thresholds": {
    "low": 1,
    "medium": 1,
    "high": 1,
    "masterWeight": 1
  },
  "signers": []
}
```

This represents an account with:
- **10 XLM balance** (10,000,000,000 stroops)
- **Sequence number 100**
- **Standard thresholds** (all operations require weight 1)
- **No additional signers**

### Example: Multi-Sig Account

```json
{
  "type": "Account",
  "accountId": "GMULTI...SIG",
  "balance": "50000000000",
  "seqNum": "250",
  "thresholds": {
    "low": 1,
    "medium": 2,
    "high": 3,
    "masterWeight": 1
  },
  "signers": [
    {
      "key": "GSIGNER1...ABC",
      "weight": 1
    },
    {
      "key": "GSIGNER2...DEF",
      "weight": 2
    }
  ]
}
```

This account requires:
- **Weight 2+ for medium operations** (requires signer 2 or master + signer 1)
- **Weight 3+ for high operations** (requires all signers)

---

## 2. ContractData Entries

ContractData entries represent **contract storage**. Every piece of data a contract saves is stored as a ContractData entry.

### Structure

```typescript
{
  type: "ContractData",
  contract: string,         // Contract ID or "CURRENT_CONTRACT"
  key: ScVal,              // Storage key (any ScVal type)
  value: ScVal,            // Storage value (any ScVal type)
  durability: "Persistent" | "Temporary"  // Storage durability
}
```

### Storage Durability

Soroban supports two storage durability levels:

| Durability | Lifetime | Cost | Use Case |
|------------|----------|------|----------|
| **Persistent** | Long-term (must be extended) | Higher | Critical data, user balances, configuration |
| **Temporary** | Short-term (auto-expires) | Lower | Cache, session data, temporary state |

:::tip Persistent vs Temporary
- Use **Persistent** for data that must never be lost (balances, ownership)
- Use **Temporary** for data that can be recomputed (caches, derived state)
:::

### When to Use ContractData Entries

You need ContractData entries when:
- **Pre-populating contract storage** for testing
- **Simulating contracts that read existing data**
- **Testing state transitions** with specific initial conditions
- **Reproducing production state** for debugging

### Example: Counter Storage

```json
{
  "type": "ContractData",
  "contract": "CURRENT_CONTRACT",
  "key": {
    "type": "Symbol",
    "value": "COUNTER"
  },
  "value": {
    "type": "U32",
    "value": 42
  },
  "durability": "Persistent"
}
```

This stores:
- **Key**: `Symbol("COUNTER")`
- **Value**: `U32(42)`
- **Durability**: Persistent storage

### Example: User Balance

```json
{
  "type": "ContractData",
  "contract": "CTOKEN...ABC",
  "key": {
    "type": "Vec",
    "value": [
      {"type": "Symbol", "value": "Balance"},
      {"type": "Address", "value": "GUSER...XYZ"}
    ]
  },
  "value": {
    "type": "I128",
    "value": "1000000"
  },
  "durability": "Persistent"
}
```

This represents a token balance:
- **Contract**: Token contract ID
- **Key**: `["Balance", userAddress]` (composite key)
- **Value**: `1,000,000` units (I128)

### Example: Temporary Cache

```json
{
  "type": "ContractData",
  "contract": "CURRENT_CONTRACT",
  "key": {
    "type": "Symbol",
    "value": "LAST_PRICE"
  },
  "value": {
    "type": "U64",
    "value": 12345
  },
  "durability": "Temporary"
}
```

Temporary storage for a cached price that can expire.

---

## 3. ContractCode Entries

ContractCode entries store **deployed contract WASM bytecode**. Each deployed contract has exactly one ContractCode entry.

### Structure

```typescript
{
  type: "ContractCode",
  hash: string,            // SHA-256 hash of WASM
  wasm: string,           // Base64-encoded WASM bytecode
  contractId: string      // Contract identifier
}
```

### When to Use ContractCode Entries

You need ContractCode entries when:
- **Simulating cross-contract calls** (contract A invoking contract B)
- **Testing contract upgrades** (old vs new WASM)
- **Mocking dependencies** (providing fake implementations)
- **Testing factory patterns** (contracts deploying other contracts)

### Example: Deployed Contract

```json
{
  "type": "ContractCode",
  "hash": "a1b2c3d4...",
  "contractId": "CCALLER...ABC",
  "wasm": "AGFzbQEAAAAB..."
}
```

:::info Cross-Contract Simulation
See the [Cross-Contract Invocation Guide](/docs/guides/cross-contract) for detailed examples of multi-contract scenarios.
:::

---

## Special Values in SoroSim

### `CURRENT_CONTRACT` Placeholder

When configuring ContractData entries, you can use the special value `"CURRENT_CONTRACT"` instead of a specific contract ID:

```json
{
  "type": "ContractData",
  "contract": "CURRENT_CONTRACT",
  "key": {"type": "Symbol", "value": "ADMIN"},
  "value": {"type": "Address", "value": "GADMIN...XYZ"},
  "durability": "Persistent"
}
```

SoroSim automatically replaces `CURRENT_CONTRACT` with the contract ID of the WASM you're simulating.

**Benefits:**
- ✅ No need to know the contract ID in advance
- ✅ Portable configurations across deployments
- ✅ Cleaner test fixtures

---

## Common Patterns

### Pattern 1: Initialize Contract Storage

Before testing a contract function, set up initial state:

```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "initialized"},
      "value": {"type": "Bool", "value": true},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "admin"},
      "value": {"type": "Address", "value": "GADMIN..."},
      "durability": "Persistent"
    }
  ]
}
```

### Pattern 2: Pre-Fund User Accounts

Set up accounts with XLM before testing payments:

```json
{
  "entries": [
    {
      "type": "Account",
      "accountId": "GUSER1...ABC",
      "balance": "100000000000",
      "seqNum": "1"
    },
    {
      "type": "Account",
      "accountId": "GUSER2...DEF",
      "balance": "50000000000",
      "seqNum": "1"
    }
  ]
}
```

### Pattern 3: Mock External Contract

Provide a fake implementation of a dependency:

```json
{
  "entries": [
    {
      "type": "ContractCode",
      "contractId": "CORACLE...XYZ",
      "hash": "oracle_hash",
      "wasm": "<base64-encoded-mock-oracle>"
    },
    {
      "type": "ContractData",
      "contract": "CORACLE...XYZ",
      "key": {"type": "Symbol", "value": "price"},
      "value": {"type": "U64", "value": 50000},
      "durability": "Temporary"
    }
  ]
}
```

### Pattern 4: Token Pre-Allocation

Set up token balances before testing transfers:

```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CTOKEN...ABC",
      "key": {
        "type": "Vec",
        "value": [
          {"type": "Symbol", "value": "Balance"},
          {"type": "Address", "value": "GUSER...XYZ"}
        ]
      },
      "value": {"type": "I128", "value": "1000000"},
      "durability": "Persistent"
    }
  ]
}
```

---

## Ledger Entry Lifecycle

### During Simulation

1. **Before invocation**: SoroSim loads your mock ledger entries
2. **During invocation**: Contract reads and writes ledger entries
3. **After invocation**: SoroSim computes the state diff
4. **Result**: You see which entries were added, modified, or deleted

### State Persistence

Within a SoroSim session:
- ✅ **State persists** across multiple invocations
- ✅ **Changes accumulate** (second call sees first call's changes)
- ✅ **Snapshots can be saved** and restored later

---

## Best Practices

### ✅ Do

- **Use `CURRENT_CONTRACT`** for contract storage entries
- **Set realistic balances** (10+ XLM for accounts)
- **Match production storage patterns** when debugging
- **Use Persistent durability** for critical data
- **Document complex keys** with comments in JSON

### ❌ Don't

- **Don't use hardcoded contract IDs** unless testing cross-contract calls
- **Don't mix up durability** (Persistent vs Temporary)
- **Don't forget account sequence numbers** (use "1" for new accounts)
- **Don't skip auth entries** if your contract requires authorization

---

## Related Concepts

Now that you understand ledger entries:

- **[ScVal Types](/docs/concepts/scval-types)** — How Soroban represents values
- **[State Diff Model](/docs/concepts/state-diff)** — How SoroSim tracks changes
- **[Mock Ledger Guide](/docs/guides/mock-ledger)** — Advanced configuration patterns
- **[Cross-Contract Guide](/docs/guides/cross-contract)** — Using ContractCode entries

---

## Examples by Contract Type

### Token Contract

```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "METADATA"},
      "value": {
        "type": "Map",
        "value": [
          {"key": {"type": "Symbol", "value": "name"}, "val": {"type": "String", "value": "MyToken"}},
          {"key": {"type": "Symbol", "value": "symbol"}, "val": {"type": "String", "value": "MTK"}}
        ]
      },
      "durability": "Persistent"
    }
  ]
}
```

### NFT Contract

```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {
        "type": "Vec",
        "value": [
          {"type": "Symbol", "value": "Owner"},
          {"type": "U32", "value": 1}
        ]
      },
      "value": {"type": "Address", "value": "GOWNER...XYZ"},
      "durability": "Persistent"
    }
  ]
}
```

### Voting Contract

```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "PROPOSAL_COUNT"},
      "value": {"type": "U32", "value": 5},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {
        "type": "Vec",
        "value": [
          {"type": "Symbol", "value": "Votes"},
          {"type": "U32", "value": 1},
          {"type": "Address", "value": "GVOTER...ABC"}
        ]
      },
      "value": {"type": "Bool", "value": true},
      "durability": "Persistent"
    }
  ]
}
```

---

## Need Help?

- 📖 **Next**: [Understanding ScVal Types](/docs/concepts/scval-types)
- 💬 **Discord**: [Ask questions in the community](https://discord.gg/stellar)
- 🔍 **Examples**: [Browse ledger configuration examples](https://github.com/sorosim/examples/ledger)
