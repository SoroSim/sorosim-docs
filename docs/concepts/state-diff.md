# State Diff Model

The state diff model is SoroSim's core feature for visualizing how contract invocations modify ledger state. This guide explains how state diffs work, how footprints are parsed, and how to interpret the results.

## What is a State Diff?

A **state diff** is a before/after comparison showing exactly how a contract invocation changed the ledger. It captures:

- **Added entries** — New ledger entries created
- **Modified entries** — Existing entries with changed values
- **Deleted entries** — Entries removed from the ledger
- **Unchanged entries** — Entries accessed but not modified

Think of it as "git diff" for blockchain state.

---

## How State Diffs Work

### Execution Flow

```
1. Initial State (Before)
   └─> Ledger entries configured in mock ledger

2. Contract Invocation
   └─> Contract executes, reading and writing state

3. Final State (After)
   └─> New ledger state after execution completes

4. State Diff Computation
   └─> SoroSim compares before vs after

5. Visualization
   └─> Display changes with color coding
```

### Example: Simple Counter

**Before:**
```json
{
  "type": "ContractData",
  "contract": "CCOUNTER...",
  "key": {"type": "Symbol", "value": "COUNTER"},
  "value": {"type": "U32", "value": 0},
  "durability": "Persistent"
}
```

**Invocation:** `increment()`

**After:**
```json
{
  "type": "ContractData",
  "contract": "CCOUNTER...",
  "key": {"type": "Symbol", "value": "COUNTER"},
  "value": {"type": "U32", "value": 1},
  "durability": "Persistent"
}
```

**State Diff:**
```diff
ContractData: COUNTER
- Before: U32(0)
+ After:  U32(1)
```

---

## State Change Types

### 1. Created (Added)

New ledger entries that didn't exist before.

**Visual Indicator:** Green background, `+` prefix

**Example:**
```diff
+ ContractData: LAST_UPDATED
+ Added: U64(1704067200)
```

**Common Scenarios:**
- First-time storage initialization
- New user registrations
- Creating new token balances
- Adding configuration entries

---

### 2. Modified (Updated)

Existing entries with changed values.

**Visual Indicator:** Yellow background, `~` prefix

**Example:**
```diff
~ ContractData: BALANCE
- Before: I128(1000)
+ After:  I128(1500)
```

**Common Scenarios:**
- Updating counters
- Modifying balances
- Changing configuration
- State transitions

---

### 3. Deleted (Removed)

Entries removed from the ledger.

**Visual Indicator:** Red background, `-` prefix

**Example:**
```diff
- ContractData: TEMP_SESSION
- Deleted: String("session_abc123")
```

**Common Scenarios:**
- Clearing temporary data
- Removing expired entries
- Cleanup operations
- Storage optimization

---

### 4. Unchanged (Read-Only)

Entries accessed but not modified.

**Visual Indicator:** Gray background, `○` prefix

**Example:**
```diff
○ ContractData: ADMIN
○ Value: Address("GADMIN...XYZ")
```

**Why This Matters:**
- Shows footprint (what the contract accessed)
- Helps understand contract dependencies
- Useful for optimization (can reduce to read-only access)

---

## Footprint Model

The **footprint** is the set of all ledger entries a contract accesses during execution. It's divided into two categories:

### Read-Only Footprint

Entries the contract **reads but does not modify**.

**Characteristics:**
- ✅ Lower network fees (read access is cheaper)
- ✅ Better concurrency (multiple contracts can read simultaneously)
- ✅ No state changes

**Example:**
```
Read-Only Footprint:
  • ContractData: ADMIN
  • ContractData: CONFIG
  • Account: GUSER...XYZ
```

---

### Read-Write Footprint

Entries the contract **reads and/or modifies**.

**Characteristics:**
- 💰 Higher network fees (write access costs more)
- 🔒 Serialization required (prevents concurrent writes)
- ✏️ State changes committed to ledger

**Example:**
```
Read-Write Footprint:
  • ContractData: BALANCE
  • ContractData: COUNTER
  • ContractData: LAST_UPDATED
```

---

## Footprint Parsing

SoroSim automatically parses the footprint from contract execution. Here's how it works:

### 1. Contract Declares Access

Soroban contracts must declare which ledger entries they'll access **before execution**. This is done via:

```rust
// Rust example
env.storage().instance().get(&key)  // Adds to footprint
env.storage().persistent().set(&key, &value)  // Read-write access
```

### 2. SoroSim Captures Footprint

During simulation, SoroSim tracks:
- Which entries were accessed
- Whether access was read-only or read-write
- The order of access

### 3. Footprint Validation

SoroSim validates:
- All accessed entries were declared
- No undeclared entries were touched
- Access modes match actual usage

**If validation fails:**
```
❌ Error: Footprint mismatch
   Contract accessed ContractData:BALANCE
   but didn't declare it in footprint
```

### 4. Footprint Analysis

SoroSim computes:

**Total Footprint Size:**
```
Read-Only:  3 entries (1.2 KB)
Read-Write: 2 entries (0.8 KB)
Total:      5 entries (2.0 KB)
```

**Storage Cost Estimate:**
```
Read:  150 stroops
Write: 450 stroops
Total: 600 stroops (0.00006 XLM)
```

---

## State Diff Visualization

### Browser UI

SoroSim's browser interface provides rich visualization:

#### Diff View

```
┌─────────────────────────────────────────┐
│ State Changes (3 entries)               │
├─────────────────────────────────────────┤
│ + ContractData: COUNTER                 │
│   Added: U32(1)                         │
│                                         │
│ ~ ContractData: BALANCE                 │
│   Before: I128(1000)                    │
│   After:  I128(1500)                    │
│                                         │
│ ○ ContractData: ADMIN                   │
│   Value: Address("GADMIN...XYZ")        │
└─────────────────────────────────────────┘
```

#### Tabbed Interface

**Tab 1: Summary**
- Total changes count
- Added/Modified/Deleted breakdown
- Footprint size

**Tab 2: Detailed Diff**
- Entry-by-entry comparison
- ScVal prettification
- Expandable nested structures

**Tab 3: Footprint**
- Read-only entries
- Read-write entries
- Storage cost estimate

**Tab 4: Timeline**
- Chronological access order
- Operation types (read/write)
- Nested invocation tracking

---

### CLI Output

#### Text Mode (Default)

```bash
sorosim simulate --wasm contract.wasm --function transfer ...

✓ Simulation completed

State Changes:
  + ContractData:TO_BALANCE    I128(500)
  ~ ContractData:FROM_BALANCE  I128(1000) → I128(500)
  ~ ContractData:LAST_TX       U64(100) → U64(101)

Footprint:
  Read-Only:  1 entry (ADMIN)
  Read-Write: 3 entries (TO_BALANCE, FROM_BALANCE, LAST_TX)

Storage Cost: ~800 stroops
```

#### JSON Mode

```bash
sorosim simulate ... --output json

{
  "stateChanges": [
    {
      "type": "Created",
      "entry": {
        "type": "ContractData",
        "key": "TO_BALANCE",
        "value": {"type": "I128", "value": "500"}
      }
    },
    {
      "type": "Modified",
      "entry": {
        "type": "ContractData",
        "key": "FROM_BALANCE"
      },
      "before": {"type": "I128", "value": "1000"},
      "after": {"type": "I128", "value": "500"}
    }
  ],
  "footprint": {
    "readOnly": [
      {"type": "ContractData", "key": "ADMIN"}
    ],
    "readWrite": [
      {"type": "ContractData", "key": "TO_BALANCE"},
      {"type": "ContractData", "key": "FROM_BALANCE"},
      {"type": "ContractData", "key": "LAST_TX"}
    ]
  }
}
```

---

## Advanced Features

### 1. Nested Invocation Tracking

When contract A calls contract B, SoroSim tracks state changes separately:

```
Contract A (Caller)
  State Changes:
    + ContractData:CALL_COUNT  U32(1)
  
  ├─> Contract B (Callee)
  │   State Changes:
  │     ~ ContractData:BALANCE  I128(100) → I128(200)
  
  Final Combined State:
    + ContractData:CALL_COUNT  U32(1) [from A]
    ~ ContractData:BALANCE     I128(100) → I128(200) [from B]
```

---

### 2. Durability Transitions

Track changes in storage durability:

```diff
~ ContractData: SESSION_DATA
- Before: "abc123" (Temporary)
+ After:  "abc123" (Persistent)
  Durability upgraded: Temporary → Persistent
```

---

### 3. ScVal Type Changes

Detect when storage values change types:

```diff
~ ContractData: CONFIG
- Before: U32(100)
+ After:  String("enabled")
⚠️  Warning: Type changed (U32 → String)
```

---

### 4. Storage Size Impact

Show how changes affect storage consumption:

```
State Changes Impact:
  Added:    +0.8 KB (2 new entries)
  Modified: ±0 KB (same size)
  Deleted:  -0.3 KB (1 removed entry)
  Net:      +0.5 KB
```

---

## Footprint Optimization

### Minimizing Footprint Size

Smaller footprints = lower fees. Optimize by:

**1. Avoid Unnecessary Reads**

❌ Bad:
```rust
let admin = env.storage().instance().get(&symbol_short!("ADMIN"));
let config = env.storage().instance().get(&symbol_short!("CONFIG"));
// Only admin is used
```

✅ Good:
```rust
let admin = env.storage().instance().get(&symbol_short!("ADMIN"));
// Don't load CONFIG if not needed
```

**2. Use Read-Only Access When Possible**

❌ Bad:
```rust
env.storage().persistent().get(&key)  // Defaults to read-write
```

✅ Good:
```rust
env.storage().persistent().get(&key)  // If not modifying, consider read-only patterns
```

**3. Batch Operations**

❌ Bad:
```rust
for user in users {
    env.storage().persistent().set(&user, &balance);  // Many footprint entries
}
```

✅ Good:
```rust
env.storage().persistent().set(&symbol_short!("BALANCES"), &balances_map);  // Single entry
```

---

## Interpreting State Diffs

### Pattern 1: Balance Transfer

```diff
~ ContractData: Balance(Alice)
- Before: I128(1000)
+ After:  I128(500)

~ ContractData: Balance(Bob)
- Before: I128(500)
+ After:  I128(1000)
```

**Interpretation:** Alice sent 500 tokens to Bob. Net supply unchanged.

---

### Pattern 2: Minting

```diff
+ ContractData: Balance(User)
+ Added: I128(1000)

~ ContractData: TotalSupply
- Before: I128(10000)
+ After:  I128(11000)
```

**Interpretation:** New tokens minted. Supply increased.

---

### Pattern 3: Initialization

```diff
+ ContractData: Admin
+ Added: Address("GADMIN...")

+ ContractData: Initialized
+ Added: Bool(true)

+ ContractData: Config
+ Added: Map({...})
```

**Interpretation:** Contract initialized with admin and config.

---

### Pattern 4: Temporary Storage Cleanup

```diff
- ContractData: TempCache (Temporary)
- Deleted: String("cached_value")

○ ContractData: PermanentData (Persistent)
○ Value: U64(12345)
```

**Interpretation:** Temporary cache expired/cleaned, permanent data intact.

---

## Best Practices

### ✅ Do

- **Review state diffs** after every simulation
- **Verify expected changes** match actual changes
- **Check footprint size** for optimization opportunities
- **Use JSON output** for automated testing
- **Compare diffs** across contract versions

### ❌ Don't

- **Don't ignore unchanged entries** — They indicate dependencies
- **Don't skip footprint analysis** — Affects network fees
- **Don't assume small diffs** — Even one-byte changes matter
- **Don't overlook type changes** — May indicate logic bugs

---

## Common Debugging Scenarios

### Scenario 1: Missing State Change

**Problem:** Expected a balance update but state diff shows no change.

**Debug Steps:**
1. Check if function executed successfully
2. Verify entry exists in mock ledger
3. Confirm correct storage key
4. Review contract logic for conditional writes

---

### Scenario 2: Unexpected Deletion

**Problem:** State diff shows entry deleted unexpectedly.

**Debug Steps:**
1. Check for explicit `remove()` calls
2. Look for temporary storage expiration
3. Review cleanup logic
4. Verify durability settings

---

### Scenario 3: Large Footprint

**Problem:** Footprint size is larger than expected.

**Debug Steps:**
1. Identify all accessed entries
2. Check for unnecessary reads
3. Look for iteration over large collections
4. Consider batching or pagination

---

## Related Concepts

- **[Ledger Entries](/docs/concepts/ledger-entries)** — What state diffs track
- **[ScVal Types](/docs/concepts/scval-types)** — How values are represented
- **[Simulation vs Execution](/docs/concepts/simulation-vs-execution)** — When state diffs apply
- **[Mock Ledger Guide](/docs/guides/mock-ledger)** — Configuring initial state

---

## Examples by Contract Type

### Token Contract

```diff
Transfer Function:
  ~ Balance(from)  I128(1000) → I128(500)
  ~ Balance(to)    I128(0) → I128(500)
  + LastTx         U64(123456)
```

### Voting Contract

```diff
Vote Function:
  + Vote(proposalId, voter)  Bool(true)
  ~ VoteCount(proposalId)    U32(10) → U32(11)
  ○ Proposal(proposalId)     Map({...})
```

### NFT Contract

```diff
Mint Function:
  + Owner(tokenId)     Address("GUSER...")
  + Metadata(tokenId)  String("ipfs://...")
  ~ NextTokenId        U32(5) → U32(6)
```

---

## Need Help?

- 📖 **Next**: [Mock Ledger Configuration Guide](/docs/guides/mock-ledger)
- 💬 **Discord**: [Ask about state diffs](https://discord.gg/stellar)
- 🔍 **Examples**: [State diff patterns repository](https://github.com/sorosim/examples/state-diffs)
