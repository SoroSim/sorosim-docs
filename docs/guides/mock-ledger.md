# Mock Ledger Configuration Guide

Mock ledger configuration is the foundation of effective contract simulation in SoroSim. This guide covers advanced patterns, best practices, and real-world examples for configuring realistic test scenarios.

## What is Mock Ledger Configuration?

A **mock ledger** is a simulated blockchain state that you configure before running contract simulations. It contains:

- **Account entries** — User accounts with balances and signers
- **ContractData entries** — Pre-populated contract storage
- **ContractCode entries** — Deployed contract bytecode

Think of it as "test fixtures" for blockchain state.

---

## Basic Configuration

### JSON Structure

Mock ledger configuration is defined in JSON:

```json
{
  "entries": [
    {
      "type": "Account",
      "accountId": "GUSER...XYZ",
      "balance": "10000000000",
      "seqNum": "1"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "COUNTER"},
      "value": {"type": "U32", "value": 0},
      "durability": "Persistent"
    }
  ]
}
```

### Loading Configuration

**Browser:**
```
1. Click "Configure Ledger"
2. Click "Import JSON"
3. Paste or upload JSON file
4. Click "Load"
```

**CLI:**
```bash
sorosim simulate \
  --wasm contract.wasm \
  --function my_function \
  --ledger mock-ledger.json
```

---

## Configuration Patterns

### Pattern 1: Initialize Contract Storage

Set up initial contract state before first use.

**Use Case:** Testing functions that expect initialized state

**Example:**
```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "Initialized"},
      "value": {"type": "Bool", "value": true},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "Admin"},
      "value": {"type": "Address", "value": "GADMIN123...XYZ"},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "Config"},
      "value": {
        "type": "Map",
        "value": [
          {"key": {"type": "Symbol", "value": "fee_rate"}, "val": {"type": "U32", "value": 100}},
          {"key": {"type": "Symbol", "value": "max_supply"}, "val": {"type": "I128", "value": "1000000000"}}
        ]
      },
      "durability": "Persistent"
    }
  ]
}
```

**Benefits:**
- ✅ Skip initialization in every test
- ✅ Test post-initialization functions directly
- ✅ Consistent starting state

---

### Pattern 2: Pre-Fund User Accounts

Create accounts with XLM balances for testing.

**Use Case:** Testing payment flows, fee checks, auth scenarios

**Example:**
```json
{
  "entries": [
    {
      "type": "Account",
      "accountId": "GALICE...ABC",
      "balance": "100000000000",
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
    },
    {
      "type": "Account",
      "accountId": "GBOB...DEF",
      "balance": "50000000000",
      "seqNum": "50",
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
  ]
}
```

**Account Details:**
- Alice: 10 XLM (100,000,000,000 stroops)
- Bob: 5 XLM (50,000,000,000 stroops)
- Both have sequence numbers for transaction ordering

---

### Pattern 3: Pre-Allocate Token Balances

Set up token balances before testing transfers.

**Use Case:** Testing transfer, burn, balance queries without minting

**Example:**
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
          {"type": "Address", "value": "GALICE...XYZ"}
        ]
      },
      "value": {"type": "I128", "value": "1000000000"},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CTOKEN...ABC",
      "key": {
        "type": "Vec",
        "value": [
          {"type": "Symbol", "value": "Balance"},
          {"type": "Address", "value": "GBOB...DEF"}
        ]
      },
      "value": {"type": "I128", "value": "500000000"},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CTOKEN...ABC",
      "key": {"type": "Symbol", "value": "TotalSupply"},
      "value": {"type": "I128", "value": "1500000000"},
      "durability": "Persistent"
    }
  ]
}
```

**Token State:**
- Alice: 1,000,000,000 units
- Bob: 500,000,000 units
- Total supply: 1,500,000,000 units

---

### Pattern 4: Mock External Contracts

Provide fake implementations for contract dependencies.

**Use Case:** Testing cross-contract calls without deploying dependencies

**Example:**
```json
{
  "entries": [
    {
      "type": "ContractCode",
      "contractId": "CORACLE...XYZ",
      "hash": "a1b2c3d4e5f6...",
      "wasm": "AGFzbQEAAAABBAFgAAAC..."
    },
    {
      "type": "ContractData",
      "contract": "CORACLE...XYZ",
      "key": {"type": "Symbol", "value": "Price"},
      "value": {
        "type": "Map",
        "value": [
          {"key": {"type": "Symbol", "value": "asset"}, "val": {"type": "Symbol", "value": "XLM"}},
          {"key": {"type": "Symbol", "value": "price"}, "val": {"type": "U64", "value": 50000}},
          {"key": {"type": "Symbol", "value": "timestamp"}, "val": {"type": "U64", "value": 1704067200}}
        ]
      },
      "durability": "Temporary"
    }
  ]
}
```

**Oracle Mock:**
- Oracle contract deployed at `CORACLE...XYZ`
- Returns XLM price: $0.50 (50000 = $0.50 in cents)
- Timestamp: 2024-01-01

---

### Pattern 5: Multi-Sig Account Setup

Configure accounts with multiple signers.

**Use Case:** Testing auth with threshold requirements

**Example:**
```json
{
  "entries": [
    {
      "type": "Account",
      "accountId": "GMULTISIG...ABC",
      "balance": "20000000000",
      "seqNum": "1",
      "numSubEntries": 2,
      "flags": 0,
      "thresholds": {
        "low": 1,
        "medium": 2,
        "high": 3,
        "masterWeight": 1
      },
      "signers": [
        {
          "key": "GSIGNER1...XYZ",
          "weight": 1
        },
        {
          "key": "GSIGNER2...DEF",
          "weight": 2
        }
      ]
    }
  ]
}
```

**Multi-Sig Rules:**
- Low threshold (1): Any signer
- Medium threshold (2): Signer2 alone OR Master + Signer1
- High threshold (3): All signers required

---

### Pattern 6: Time-Sensitive State

Set up state with timestamps for testing time-based logic.

**Use Case:** Testing locks, expiration, vesting schedules

**Example:**
```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {
        "type": "Vec",
        "value": [
          {"type": "Symbol", "value": "Lock"},
          {"type": "Address", "value": "GUSER...XYZ"}
        ]
      },
      "value": {
        "type": "Map",
        "value": [
          {"key": {"type": "Symbol", "value": "amount"}, "val": {"type": "I128", "value": "1000000"}},
          {"key": {"type": "Symbol", "value": "unlock_time"}, "val": {"type": "U64", "value": 1735689600}},
          {"key": {"type": "Symbol", "value": "unlocked"}, "val": {"type": "Bool", "value": false}}
        ]
      },
      "durability": "Persistent"
    }
  ]
}
```

**Lock Details:**
- Amount: 1,000,000 tokens
- Unlock time: 2025-01-01 00:00:00 UTC (timestamp: 1735689600)
- Status: Still locked

---

### Pattern 7: Nested Storage Structures

Configure complex nested data structures.

**Use Case:** Testing contracts with nested maps, vectors of maps, etc.

**Example:**
```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "Proposals"},
      "value": {
        "type": "Map",
        "value": [
          {
            "key": {"type": "U32", "value": 1},
            "val": {
              "type": "Map",
              "value": [
                {"key": {"type": "Symbol", "value": "title"}, "val": {"type": "String", "value": "Increase Fee"}},
                {"key": {"type": "Symbol", "value": "votes_for"}, "val": {"type": "U32", "value": 100}},
                {"key": {"type": "Symbol", "value": "votes_against"}, "val": {"type": "U32", "value": 50}},
                {
                  "key": {"type": "Symbol", "value": "voters"},
                  "val": {
                    "type": "Vec",
                    "value": [
                      {"type": "Address", "value": "GVOTER1...ABC"},
                      {"type": "Address", "value": "GVOTER2...DEF"}
                    ]
                  }
                }
              ]
            }
          }
        ]
      },
      "durability": "Persistent"
    }
  ]
}
```

**Proposal Structure:**
- Proposal ID: 1
- Title: "Increase Fee"
- Votes for: 100
- Votes against: 50
- Voters: [GVOTER1, GVOTER2]

---

## Advanced Techniques

### Technique 1: Chaining Simulations

Save state after each simulation and use it for the next.

**Workflow:**
```bash
# Simulation 1: Initialize
sorosim simulate \
  -w token.wasm \
  -f initialize \
  --args '[{"type":"Address","value":"GADMIN..."}]' \
  --save-state state1.json

# Simulation 2: Mint (using state from #1)
sorosim simulate \
  -w token.wasm \
  -f mint \
  --ledger state1.json \
  --args '[{"type":"Address","value":"GUSER..."},{"type":"I128","value":"1000"}]' \
  --save-state state2.json

# Simulation 3: Transfer (using state from #2)
sorosim simulate \
  -w token.wasm \
  -f transfer \
  --ledger state2.json \
  --args '[{"type":"Address","value":"GUSER1..."},{"type":"Address","value":"GUSER2..."},{"type":"I128","value":"500"}]'
```

**Benefits:**
- ✅ Realistic state progression
- ✅ Test entire user flows
- ✅ Reproducible scenarios

---

### Technique 2: Template Configurations

Create reusable configuration templates.

**base-config.json:**
```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "Initialized"},
      "value": {"type": "Bool", "value": true},
      "durability": "Persistent"
    }
  ]
}
```

**with-users.json:**
```json
{
  "extends": "base-config.json",
  "entries": [
    {
      "type": "Account",
      "accountId": "GUSER1...ABC",
      "balance": "10000000000",
      "seqNum": "1"
    },
    {
      "type": "Account",
      "accountId": "GUSER2...DEF",
      "balance": "10000000000",
      "seqNum": "1"
    }
  ]
}
```

**Note:** `extends` is a conceptual pattern (implement via scripting or tooling)

---

### Technique 3: Parameterized Configurations

Generate configurations programmatically.

**JavaScript example:**
```javascript
function generateTokenBalances(users, amount) {
  return {
    entries: users.map(user => ({
      type: "ContractData",
      contract: "CTOKEN...ABC",
      key: {
        type: "Vec",
        value: [
          {type: "Symbol", value: "Balance"},
          {type: "Address", value: user}
        ]
      },
      value: {type: "I128", value: amount.toString()},
      durability: "Persistent"
    }))
  };
}

const config = generateTokenBalances(
  ["GUSER1...ABC", "GUSER2...DEF", "GUSER3...GHI"],
  "1000000"
);
```

---

### Technique 4: Environment-Based Configs

Different configurations for different scenarios.

**Directory structure:**
```
configs/
  ├── dev.json          # Minimal setup for development
  ├── test.json         # Comprehensive test data
  ├── production.json   # Production-like state
  └── edge-cases.json   # Unusual scenarios
```

**Usage:**
```bash
# Development
sorosim simulate --ledger configs/dev.json ...

# Testing
sorosim simulate --ledger configs/test.json ...

# Edge cases
sorosim simulate --ledger configs/edge-cases.json ...
```

---

## Real-World Examples

### Example 1: Token Contract

Complete token setup with metadata, balances, and allowances.

**token-config.json:**
```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "Metadata"},
      "value": {
        "type": "Map",
        "value": [
          {"key": {"type": "Symbol", "value": "name"}, "val": {"type": "String", "value": "MyToken"}},
          {"key": {"type": "Symbol", "value": "symbol"}, "val": {"type": "String", "value": "MTK"}},
          {"key": {"type": "Symbol", "value": "decimals"}, "val": {"type": "U32", "value": 7}}
        ]
      },
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "Admin"},
      "value": {"type": "Address", "value": "GADMIN...XYZ"},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "TotalSupply"},
      "value": {"type": "I128", "value": "10000000000"},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {
        "type": "Vec",
        "value": [
          {"type": "Symbol", "value": "Balance"},
          {"type": "Address", "value": "GADMIN...XYZ"}
        ]
      },
      "value": {"type": "I128", "value": "10000000000"},
      "durability": "Persistent"
    }
  ]
}
```

---

### Example 2: NFT Contract

NFT collection with owners and metadata.

**nft-config.json:**
```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "CollectionName"},
      "value": {"type": "String", "value": "CoolNFTs"},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "NextTokenId"},
      "value": {"type": "U32", "value": 3},
      "durability": "Persistent"
    },
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
      "value": {"type": "Address", "value": "GALICE...ABC"},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {
        "type": "Vec",
        "value": [
          {"type": "Symbol", "value": "Metadata"},
          {"type": "U32", "value": 1}
        ]
      },
      "value": {"type": "String", "value": "ipfs://Qm...abc123"},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {
        "type": "Vec",
        "value": [
          {"type": "Symbol", "value": "Owner"},
          {"type": "U32", "value": 2}
        ]
      },
      "value": {"type": "Address", "value": "GBOB...DEF"},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {
        "type": "Vec",
        "value": [
          {"type": "Symbol", "value": "Metadata"},
          {"type": "U32", "value": 2}
        ]
      },
      "value": {"type": "String", "value": "ipfs://Qm...def456"},
      "durability": "Persistent"
    }
  ]
}
```

**NFT State:**
- Collection: "CoolNFTs"
- Next token ID: 3
- Token #1: Owned by Alice, metadata at ipfs://Qm...abc123
- Token #2: Owned by Bob, metadata at ipfs://Qm...def456

---

### Example 3: Voting/DAO Contract

Governance state with proposals and votes.

**dao-config.json:**
```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "ProposalCount"},
      "value": {"type": "U32", "value": 2},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {
        "type": "Vec",
        "value": [
          {"type": "Symbol", "value": "Proposal"},
          {"type": "U32", "value": 1}
        ]
      },
      "value": {
        "type": "Map",
        "value": [
          {"key": {"type": "Symbol", "value": "title"}, "val": {"type": "String", "value": "Upgrade Contract"}},
          {"key": {"type": "Symbol", "value": "description"}, "val": {"type": "String", "value": "Upgrade to v2.0"}},
          {"key": {"type": "Symbol", "value": "proposer"}, "val": {"type": "Address", "value": "GADMIN...XYZ"}},
          {"key": {"type": "Symbol", "value": "votes_for"}, "val": {"type": "U32", "value": 150}},
          {"key": {"type": "Symbol", "value": "votes_against"}, "val": {"type": "U32", "value": 50}},
          {"key": {"type": "Symbol", "value": "status"}, "val": {"type": "Symbol", "value": "Active"}},
          {"key": {"type": "Symbol", "value": "end_time"}, "val": {"type": "U64", "value": 1735689600}}
        ]
      },
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {
        "type": "Vec",
        "value": [
          {"type": "Symbol", "value": "HasVoted"},
          {"type": "U32", "value": 1},
          {"type": "Address", "value": "GVOTER1...ABC"}
        ]
      },
      "value": {"type": "Bool", "value": true},
      "durability": "Persistent"
    }
  ]
}
```

---

## Best Practices

### ✅ Do

- **Use `CURRENT_CONTRACT`** for contract storage entries (portable)
- **Set realistic balances** (10+ XLM for accounts)
- **Include all required entries** for functions to succeed
- **Document complex configurations** with comments (in external docs)
- **Version your configs** for reproducibility
- **Save successful states** for reuse

### ❌ Don't

- **Don't hardcode contract IDs** unless testing cross-contract calls
- **Don't use tiny balances** (may fail fee checks)
- **Don't skip initialization** if contract expects it
- **Don't mix durability** incorrectly (Persistent vs Temporary)
- **Don't forget sequence numbers** for accounts (use "1" for new accounts)

---

## Troubleshooting

### Issue: Simulation Fails with "Entry Not Found"

**Cause:** Contract expects ledger entry that doesn't exist

**Solution:**
1. Check simulation error for missing entry key
2. Add entry to mock ledger configuration
3. Verify entry type and key format

---

### Issue: Auth Fails Despite Account Existing

**Cause:** Account thresholds or signers misconfigured

**Solution:**
1. Verify threshold values match operation requirements
2. Check signer weights add up to threshold
3. Use [Auth Context Guide](/docs/guides/auth-context) for spoofing

---

### Issue: State Changes Not Appearing

**Cause:** Wrong durability or storage key

**Solution:**
1. Verify storage key matches contract code
2. Check durability (Persistent vs Temporary)
3. Review contract logic for conditional writes

---

## Related Guides

- **[Ledger Entries](/docs/concepts/ledger-entries)** — Understanding entry types
- **[ScVal Types](/docs/concepts/scval-types)** — Encoding values correctly
- **[Cross-Contract Guide](/docs/guides/cross-contract)** — Mock external contracts
- **[Auth Context Guide](/docs/guides/auth-context)** — Spoofing authorization

---

## Configuration Templates

Download ready-to-use templates:

- [Token Contract Template](https://github.com/sorosim/templates/token.json)
- [NFT Contract Template](https://github.com/sorosim/templates/nft.json)
- [DAO/Voting Template](https://github.com/sorosim/templates/dao.json)
- [Multi-User Template](https://github.com/sorosim/templates/multi-user.json)

---

## Need Help?

- 💬 **Discord**: [Ask about configuration](https://discord.gg/stellar)
- 📖 **Examples**: [Browse configuration examples](https://github.com/sorosim/examples/ledger-configs)
- 🎥 **Video**: [Mock ledger configuration tutorial](https://youtube.com/sorosim)
