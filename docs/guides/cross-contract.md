# Cross-Contract Invocation Guide

Cross-contract invocations are a powerful feature of Soroban, allowing contracts to call other contracts. This guide explains how to simulate multi-contract scenarios in SoroSim, from simple calls to complex dependency chains.

## What are Cross-Contract Invocations?

A **cross-contract invocation** occurs when one contract calls a function on another deployed contract. This enables:

- **Contract composition** — Build complex systems from smaller contracts
- **Code reuse** — Shared libraries and utilities
- **Protocol integration** — Interact with existing protocols (DEXs, oracles, tokens)
- **Upgradeable patterns** — Proxy contracts delegating to implementation contracts

**Example:**
```
DeFi Contract → Token Contract (transfer)
              → Oracle Contract (get_price)
              → Liquidity Pool (swap)
```

---

## How Cross-Contract Calls Work

### In Production (Testnet/Mainnet)

1. Contract A invokes Contract B by its deployed address
2. Soroban VM locates Contract B's WASM bytecode
3. Contract B executes with its own storage context
4. Result returns to Contract A
5. State changes commit to both contracts' storage

### In SoroSim

1. You upload WASM for Contract A (the caller)
2. You provide WASM for Contract B (the callee)
3. You configure mock ledger with both contracts' state
4. SoroSim simulates the full invocation chain
5. State diff shows changes to both contracts

---

## Basic Setup

### Step 1: Prepare Contract WASMs

Build all contracts involved:

```bash
# Build caller contract
cd caller-contract
soroban contract build

# Build callee contract
cd ../callee-contract
soroban contract build
```

**Result:**
- `caller.wasm` — Main contract making cross-contract calls
- `callee.wasm` — Contract being invoked

---

### Step 2: Configure Mock Ledger

Create a configuration with both contracts:

**cross-contract-config.json:**
```json
{
  "entries": [
    {
      "type": "ContractCode",
      "contractId": "CCALLEE123...ABC",
      "hash": "a1b2c3d4e5f6...",
      "wasm": "<base64-encoded-callee.wasm>"
    },
    {
      "type": "ContractData",
      "contract": "CCALLEE123...ABC",
      "key": {"type": "Symbol", "value": "Value"},
      "value": {"type": "U32", "value": 100},
      "durability": "Persistent"
    }
  ]
}
```

**Key Components:**
- `ContractCode` entry — Deploys the callee contract
- `contractId` — The address Contract A will call
- `wasm` — Base64-encoded WASM bytecode
- `ContractData` — Initial state for callee

---

### Step 3: Simulate the Caller

**Browser:**
```
1. Upload caller.wasm
2. Load cross-contract-config.json
3. Select function that calls Contract B
4. Provide Contract B's address in parameters
5. Click "Simulate"
```

**CLI:**
```bash
sorosim simulate \
  --wasm caller.wasm \
  --function invoke_other \
  --ledger cross-contract-config.json \
  --args '[{"type":"Address","value":"CCALLEE123...ABC"}]'
```

---

## Complete Example: Token Transfer via Proxy

### Scenario

A proxy contract that forwards token transfer calls.

### Contract Structure

**Proxy Contract (caller.wasm):**
```rust
pub fn transfer_tokens(
    env: Env,
    token: Address,
    from: Address,
    to: Address,
    amount: i128
) -> Result<(), Error> {
    // Cross-contract call to token contract
    let client = token::Client::new(&env, &token);
    client.transfer(&from, &to, &amount);
    Ok(())
}
```

**Token Contract (token.wasm):**
```rust
pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
    // Standard token transfer logic
    let from_balance = read_balance(&env, from.clone());
    let to_balance = read_balance(&env, to.clone());
    
    write_balance(&env, from, from_balance - amount);
    write_balance(&env, to, to_balance + amount);
}
```

---

### Configuration

**token-proxy-config.json:**
```json
{
  "entries": [
    {
      "type": "ContractCode",
      "contractId": "CTOKEN123...ABC",
      "hash": "token_wasm_hash",
      "wasm": "AGFzbQEAAAABpICAgAABYAN..."
    },
    {
      "type": "ContractData",
      "contract": "CTOKEN123...ABC",
      "key": {
        "type": "Vec",
        "value": [
          {"type": "Symbol", "value": "Balance"},
          {"type": "Address", "value": "GALICE...XYZ"}
        ]
      },
      "value": {"type": "I128", "value": "1000"},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CTOKEN123...ABC",
      "key": {
        "type": "Vec",
        "value": [
          {"type": "Symbol", "value": "Balance"},
          {"type": "Address", "value": "GBOB...DEF"}
        ]
      },
      "value": {"type": "I128", "value": "500"},
      "durability": "Persistent"
    }
  ]
}
```

---

### Simulation

**CLI:**
```bash
sorosim simulate \
  --wasm proxy.wasm \
  --function transfer_tokens \
  --ledger token-proxy-config.json \
  --args '[
    {"type":"Address","value":"CTOKEN123...ABC"},
    {"type":"Address","value":"GALICE...XYZ"},
    {"type":"Address","value":"GBOB...DEF"},
    {"type":"I128","value":"250"}
  ]'
```

---

### Expected Output

```
✓ Simulation completed

Contract: proxy.wasm
  Function: transfer_tokens
  Result: Ok(Void)

Cross-Contract Call:
  → CTOKEN123...ABC.transfer(GALICE..., GBOB..., 250)
  Result: Void

State Changes:
  Contract: CTOKEN123...ABC
    ~ Balance(GALICE)  I128(1000) → I128(750)
    ~ Balance(GBOB)    I128(500) → I128(750)

CPU: 24,800 instructions
Memory: 4.2 KB
```

**Key Observations:**
- Proxy contract had no state changes (just forwarded call)
- Token contract state changed (balances updated)
- Full call chain is visible

---

## Advanced Patterns

### Pattern 1: Chained Cross-Contract Calls

Contract A → Contract B → Contract C

**Example: DEX Router**
```
Router → Token A (transfer_from user to router)
      → Token B (transfer_from router to pool)
      → Pool (swap)
      → Token B (transfer pool to user)
```

**Configuration:**
```json
{
  "entries": [
    {
      "type": "ContractCode",
      "contractId": "CTOKENA...ABC",
      "hash": "...",
      "wasm": "..."
    },
    {
      "type": "ContractCode",
      "contractId": "CTOKENB...DEF",
      "hash": "...",
      "wasm": "..."
    },
    {
      "type": "ContractCode",
      "contractId": "CPOOL...GHI",
      "hash": "...",
      "wasm": "..."
    }
  ]
}
```

**State Diff:**
```
Contract: CTOKENA...ABC
  ~ Balance(User)   I128(1000) → I128(0)
  ~ Balance(Router) I128(0) → I128(1000)

Contract: CTOKENB...DEF
  ~ Balance(Router) I128(0) → I128(950)
  ~ Balance(Pool)   I128(1000) → I128(50)

Contract: CPOOL...GHI
  ~ Reserve(TokenA) I128(10000) → I128(11000)
  ~ Reserve(TokenB) I128(10000) → I128(9050)

Final User Balance:
  Token A: 0 (sent 1000)
  Token B: 950 (received from swap)
```

---

### Pattern 2: Oracle Integration

Contract queries external oracle for data.

**DeFi Contract:**
```rust
pub fn liquidate(env: Env, oracle: Address, position_id: u32) {
    let oracle_client = oracle::Client::new(&env, &oracle);
    let price = oracle_client.get_price(&symbol_short!("XLM"));
    
    // Use price to determine liquidation
    if should_liquidate(price, position_id) {
        // Execute liquidation
    }
}
```

**Mock Oracle Configuration:**
```json
{
  "entries": [
    {
      "type": "ContractCode",
      "contractId": "CORACLE...XYZ",
      "hash": "mock_oracle_hash",
      "wasm": "<base64-mock-oracle-wasm>"
    },
    {
      "type": "ContractData",
      "contract": "CORACLE...XYZ",
      "key": {
        "type": "Vec",
        "value": [
          {"type": "Symbol", "value": "Price"},
          {"type": "Symbol", "value": "XLM"}
        ]
      },
      "value": {
        "type": "Map",
        "value": [
          {"key": {"type": "Symbol", "value": "value"}, "val": {"type": "U64", "value": 50000}},
          {"key": {"type": "Symbol", "value": "timestamp"}, "val": {"type": "U64", "value": 1704067200}}
        ]
      },
      "durability": "Temporary"
    }
  ]
}
```

**Benefits:**
- ✅ Test liquidation logic without real oracle
- ✅ Simulate different price scenarios
- ✅ No dependency on external services

---

### Pattern 3: Factory Pattern

Contract deploys other contracts dynamically.

**Factory Contract:**
```rust
pub fn create_token(env: Env, name: String, symbol: String) -> Address {
    let wasm_hash = env.deployer().upload_contract_wasm(TOKEN_WASM);
    let salt = Bytes::from_array(&env, &[0u8; 32]);
    let token_address = env.deployer().deploy(salt, wasm_hash, ());
    
    // Initialize new token
    let token_client = token::Client::new(&env, &token_address);
    token_client.initialize(&name, &symbol);
    
    token_address
}
```

**Configuration:**
```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "TokenWasm"},
      "value": {"type": "Bytes", "value": "AGFzbQEAAAAB..."},
      "durability": "Persistent"
    }
  ]
}
```

**Simulation Result:**
```
✓ Factory.create_token("MyToken", "MTK")

Cross-Contract Deployment:
  → New contract deployed at: CTOKEN...NEW
  → Initialized with name="MyToken", symbol="MTK"

State Changes:
  Contract: CURRENT_CONTRACT (Factory)
    + TokenRegistry(CTOKEN...NEW)  Map({name: "MyToken", symbol: "MTK"})
  
  Contract: CTOKEN...NEW (Created Token)
    + Metadata  Map({name: "MyToken", symbol: "MTK"})
    + TotalSupply  I128(0)
```

---

### Pattern 4: Library Contracts

Shared utility contracts called by multiple contracts.

**Example: Math Library**
```rust
// Math contract (library)
pub fn safe_mul(env: Env, a: i128, b: i128) -> Result<i128, Error> {
    a.checked_mul(b).ok_or(Error::Overflow)
}

// Main contract (caller)
pub fn calculate(env: Env, math_lib: Address, x: i128, y: i128) -> i128 {
    let math = math::Client::new(&env, &math_lib);
    math.safe_mul(&x, &y)
}
```

**Configuration:**
```json
{
  "entries": [
    {
      "type": "ContractCode",
      "contractId": "CMATHLIB...XYZ",
      "hash": "math_wasm_hash",
      "wasm": "<base64-math-wasm>"
    }
  ]
}
```

---

## Mocking External Contracts

When testing, you often don't want to include real implementations of dependencies. SoroSim supports **mock contracts**.

### Option 1: Minimal Mock WASM

Create a simple contract that returns hardcoded values:

**mock-oracle.rs:**
```rust
#[contract]
pub struct MockOracle;

#[contractimpl]
impl MockOracle {
    pub fn get_price(env: Env, asset: Symbol) -> u64 {
        // Always return fixed price for testing
        50000
    }
}
```

Build and include in configuration:
```json
{
  "type": "ContractCode",
  "contractId": "CORACLE...MOCK",
  "hash": "mock_hash",
  "wasm": "<mock-oracle-wasm-base64>"
}
```

---

### Option 2: State-Based Mock

Don't include WASM, just pre-configure return values:

```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CORACLE...MOCK",
      "key": {"type": "Symbol", "value": "MockPrice"},
      "value": {"type": "U64", "value": 50000},
      "durability": "Temporary"
    }
  ]
}
```

**Note:** This works only if your contract reads storage directly (less common).

---

### Option 3: Test Doubles

Use SoroSim's test double feature (if available):

```bash
sorosim simulate \
  --wasm main.wasm \
  --function my_function \
  --mock-contract "CORACLE...ABC=fixed_return:50000"
```

**Note:** Check SoroSim documentation for test double syntax.

---

## Debugging Cross-Contract Calls

### Enable Verbose Output

**CLI:**
```bash
sorosim simulate \
  --wasm caller.wasm \
  --function my_function \
  --ledger config.json \
  --verbose
```

**Output:**
```
→ caller.wasm::my_function()
  ├─→ CTOKEN...ABC::transfer(from, to, amount)
  │   ├─ Read: Balance(from) = I128(1000)
  │   ├─ Read: Balance(to) = I128(500)
  │   ├─ Write: Balance(from) = I128(750)
  │   ├─ Write: Balance(to) = I128(750)
  │   └─ Return: Void
  └─ Return: Ok(Void)
```

---

### Trace Call Stack

**Browser UI:**
```
Call Stack View:
  1. caller.wasm::transfer_tokens
     ↓
  2. CTOKEN123...ABC::transfer
     ↓
  3. CTOKEN123...ABC::check_balance (internal)
```

---

### Inspect Intermediate State

Use session snapshots to capture state at each call:

```bash
# Simulate with snapshot after each cross-contract call
sorosim simulate \
  --wasm caller.wasm \
  --function complex_operation \
  --ledger config.json \
  --snapshot-each-call
```

**Result:**
```
snapshot-1.json  # State after first cross-contract call
snapshot-2.json  # State after second cross-contract call
snapshot-final.json  # Final state
```

---

## Common Issues & Solutions

### Issue 1: Contract Not Found

**Error:**
```
❌ Error: Contract CCALLEE...ABC not found in ledger
```

**Solution:**
Add `ContractCode` entry:
```json
{
  "type": "ContractCode",
  "contractId": "CCALLEE...ABC",
  "hash": "...",
  "wasm": "..."
}
```

---

### Issue 2: WASM Encoding

**Error:**
```
❌ Error: Invalid WASM bytecode in ContractCode entry
```

**Solution:**
Base64-encode WASM file:
```bash
# Linux/Mac
base64 -w 0 callee.wasm > callee.wasm.base64

# Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("callee.wasm")) > callee.wasm.base64
```

Then use in JSON:
```json
{
  "type": "ContractCode",
  "contractId": "CCALLEE...ABC",
  "wasm": "<paste-base64-here>"
}
```

---

### Issue 3: State Isolation

**Problem:** Changes to callee's state affect other tests.

**Solution:** Use separate configurations or reset state between tests:

```bash
# Test 1
sorosim simulate --ledger base-config.json ...

# Test 2 (fresh state)
sorosim simulate --ledger base-config.json ...
```

Each simulation starts from the configured state.

---

### Issue 4: Circular Dependencies

**Error:**
```
❌ Error: Circular contract invocation detected
   A → B → A
```

**Solution:** Check contract logic for infinite recursion. This is a real bug in your contracts.

---

## Best Practices

### ✅ Do

- **Mock external dependencies** for faster iteration
- **Use realistic contract IDs** (proper C-prefixed addresses)
- **Test cross-contract failures** (simulate callee errors)
- **Document contract interfaces** for mock implementations
- **Version mock contracts** alongside main contracts
- **Test with real contracts** before deployment

### ❌ Don't

- **Don't skip ContractCode entries** — Required for cross-contract calls
- **Don't use invalid addresses** — Must be valid Stellar contract IDs
- **Don't forget callee state** — Both contracts need proper state
- **Don't test only happy paths** — Simulate failures too
- **Don't mock everything** — Test with real contracts when possible

---

## Testing Checklist

When testing cross-contract invocations:

- [ ] Both contracts' WASM included in configuration
- [ ] Contract IDs are valid and consistent
- [ ] Initial state configured for both contracts
- [ ] Function parameters include correct contract addresses
- [ ] Mock contracts return realistic values
- [ ] Error cases tested (callee failures)
- [ ] State diffs verified for both contracts
- [ ] Footprint includes entries from both contracts
- [ ] Auth context configured if needed
- [ ] Performance metrics acceptable

---

## Real-World Example: DEX Swap

Complete example of a DEX router calling multiple contracts.

**Scenario:** User swaps Token A for Token B via a liquidity pool.

**Contracts:**
1. **Router** (router.wasm) — Main entry point
2. **Token A** (tokena.wasm) — Source token
3. **Token B** (tokenb.wasm) — Destination token
4. **Pool** (pool.wasm) — Liquidity pool

**Configuration:** [See full example](https://github.com/sorosim/examples/dex-swap)

**Simulation:**
```bash
sorosim simulate \
  --wasm router.wasm \
  --function swap \
  --ledger dex-config.json \
  --args '[
    {"type":"Address","value":"CTOKENA...ABC"},
    {"type":"Address","value":"CTOKENB...DEF"},
    {"type":"Address","value":"CPOOL...GHI"},
    {"type":"I128","value":"1000"},
    {"type":"I128","value":"950"}
  ]'
```

**Result:** State changes across all 4 contracts visible in one simulation.

---

## Related Guides

- **[Mock Ledger Configuration](/docs/guides/mock-ledger)** — Setting up contract state
- **[Auth Context Simulation](/docs/guides/auth-context)** — Handling cross-contract auth
- **[State Diff Model](/docs/concepts/state-diff)** — Understanding multi-contract state changes
- **[Sample Contracts](/docs/contracts/overview)** — Pre-built contracts for testing

---

## Need Help?

- 💬 **Discord**: [Ask about cross-contract calls](https://discord.gg/stellar)
- 📖 **Examples**: [Cross-contract simulation examples](https://github.com/sorosim/examples/cross-contract)
- 🎥 **Video**: [Cross-contract invocation tutorial](https://youtube.com/sorosim)
