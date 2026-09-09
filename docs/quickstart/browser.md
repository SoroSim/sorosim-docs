# Browser Quickstart

Get started with SoroSim in your browser — no installation required. This guide walks you through uploading a WASM contract, configuring mock ledger state, and running your first simulation in under 5 minutes.

## Prerequisites

- A compiled Soroban contract (`.wasm` file)
- Basic understanding of Soroban smart contracts
- A modern web browser (Chrome, Firefox, Safari, or Edge)

:::tip Don't have a WASM file?
Download one of our [sample contracts](/docs/contracts/overview) to follow along, or use the built-in examples in the SoroSim sandbox.
:::

## Step 1: Access the Sandbox

Navigate to the SoroSim browser sandbox:

```
https://app.sorosim.dev
```

You'll see the main interface with three panels:
- **Left**: Contract management and configuration
- **Center**: Function invocation and parameters
- **Right**: Results and state inspector

## Step 2: Upload Your Contract

### Option A: Upload WASM File

1. Click the **"Upload Contract"** button in the top-left corner
2. Select your `.wasm` file from your local filesystem
3. Give your contract a friendly name (e.g., `my_token_contract`)
4. Click **"Load Contract"**

SoroSim will parse the WASM and extract all exported functions automatically.

### Option B: Use a Sample Contract

1. Click **"Load Sample"** in the contract panel
2. Choose from pre-loaded examples:
   - **Hello World** — Simple greeting contract
   - **Token** — Stellar Asset Contract (SAC) implementation
   - **Counter** — Increment/decrement with persistent storage
   - **Voting** — Multi-option voting with auth
3. Click **"Load"**

## Step 3: Configure Mock Ledger State

Before invoking contract functions, you may need to set up initial ledger state.

### Understanding Ledger Entries

Soroban contracts interact with three main types of ledger entries:
- **Account** — Stellar account balances and authentication
- **ContractData** — Persistent and temporary contract storage
- **ContractCode** — WASM bytecode for deployed contracts

:::info Learn More
See [Soroban Ledger Entries](/docs/concepts/ledger-entries) for a detailed explanation of each type.
:::

### Adding Mock Data

1. Click **"Configure Ledger"** in the left panel
2. Click **"+ Add Entry"**
3. Select the entry type:
   - **Account**: For testing auth or balance checks
   - **ContractData**: For pre-populating contract storage
   - **ContractCode**: For multi-contract scenarios
4. Fill in the entry details using the form
5. Click **"Save Entry"**

### Example: Setting Up Initial Storage

For a counter contract, you might add:

```json
{
  "type": "ContractData",
  "contract": "CCURRENT_CONTRACT",
  "key": {
    "type": "Symbol",
    "value": "COUNTER"
  },
  "value": {
    "type": "U32",
    "value": 0
  },
  "durability": "Persistent"
}
```

:::tip Auto-Populate
Many contracts work without pre-configured state. Try invoking first — SoroSim will show you which entries are missing if needed.
:::

## Step 4: Invoke a Contract Function

Now let's execute a contract function:

1. In the center panel, select a function from the dropdown (e.g., `increment`)
2. Fill in any required parameters:
   - SoroSim provides type-aware input fields based on the function signature
   - For complex types (Vec, Map, Struct), use the JSON editor
3. Click **"Simulate Invocation"**

### Parameter Input Examples

**Simple types:**
```
u32: 42
i64: -100
bool: true
symbol: "TOKEN"
address: GABC...XYZ (Stellar address or contract ID)
```

**Complex types (JSON):**
```json
{
  "type": "Vec",
  "value": [
    {"type": "U32", "value": 1},
    {"type": "U32", "value": 2},
    {"type": "U32", "value": 3}
  ]
}
```

---

## Code Examples: Common Browser Operations

### Example 1: Token Contract Deployment and Initialization

This example demonstrates uploading a token contract and initializing it with admin credentials.

**Step 1: Upload the WASM**
- Click **"Upload Contract"** and select your `token.wasm` file
- Name it: `my_token`
- Click **"Load Contract"**

**Step 2: Initialize the Token**

Select the `initialize` function and provide these parameters:

```json
{
  "admin": {
    "type": "Address",
    "value": "GADMIN5Y7ZQFWKJQXJXJXJXJXJXJXJXJXJXJXJXJXJXJXJXJXJXJX"
  },
  "name": {
    "type": "String",
    "value": "MyToken"
  },
  "symbol": {
    "type": "String",
    "value": "MYTK"
  },
  "decimals": {
    "type": "U32",
    "value": 7
  }
}
```

**Expected Output:**

```
✓ Invocation Successful

Return Value: Void

Events:
  1. Topic: [Symbol("initialize")]
     Data: [String("MyToken"), String("MYTK"), U32(7)]

CPU Usage: 15,420 instructions
Memory: 2.3 KB

State Changes:
+ ContractData: TokenName
  Added: String("MyToken")

+ ContractData: TokenSymbol
  Added: String("MYTK")

+ ContractData: Decimals
  Added: U32(7)

+ ContractData: Admin
  Added: Address("GADMIN5Y7...")
```

### Example 2: Token Minting and Balance Check

This example shows how to mint tokens and verify the balance.

**Step 1: Mint Tokens**

With authorization configured (add admin address in the Auth panel), select the `mint` function:

```json
{
  "to": {
    "type": "Address",
    "value": "GUSER2ABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJK"
  },
  "amount": {
    "type": "I128",
    "value": "1000000000"
  }
}
```

**Auth Configuration (in Auth Panel):**
```json
{
  "address": "GADMIN5Y7ZQFWKJQXJXJXJXJXJXJXJXJXJXJXJXJXJXJXJXJXJXJX",
  "credentials": {
    "type": "SourceAccount"
  }
}
```

**Expected Output:**

```
✓ Invocation Successful

Return Value: Void

Events:
  1. Topic: [Symbol("mint"), Address("GUSER2ABC...")]
     Data: [Address("GUSER2ABC..."), I128(1000000000)]

CPU Usage: 18,650 instructions
Memory: 3.1 KB

State Changes:
+ ContractData: Balance(GUSER2ABC...)
  Added: I128(1000000000)

~ ContractData: TotalSupply
  Before: I128(0)
  After: I128(1000000000)
```

**Step 2: Check Balance**

Select the `balance` function:

```json
{
  "id": {
    "type": "Address",
    "value": "GUSER2ABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJK"
  }
}
```

**Expected Output:**

```
✓ Invocation Successful

Return Value: I128(1000000000)

CPU Usage: 8,200 instructions
Memory: 1.2 KB

Footprint:
Read-Only Entries:
  • ContractData: Balance(GUSER2ABC...)
```

### Example 3: Cross-Contract Call with State Inspection

This example demonstrates calling one contract from another and inspecting the resulting state changes.

**Prerequisites:**
- Upload two contracts: `caller.wasm` (name: `caller`) and `callee.wasm` (name: `callee`)
- Deploy the callee contract and note its contract ID: `CCALLEE7XYZXYZXYZXYZXYZXYZXYZXYZXYZXYZXYZXYZXYZXYZ`

**Step 1: Configure Ledger with Deployed Contract**

Add this ledger entry to register the callee contract:

```json
{
  "type": "ContractCode",
  "hash": "a1b2c3d4e5f6789...",
  "wasm": "callee.wasm"
}
```

**Step 2: Invoke Cross-Contract Function**

In the `caller` contract, select the `invoke_callee` function:

```json
{
  "callee_id": {
    "type": "Address",
    "value": "CCALLEE7XYZXYZXYZXYZXYZXYZXYZXYZXYZXYZXYZXYZXYZXYZ"
  },
  "method": {
    "type": "Symbol",
    "value": "increment"
  },
  "args": {
    "type": "Vec",
    "value": [
      {"type": "U32", "value": 5}
    ]
  }
}
```

**Expected Output:**

```
✓ Invocation Successful

Return Value: U32(5)

Events:
  1. Topic: [Symbol("cross_call"), Address("CCALLEE7...")]
     Data: [Symbol("increment"), U32(5)]
  
  2. Topic: [Symbol("increment_called")]
     Data: [U32(0), U32(5)]
     Contract: CCALLEE7...

CPU Usage: 24,800 instructions
Memory: 4.7 KB

State Changes (Multi-Contract):

caller Contract:
  + ContractData: LastCallResult
    Added: U32(5)

callee Contract:
  ~ ContractData: Counter
    Before: U32(0)
    After: U32(5)

Footprint:
Read-Write Entries:
  • ContractData: Counter (callee)
  • ContractData: LastCallResult (caller)

Read-Only Entries:
  • ContractCode: CCALLEE7...
```

**State Inspector View:**

The State Inspector tab shows a detailed comparison:

```diff
Contract: caller (CCALLER...)
==================================
+ ContractData: LastCallResult
  Type: U32
  Value: 5
  Durability: Temporary
  Cost: ~12 stroops

Contract: callee (CCALLEE7...)
==================================
~ ContractData: Counter
  - Before: U32(0)
  + After:  U32(5)
  Type: U32
  Durability: Persistent
  Cost: ~45 stroops
```

:::tip Pro Tip
Use the **"Export State"** button to save the final state as a JSON file. You can then use it as the initial state for subsequent test scenarios or in CI/CD pipelines with the [SoroSim CLI](/docs/quickstart/cli).
:::

### Example 4: Testing Transfer with Insufficient Balance (Error Scenario)

This example shows how SoroSim helps you test error conditions and edge cases.

**Scenario:** Alice tries to transfer more tokens than she has.

**Step 1: Set Up Initial State**

Configure the ledger with Alice's balance:

```json
{
  "type": "ContractData",
  "contract": "CURRENT_CONTRACT",
  "key": {
    "type": "Vec",
    "value": [
      {"type": "Symbol", "value": "Balance"},
      {"type": "Address", "value": "GALICE3ABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGH"}
    ]
  },
  "value": {
    "type": "I128",
    "value": "100"
  },
  "durability": "Persistent"
}
```

**Step 2: Attempt Transfer**

Select the `transfer` function:

```json
{
  "from": {
    "type": "Address",
    "value": "GALICE3ABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGH"
  },
  "to": {
    "type": "Address",
    "value": "GBOB456ABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHI"
  },
  "amount": {
    "type": "I128",
    "value": "500"
  }
}
```

**Expected Output:**

```
✗ Invocation Failed

Error: Contract error
Code: 10 (InsufficientBalance)
Message: "insufficient balance for transfer"

Events Before Failure:
  1. Topic: [Symbol("transfer_attempt")]
     Data: [Address("GALICE3..."), Address("GBOB456..."), I128(500)]

CPU Usage: 12,100 instructions (before panic)
Memory: 2.8 KB

State Changes: None (rolled back)

Debug Info:
  Balance available: I128(100)
  Amount requested: I128(500)
  Deficit: I128(400)
```

:::info Testing Best Practice
Always test failure scenarios! SoroSim makes it easy to verify that your contract properly handles insufficient balances, unauthorized access, and invalid inputs before deploying to testnet.
:::

### Example 5: NFT Minting with Metadata

This example demonstrates working with complex data structures in an NFT contract.

**Step 1: Mint NFT**

Select the `mint` function in your NFT contract:

```json
{
  "to": {
    "type": "Address",
    "value": "GCOLLECTOR789ABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABC"
  },
  "token_id": {
    "type": "U64",
    "value": "1"
  },
  "metadata": {
    "type": "Map",
    "value": [
      {
        "key": {"type": "Symbol", "value": "name"},
        "val": {"type": "String", "value": "Stellar Punk #001"}
      },
      {
        "key": {"type": "Symbol", "value": "description"},
        "val": {"type": "String", "value": "Rare collectible NFT"}
      },
      {
        "key": {"type": "Symbol", "value": "image"},
        "val": {"type": "String", "value": "ipfs://QmX7Y8Z9..."}
      },
      {
        "key": {"type": "Symbol", "value": "attributes"},
        "val": {
          "type": "Vec",
          "value": [
            {
              "type": "Map",
              "value": [
                {
                  "key": {"type": "Symbol", "value": "trait_type"},
                  "val": {"type": "String", "value": "Background"}
                },
                {
                  "key": {"type": "Symbol", "value": "value"},
                  "val": {"type": "String", "value": "Purple"}
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```

**Expected Output:**

```
✓ Invocation Successful

Return Value: U64(1)

Events:
  1. Topic: [Symbol("mint"), Address("GCOLLECTOR789..."), U64(1)]
     Data: [Map(metadata)]

  2. Topic: [Symbol("transfer"), Address("null"), Address("GCOLLECTOR789...")]
     Data: [U64(1)]

CPU Usage: 32,500 instructions
Memory: 8.4 KB

State Changes:
+ ContractData: TokenOwner(1)
  Added: Address("GCOLLECTOR789...")

+ ContractData: TokenMetadata(1)
  Added: Map({
    "name": "Stellar Punk #001",
    "description": "Rare collectible NFT",
    "image": "ipfs://QmX7Y8Z9...",
    "attributes": [...]
  })

+ ContractData: TotalSupply
  Before: U64(0)
  After: U64(1)

Storage Cost Estimate:
  Persistent entries: 3
  Estimated fee: ~340 stroops
  TTL: 535,680 ledgers (~31 days)
```

### Example 6: DeFi Liquidity Pool - Add Liquidity

This example shows a realistic DeFi scenario with multiple token interactions.

**Prerequisites:**
- Token A balance: 10,000 units
- Token B balance: 5,000 units
- Pool exists but is empty

**Step 1: Configure Initial Balances**

Add these ledger entries:

```json
[
  {
    "type": "ContractData",
    "contract": "CTOKEN_A_CONTRACT_ID",
    "key": {
      "type": "Vec",
      "value": [
        {"type": "Symbol", "value": "Balance"},
        {"type": "Address", "value": "GLIQPROVIDER123..."}
      ]
    },
    "value": {"type": "I128", "value": "10000000000"},
    "durability": "Persistent"
  },
  {
    "type": "ContractData",
    "contract": "CTOKEN_B_CONTRACT_ID",
    "key": {
      "type": "Vec",
      "value": [
        {"type": "Symbol", "value": "Balance"},
        {"type": "Address", "value": "GLIQPROVIDER123..."}
      ]
    },
    "value": {"type": "I128", "value": "5000000000"},
    "durability": "Persistent"
  }
]
```

**Step 2: Add Liquidity**

In the liquidity pool contract, select `add_liquidity`:

```json
{
  "sender": {
    "type": "Address",
    "value": "GLIQPROVIDER123ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  },
  "amount_a": {
    "type": "I128",
    "value": "1000000000"
  },
  "amount_b": {
    "type": "I128",
    "value": "500000000"
  },
  "min_liquidity": {
    "type": "I128",
    "value": "0"
  }
}
```

**Expected Output:**

```
✓ Invocation Successful

Return Value: I128(707106781) // LP tokens minted (sqrt of product)

Events:
  1. Topic: [Symbol("transfer"), Address("GLIQPROVIDER123..."), Address("CPOOL...")]
     Data: [Address("CTOKEN_A..."), I128(1000000000)]
     Contract: Token A

  2. Topic: [Symbol("transfer"), Address("GLIQPROVIDER123..."), Address("CPOOL...")]
     Data: [Address("CTOKEN_B..."), I128(500000000)]
     Contract: Token B

  3. Topic: [Symbol("add_liquidity"), Address("GLIQPROVIDER123...")]
     Data: [I128(1000000000), I128(500000000), I128(707106781)]
     Contract: Pool

  4. Topic: [Symbol("mint"), Address("GLIQPROVIDER123...")]
     Data: [I128(707106781)]
     Contract: LP Token

CPU Usage: 48,720 instructions
Memory: 12.6 KB

State Changes (Multi-Contract):

Token A Contract:
  ~ Balance(GLIQPROVIDER123...)
    Before: I128(10000000000)
    After:  I128(9000000000)
  
  + Balance(CPOOL...)
    Added: I128(1000000000)

Token B Contract:
  ~ Balance(GLIQPROVIDER123...)
    Before: I128(5000000000)
    After:  I128(4500000000)
  
  + Balance(CPOOL...)
    Added: I128(500000000)

Pool Contract:
  ~ ReserveA
    Before: I128(0)
    After:  I128(1000000000)
  
  ~ ReserveB
    Before: I128(0)
    After:  I128(500000000)
  
  + TotalShares
    Added: I128(707106781)
  
  + Shares(GLIQPROVIDER123...)
    Added: I128(707106781)

Total Storage Cost: ~890 stroops
```

:::tip Real-World Testing
This multi-contract example shows SoroSim's power for testing complex DeFi interactions. You can verify that:
- Tokens are transferred correctly between accounts and pools
- LP tokens are calculated and minted accurately
- All state changes are atomic (all succeed or all fail)
- Storage costs are reasonable before deploying
:::

---

## Step 5: Inspect the Results

After simulation completes, the right panel displays:

### Invocation Result
- **Success/Failure status**
- **Return value** (prettified ScVal)
- **CPU/Memory usage** metrics
- **Event logs** emitted by the contract

### State Changes
The **State Diff** tab shows:
- **Before/After comparison** for all modified ledger entries
- **Added entries** (green highlight)
- **Modified entries** (yellow highlight)
- **Deleted entries** (red highlight)

### Example State Diff

```diff
ContractData: COUNTER
- Before: U32(0)
+ After:  U32(1)

ContractData: LAST_UPDATED
+ Added:  U64(1704067200)
```

### Footprint Analysis
The **Footprint** tab shows:
- **Read-only entries** — data accessed but not modified
- **Read-write entries** — data that was modified
- **Storage cost estimate** — expected fees for this invocation

## Step 6: Iterate and Refine

Continue testing by:

1. **Chaining invocations**: The ledger state persists between calls in the same session
2. **Modifying parameters**: Test different inputs and edge cases
3. **Adjusting mock state**: Add, modify, or remove ledger entries
4. **Comparing results**: Use the history panel to review previous invocations

### Example Workflow: Testing a Token Contract

```
1. Invoke initialize(admin, name, symbol)
   → Check: Admin is set correctly

2. Invoke mint(to, amount)
   → Inspect: New balance entry created

3. Invoke transfer(from, to, amount)
   → Compare: Balance entries updated correctly

4. Invoke balance(address)
   → Verify: Return value matches state diff
```

## Step 7: Save Your Session

To preserve your work:

1. Click **"Save Session"** in the top-right
2. Choose a name for your session
3. Download the `.sorosim` file

Later, you can **"Load Session"** to restore:
- All uploaded contracts
- Mock ledger configuration
- Invocation history

:::tip CI/CD Integration
Export your session and use it in automated tests with the [SoroSim CLI](/docs/quickstart/cli).
:::

## Common Use Cases

### 🧪 Rapid Prototyping
Upload a contract, invoke functions, see results — no deployment overhead.

### 🐛 Debugging State Issues
Reproduce a bug by configuring exact ledger state, then step through invocations to identify the issue.

### ✅ Pre-Deployment Validation
Test all contract functions with realistic data before committing to testnet deployment.

### 🔄 Cross-Contract Testing
Load multiple WASMs and simulate contracts calling each other (see [Cross-Contract Guide](/docs/guides/cross-contract)).

## Troubleshooting

### Contract Won't Upload
- **Check file format**: Must be a valid `.wasm` file compiled with `soroban-sdk`
- **Verify version compatibility**: SoroSim supports Soroban SDK v20.0.0+
- **File size limit**: Maximum 1MB per WASM file

### Function Invocation Fails
- **Missing ledger entries**: Check the error message for required state
- **Invalid parameters**: Verify parameter types match function signature
- **Auth required**: Add auth context in the auth panel (see [Auth Guide](/docs/guides/auth-context))

### State Diff Not Showing Changes
- **Contract didn't modify storage**: Some functions are read-only
- **Temporary storage**: Check the "Temporary" durability filter
- **Simulation failed**: Check the invocation result for errors

## What's Next?

Now that you've run your first simulation, explore:

- **[CLI Quickstart](/docs/quickstart/cli)** — Automate simulations from the command line
- **[Mock Ledger Guide](/docs/guides/mock-ledger)** — Advanced ledger configuration patterns
- **[Cross-Contract Invocations](/docs/guides/cross-contract)** — Test contracts calling other contracts
- **[ScVal Types](/docs/concepts/scval-types)** — Understand Soroban value types in depth

## Need Help?

- 💬 **Discord**: [Join the SoroSim community](https://discord.gg/stellar)
- 🐛 **Issues**: [Report bugs on GitHub](https://github.com/sorosim/sorosim/issues)
- 📖 **Docs**: [Browse all guides](/docs/guides/mock-ledger)
- 🎥 **Video Tutorial**: [Watch the browser quickstart walkthrough](https://youtube.com/sorosim)
