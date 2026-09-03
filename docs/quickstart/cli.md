# CLI Quickstart

The SoroSim CLI brings contract simulation to your terminal and CI/CD pipelines. This guide covers installation, basic usage, and your first automated simulation.

## Prerequisites

- **Node.js** 18.0 or later (check with `node --version`)
- A compiled Soroban contract (`.wasm` file)
- Basic command-line familiarity

:::tip Alternative: Use npx
Skip installation and run directly with `npx sorosim-cli` for one-off simulations.
:::

## Installation

### Option 1: Global Installation (Recommended)

Install the SoroSim CLI globally to use it from anywhere:

```bash
npm install -g sorosim-cli
```

Verify installation:

```bash
sorosim --version
```

You should see output like:

```
sorosim v0.3.0
```

### Option 2: Local Project Installation

Install as a dev dependency in your project:

```bash
npm install --save-dev sorosim-cli
```

Then use via npx or npm scripts:

```bash
npx sorosim --version
```

### Option 3: Use Without Installation

Run directly with npx (no installation needed):

```bash
npx sorosim-cli@latest --version
```

## Quick Start: Your First Simulation

Let's simulate a simple contract invocation:

### 1. Navigate to Your Contract Directory

```bash
cd /path/to/your/soroban-project
```

### 2. Build Your Contract (if needed)

```bash
soroban contract build
```

This generates a `.wasm` file in `target/wasm32-unknown-unknown/release/`

### 3. Run a Basic Simulation

```bash
sorosim simulate \
  --wasm target/wasm32-unknown-unknown/release/my_contract.wasm \
  --function increment \
  --args '[]'
```

**Output:**

```
✓ Contract loaded: my_contract.wasm
✓ Function: increment
✓ Simulation completed in 45ms

Result: U32(1)

State Changes:
  + ContractData:COUNTER  U32(0) → U32(1)

CPU: 12,450 instructions
Memory: 2.1 KB
```

## CLI Commands Overview

### `simulate` — Run a Contract Invocation

Simulate a single contract function call:

```bash
sorosim simulate \
  --wasm <path-to-wasm> \
  --function <function-name> \
  --args <json-array> \
  [options]
```

**Common Options:**

| Option | Description | Example |
|--------|-------------|---------|
| `--wasm, -w` | Path to WASM file (required) | `--wasm contract.wasm` |
| `--function, -f` | Function name to invoke (required) | `--function transfer` |
| `--args, -a` | JSON array of arguments | `--args '[{"type":"U32","value":100}]'` |
| `--ledger, -l` | Path to mock ledger JSON | `--ledger state.json` |
| `--output, -o` | Output format: `text`, `json` | `--output json` |
| `--save-state` | Save resulting state to file | `--save-state result.json` |

### `init` — Create a New Session

Initialize a simulation session with configuration:

```bash
sorosim init
```

This creates a `sorosim.config.json` file:

```json
{
  "contracts": [
    {
      "name": "my_contract",
      "wasm": "./target/wasm32-unknown-unknown/release/my_contract.wasm"
    }
  ],
  "ledger": {
    "entries": []
  }
}
```

### `inspect` — Analyze a WASM Contract

View contract metadata and exported functions:

```bash
sorosim inspect --wasm contract.wasm
```

**Output:**

```
Contract: my_contract.wasm
Size: 248 KB
SDK Version: 20.5.0

Exported Functions:
  • initialize(admin: Address, name: String, symbol: String) → ()
  • mint(to: Address, amount: I128) → ()
  • transfer(from: Address, to: Address, amount: I128) → ()
  • balance(address: Address) → I128
```

### `validate` — Run Test Suite

Execute a simulation test suite:

```bash
sorosim validate --suite tests/simulation-suite.json
```

## Working with Arguments

SoroSim uses JSON to represent Soroban ScVal types.

### Simple Types

```bash
# U32
--args '[{"type":"U32","value":42}]'

# String/Symbol
--args '[{"type":"Symbol","value":"TOKEN"}]'

# Address
--args '[{"type":"Address","value":"GABC...XYZ"}]'

# Boolean
--args '[{"type":"Bool","value":true}]'
```

### Complex Types

```bash
# Vec (array)
--args '[{"type":"Vec","value":[{"type":"U32","value":1},{"type":"U32","value":2}]}]'

# Map
--args '[{"type":"Map","value":[{"key":{"type":"Symbol","value":"amount"},"val":{"type":"U32","value":100}}]}]'
```

:::tip Arguments File
For complex arguments, use a JSON file:
```bash
sorosim simulate -w contract.wasm -f transfer --args-file args.json
```
:::

## Configuring Mock Ledger State

### Inline Ledger Configuration

Pass ledger state via JSON file:

**ledger.json:**
```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "COUNTER"},
      "value": {"type": "U32", "value": 10},
      "durability": "Persistent"
    },
    {
      "type": "Account",
      "accountId": "GABC...XYZ",
      "balance": "1000000000",
      "seqNum": "100"
    }
  ]
}
```

**Usage:**
```bash
sorosim simulate \
  --wasm contract.wasm \
  --function increment \
  --ledger ledger.json
```

### Chaining Simulations

Save state after first invocation, then use it for the next:

```bash
# First call
sorosim simulate \
  -w contract.wasm \
  -f initialize \
  --args '[{"type":"Address","value":"ADMIN"}]' \
  --save-state state1.json

# Second call (uses state from first)
sorosim simulate \
  -w contract.wasm \
  -f mint \
  --args '[{"type":"Address","value":"USER"},{"type":"U32","value":1000}]' \
  --ledger state1.json \
  --save-state state2.json
```

## Output Formats

### Text Output (Default)

Human-readable format for terminal use:

```bash
sorosim simulate -w contract.wasm -f balance --args '[...]'
```

```
✓ Simulation completed

Result: U32(1000)

State Changes:
  • ContractData:BALANCE  U32(500) → U32(1000)

CPU: 8,200 instructions
Memory: 1.4 KB
```

### JSON Output

Machine-readable format for CI/CD and scripting:

```bash
sorosim simulate -w contract.wasm -f balance --args '[...]' --output json
```

```json
{
  "success": true,
  "result": {
    "type": "U32",
    "value": 1000
  },
  "stateChanges": [
    {
      "type": "ContractData",
      "key": "BALANCE",
      "before": {"type": "U32", "value": 500},
      "after": {"type": "U32", "value": 1000}
    }
  ],
  "metrics": {
    "cpuInstructions": 8200,
    "memoryBytes": 1434
  }
}
```

## CI/CD Integration

### GitHub Actions Example

Add SoroSim validation to your CI pipeline:

**.github/workflows/contract-tests.yml:**
```yaml
name: Contract Simulation Tests

on: [push, pull_request]

jobs:
  simulate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Soroban CLI
        run: |
          cargo install --locked soroban-cli
      
      - name: Build Contract
        run: soroban contract build
      
      - name: Install SoroSim CLI
        run: npm install -g sorosim-cli
      
      - name: Run Simulations
        run: |
          sorosim simulate \
            -w target/wasm32-unknown-unknown/release/my_contract.wasm \
            -f initialize \
            --args '[{"type":"Address","value":"ADMIN"}]' \
            --save-state state.json
          
          sorosim simulate \
            -w target/wasm32-unknown-unknown/release/my_contract.wasm \
            -f test_function \
            --ledger state.json \
            --output json > result.json
      
      - name: Validate Results
        run: |
          # Check simulation succeeded
          if ! jq -e '.success == true' result.json; then
            echo "Simulation failed"
            exit 1
          fi
```

:::tip Full CI Guide
See the [CI Integration Guide](/docs/guides/ci-integration) for comprehensive pipeline examples.
:::

### npm Scripts Integration

Add simulation commands to your `package.json`:

```json
{
  "scripts": {
    "build": "soroban contract build",
    "simulate": "sorosim simulate -w target/wasm32-unknown-unknown/release/my_contract.wasm -f increment",
    "simulate:full": "npm run build && npm run simulate",
    "test:simulate": "sorosim validate --suite tests/simulations.json"
  }
}
```

Then run:

```bash
npm run simulate:full
```

## Advanced Usage

### Multi-Contract Simulation

Simulate contracts calling each other:

```bash
sorosim simulate \
  --wasm caller.wasm \
  --function call_other \
  --contracts '{"callee":"CCALLEE_CONTRACT_ID"}' \
  --contract-wasms '{"CCALLEE_CONTRACT_ID":"callee.wasm"}'
```

### Auth Context Simulation

Spoof authorization for testing:

```bash
sorosim simulate \
  --wasm contract.wasm \
  --function transfer \
  --args '[...]' \
  --auth '{"address":"GUSER...","signatureExpirationLedger":1000}'
```

### Verbose Debugging

Enable detailed output for troubleshooting:

```bash
sorosim simulate \
  --wasm contract.wasm \
  --function my_function \
  --verbose
```

## Troubleshooting

### Command Not Found

**Error:**
```
sorosim: command not found
```

**Solution:**
- Verify installation: `npm list -g sorosim-cli`
- Use npx: `npx sorosim-cli` instead
- Check PATH includes npm global bin directory

### Invalid WASM File

**Error:**
```
Error: Failed to load WASM: invalid magic number
```

**Solution:**
- Rebuild contract: `soroban contract build`
- Verify file path is correct
- Ensure WASM is compiled with Soroban SDK v20.0.0+

### Simulation Failed with Auth Error

**Error:**
```
Error: Authorization required for function call
```

**Solution:**
- Add `--auth` flag with signer context
- See [Auth Context Guide](/docs/guides/auth-context) for details

## What's Next?

Now that you're familiar with the CLI basics:

- **[Mock Ledger Configuration](/docs/guides/mock-ledger)** — Advanced state setup patterns
- **[CI Integration Guide](/docs/guides/ci-integration)** — Comprehensive pipeline examples
- **[Full CLI Reference](/docs/cli/commands)** — Complete command documentation
- **[Session Snapshots](/docs/guides/snapshots)** — Save and reuse simulation sessions

## Need Help?

- 📖 **Full CLI Docs**: [Command Reference](/docs/cli/commands)
- 💬 **Discord**: [Join the community](https://discord.gg/stellar)
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/sorosim/sorosim-cli/issues)
- 💡 **Examples**: [GitHub Examples Repository](https://github.com/sorosim/examples)
