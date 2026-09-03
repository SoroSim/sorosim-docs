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
