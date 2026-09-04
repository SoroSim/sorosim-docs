# CLI Command Reference

Complete reference for the SoroSim CLI. All commands, flags, options, and examples.

## Installation

```bash
npm install -g sorosim-cli
```

**Version:**
```bash
sorosim --version
# sorosim v0.3.0
```

---

## Global Flags

These flags work with all commands:

| Flag | Short | Description |
|------|-------|-------------|
| `--help` | `-h` | Show help for a command |
| `--version` | `-v` | Show CLI version |
| `--verbose` | | Enable verbose output |
| `--quiet` | `-q` | Suppress non-error output |
| `--no-color` | | Disable colored output |
| `--config <file>` | `-c` | Use config file (default: `sorosim.config.json`) |

**Example:**
```bash
sorosim simulate --help
sorosim --version
sorosim simulate --verbose --wasm contract.wasm --function test
```

---

## Commands

- [`simulate`](#simulate) — Simulate a contract invocation
- [`init`](#init) — Initialize a new configuration
- [`inspect`](#inspect) — Inspect a contract WASM
- [`validate`](#validate) — Run a test suite
- [`replay`](#replay) — Replay a session snapshot
- [`sessions`](#sessions) — Manage saved sessions
- [`diff`](#diff) — Compare snapshots or states
- [`extract`](#extract) — Extract data from snapshots
- [`sanitize`](#sanitize) — Remove sensitive data from snapshots

---

## `simulate`

Simulate a contract function invocation.

### Usage

```bash
sorosim simulate [options]
```

### Options

| Flag | Short | Type | Required | Description |
|------|-------|------|----------|-------------|
| `--wasm <path>` | `-w` | string | Yes | Path to WASM file |
| `--function <name>` | `-f` | string | Yes | Function name to invoke |
| `--args <json>` | `-a` | string | No | JSON array of arguments |
| `--args-file <path>` | | string | No | Path to JSON file with arguments |
| `--ledger <path>` | `-l` | string | No | Path to ledger config JSON |
| `--auth <json>` | | string | No | Auth context JSON |
| `--auth-file <path>` | | string | No | Path to auth config file |
| `--save-state <path>` | | string | No | Save resulting state to file |
| `--save-session <path>` | | string | No | Save complete session snapshot |
| `--output <format>` | `-o` | string | No | Output format: `text` (default), `json`, `yaml` |
| `--contracts <json>` | | string | No | Cross-contract config (contract IDs map) |
| `--contract-wasms <json>` | | string | No | Cross-contract WASM files map |
| `--current-ledger <num>` | | number | No | Current ledger number (for time-based logic) |
| `--network-passphrase <str>` | | string | No | Network passphrase (default: testnet) |

### Examples

**Basic Simulation:**
```bash
sorosim simulate \
  --wasm token.wasm \
  --function balance \
  --args '[{"type":"Address","value":"GUSER...XYZ"}]'
```

**With Ledger State:**
```bash
sorosim simulate \
  --wasm token.wasm \
  --function transfer \
  --ledger initial-state.json \
  --args '[
    {"type":"Address","value":"GALICE..."},
    {"type":"Address","value":"GBOB..."},
    {"type":"I128","value":"500"}
  ]'
```

**With Authorization:**
```bash
sorosim simulate \
  --wasm token.wasm \
  --function mint \
  --args '[{"type":"Address","value":"GUSER..."},{"type":"I128","value":"1000"}]' \
  --auth '{"address":"GADMIN...XYZ"}'
```

**Save State:**
```bash
sorosim simulate \
  --wasm token.wasm \
  --function initialize \
  --args '[{"type":"Address","value":"GADMIN..."}]' \
  --save-state initialized.json
```

**JSON Output:**
```bash
sorosim simulate \
  --wasm contract.wasm \
  --function test \
  --output json > result.json
```

**Complex Args from File:**
```bash
# args.json
{
  "args": [
    {"type": "Address", "value": "GUSER..."},
    {
      "type": "Map",
      "value": [
        {"key": {"type": "Symbol", "value": "amount"}, "val": {"type": "U32", "value": 100}}
      ]
    }
  ]
}

sorosim simulate \
  --wasm contract.wasm \
  --function complex_function \
  --args-file args.json
```

**Cross-Contract Simulation:**
```bash
sorosim simulate \
  --wasm caller.wasm \
  --function call_other \
  --contracts '{"callee":"CCALLEE...ABC"}' \
  --contract-wasms '{"CCALLEE...ABC":"callee.wasm"}' \
  --args '[{"type":"Address","value":"CCALLEE...ABC"}]'
```

---

## `init`

Initialize a new SoroSim configuration file.

### Usage

```bash
sorosim init [options]
```

### Options

| Flag | Short | Type | Description |
|------|-------|------|-------------|
| `--name <name>` | `-n` | string | Project name |
| `--template <type>` | `-t` | string | Template: `basic`, `token`, `nft`, `defi` |
| `--output <path>` | `-o` | string | Output path (default: `sorosim.config.json`) |
| `--force` | `-f` | boolean | Overwrite existing file |

### Examples

**Basic Init:**
```bash
sorosim init
```

Creates `sorosim.config.json`:
```json
{
  "version": "1.0",
  "contracts": [],
  "ledger": {
    "entries": []
  },
  "network": "testnet"
}
```

**With Template:**
```bash
sorosim init --template token --name my_token
```

Creates config with token-specific defaults:
```json
{
  "version": "1.0",
  "name": "my_token",
  "contracts": [
    {
      "name": "token",
      "wasm": "./target/wasm32-unknown-unknown/release/token.wasm"
    }
  ],
  "ledger": {
    "entries": [
      {
        "type": "ContractData",
        "contract": "CURRENT_CONTRACT",
        "key": {"type": "Symbol", "value": "Initialized"},
        "value": {"type": "Bool", "value": false},
        "durability": "Persistent"
      }
    ]
  }
}
```

---

## `inspect`

Inspect a contract WASM file to view metadata and functions.

### Usage

```bash
sorosim inspect [options]
```

### Options

| Flag | Short | Type | Required | Description |
|------|-------|------|----------|-------------|
| `--wasm <path>` | `-w` | string | Yes | Path to WASM file |
| `--output <format>` | `-o` | string | No | Output format: `text` (default), `json` |
| `--functions-only` | | boolean | No | Show only function list |
| `--metadata-only` | | boolean | No | Show only metadata |

### Examples

**Basic Inspection:**
```bash
sorosim inspect --wasm token.wasm
```

**Output:**
```
Contract: token.wasm
Size: 45.2 KB
Hash: a1b2c3d4e5f6...
SDK Version: 20.5.0

Exported Functions (7):
  • initialize(admin: Address, name: String, symbol: String, decimals: U32) → Void
  • mint(to: Address, amount: I128) → Void
  • transfer(from: Address, to: Address, amount: I128) → Void
  • balance(id: Address) → I128
  • approve(owner: Address, spender: Address, amount: I128) → Void
  • burn(from: Address, amount: I128) → Void
  • total_supply() → I128

Contract Metadata:
  rsver: 1.70.0
  soroban-sdk: 20.5.0
```

**JSON Output:**
```bash
sorosim inspect --wasm token.wasm --output json
```

```json
{
  "name": "token.wasm",
  "size": 45678,
  "hash": "a1b2c3d4e5f6...",
  "sdkVersion": "20.5.0",
  "functions": [
    {
      "name": "initialize",
      "parameters": [
        {"name": "admin", "type": "Address"},
        {"name": "name", "type": "String"},
        {"name": "symbol", "type": "String"},
        {"name": "decimals", "type": "U32"}
      ],
      "returns": "Void"
    }
  ]
}
```

**Functions Only:**
```bash
sorosim inspect --wasm token.wasm --functions-only
```

---

## `validate`

Run a simulation test suite.

### Usage

```bash
sorosim validate [options]
```

### Options

| Flag | Short | Type | Required | Description |
|------|-------|------|----------|-------------|
| `--suite <path>` | `-s` | string | No | Path to test suite JSON |
| `--snapshot <path>` | | string | No | Path to snapshot to validate |
| `--test <pattern>` | `-t` | string | No | Run specific tests (glob pattern) |
| `--bail` | `-b` | boolean | No | Stop on first failure |
| `--output <format>` | `-o` | string | No | Output format: `text`, `json`, `junit` |

### Examples

**Validate Suite:**
```bash
sorosim validate --suite tests/simulation-suite.json
```

**Test Suite Format:**
```json
{
  "name": "Token Test Suite",
  "tests": [
    {
      "name": "Initialize token",
      "wasm": "token.wasm",
      "function": "initialize",
      "args": [...],
      "expectedSuccess": true
    },
    {
      "name": "Unauthorized mint",
      "wasm": "token.wasm",
      "function": "mint",
      "args": [...],
      "auth": {"address": "GUSER..."},
      "expectedSuccess": false,
      "expectedError": "Authorization required"
    }
  ]
}
```

**Validate Snapshot:**
```bash
sorosim validate --snapshot session.sorosim
```

**Run Specific Tests:**
```bash
sorosim validate --suite tests/suite.json --test "transfer*"
```

**JUnit Output (for CI):**
```bash
sorosim validate --suite tests/suite.json --output junit > results.xml
```

---

## `replay`

Replay all invocations from a session snapshot.

### Usage

```bash
sorosim replay [options] <snapshot>
```

### Options

| Flag | Short | Type | Description |
|------|-------|------|-------------|
| `--output <format>` | `-o` | string | Output format: `text`, `json` |
| `--stop-on-error` | | boolean | Stop if any invocation fails |
| `--skip <number>` | | number | Skip first N invocations |
| `--limit <number>` | | number | Only replay first N invocations |

### Examples

**Replay All:**
```bash
sorosim replay session.sorosim
```

**Output:**
```
Replaying session: Token Transfer Test
Snapshot created: 2024-01-15T10:30:00Z

Invocation 1/3: initialize
  ✓ Success
  CPU: 8,200 instructions

Invocation 2/3: mint
  ✓ Success
  CPU: 12,450 instructions

Invocation 3/3: transfer
  ✓ Success
  CPU: 15,600 instructions

Summary:
  Total: 3 invocations
  Passed: 3
  Failed: 0
```

**Replay with Limit:**
```bash
sorosim replay session.sorosim --limit 5
```

---

## `sessions`

Manage saved simulation sessions.

### Usage

```bash
sorosim sessions <subcommand> [options]
```

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `list` | List all saved sessions |
| `show <id>` | Show session details |
| `delete <id>` | Delete a session |
| `export <id>` | Export session to file |
| `clean` | Delete expired sessions |

### Examples

**List Sessions:**
```bash
sorosim sessions list
```

**Output:**
```
Saved Sessions:

1. token-transfer-2024-01-15.sorosim
   Created: 2024-01-15 10:30:00
   Invocations: 3
   Size: 125 KB

2. nft-mint-2024-01-14.sorosim
   Created: 2024-01-14 15:20:00
   Invocations: 1
   Size: 98 KB

Total: 2 sessions
```

**Show Details:**
```bash
sorosim sessions show token-transfer-2024-01-15.sorosim
```

**Delete Session:**
```bash
sorosim sessions delete token-transfer-2024-01-15.sorosim
```

**Export Session:**
```bash
sorosim sessions export token-transfer-2024-01-15.sorosim --output ~/exports/
```

**Clean Expired:**
```bash
sorosim sessions clean --older-than 30d
```

---

## `diff`

Compare two snapshots or state files.

### Usage

```bash
sorosim diff [options] <file1> <file2>
```

### Options

| Flag | Short | Type | Description |
|------|-------|------|-------------|
| `--output <format>` | `-o` | string | Output format: `text`, `json` |
| `--ignore-metadata` | | boolean | Ignore timestamps and IDs |
| `--ledger-only` | | boolean | Compare only ledger state |

### Examples

**Compare Snapshots:**
```bash
sorosim diff snapshot1.sorosim snapshot2.sorosim
```

**Output:**
```
Comparing:
  snapshot1.sorosim (2024-01-15 10:30)
  snapshot2.sorosim (2024-01-15 11:45)

Ledger State Differences:

  ~ ContractData: Balance(GALICE)
    snapshot1: I128(1000)
    snapshot2: I128(500)

  + ContractData: Balance(GBOB)
    snapshot2: I128(500)

Invocations:
  snapshot1: 1 invocation
  snapshot2: 2 invocations

Summary:
  Modified: 1 entry
  Added: 1 entry
  Deleted: 0 entries
```

**JSON Output:**
```bash
sorosim diff state1.json state2.json --output json
```

---

## `extract`

Extract specific data from a snapshot.

### Usage

```bash
sorosim extract [options] <snapshot>
```

### Options

| Flag | Short | Type | Description |
|------|-------|------|-------------|
| `--ledger-only` | | boolean | Extract only ledger state |
| `--contracts-only` | | boolean | Extract only contract WASMs |
| `--contract <id>` | | string | Extract specific contract state |
| `--output <path>` | `-o` | string | Output file path |

### Examples

**Extract Ledger:**
```bash
sorosim extract snapshot.sorosim --ledger-only --output ledger.json
```

**Extract Contracts:**
```bash
sorosim extract snapshot.sorosim --contracts-only --output contracts/
```

**Extract Specific Contract:**
```bash
sorosim extract snapshot.sorosim --contract CTOKEN...ABC --output token-state.json
```

---

## `sanitize`

Remove sensitive data from snapshots.

### Usage

```bash
sorosim sanitize [options] <snapshot>
```

### Options

| Flag | Short | Type | Description |
|------|-------|------|-------------|
| `--output <path>` | `-o` | string | Output file path |
| `--redact-addresses` | | boolean | Replace addresses with placeholders |
| `--remove-auth` | | boolean | Remove auth contexts |
| `--remove-metadata` | | boolean | Remove timestamps and IDs |

### Examples

**Sanitize Snapshot:**
```bash
sorosim sanitize session.sorosim --output public-session.sorosim
```

**Full Sanitization:**
```bash
sorosim sanitize session.sorosim \
  --redact-addresses \
  --remove-auth \
  --remove-metadata \
  --output sanitized.sorosim
```

**Before:**
```json
{
  "auth": {
    "address": "GALICEREAL123...XYZ"
  },
  "ledger": {
    "entries": [
      {
        "type": "Account",
        "accountId": "GALICEREAL123...XYZ"
      }
    ]
  }
}
```

**After:**
```json
{
  "ledger": {
    "entries": [
      {
        "type": "Account",
        "accountId": "GUSER_PLACEHOLDER_001"
      }
    ]
  }
}
```

---

## Configuration File

The `sorosim.config.json` file stores project defaults:

```json
{
  "version": "1.0",
  "contracts": [
    {
      "name": "my_contract",
      "wasm": "./target/wasm32-unknown-unknown/release/my_contract.wasm"
    }
  ],
  "ledger": {
    "entries": [
      {
        "type": "ContractData",
        "contract": "CURRENT_CONTRACT",
        "key": {"type": "Symbol", "value": "Initialized"},
        "value": {"type": "Bool", "value": true},
        "durability": "Persistent"
      }
    ]
  },
  "auth": {
    "address": "GADMIN...XYZ"
  },
  "network": "testnet",
  "defaults": {
    "output": "text",
    "saveState": true
  }
}
```

**Using Config:**
```bash
# Automatically uses sorosim.config.json
sorosim simulate --function transfer --args '[...]'

# Use custom config
sorosim simulate --config my-config.json --function transfer
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SOROSIM_API_URL` | API endpoint URL | `https://api.sorosim.dev/v1` |
| `SOROSIM_CONFIG` | Default config file path | `sorosim.config.json` |
| `SOROSIM_OUTPUT` | Default output format | `text` |
| `SOROSIM_NETWORK` | Default network | `testnet` |
| `SOROSIM_CACHE_DIR` | Cache directory | `~/.sorosim/cache` |

**Example:**
```bash
export SOROSIM_OUTPUT=json
sorosim simulate --wasm contract.wasm --function test
# Output will be JSON by default
```

---

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `1` | General error |
| `2` | Invalid arguments |
| `3` | File not found |
| `4` | Simulation failed |
| `5` | Validation failed |
| `6` | Network error |

**Example:**
```bash
sorosim simulate --wasm contract.wasm --function test
if [ $? -eq 0 ]; then
  echo "Success"
else
  echo "Failed with code $?"
fi
```

---

## Shell Completion

**Bash:**
```bash
sorosim completion bash > /etc/bash_completion.d/sorosim
```

**Zsh:**
```bash
sorosim completion zsh > ~/.zsh/completion/_sorosim
```

**Fish:**
```bash
sorosim completion fish > ~/.config/fish/completions/sorosim.fish
```

---

## Troubleshooting

### Command Not Found

```bash
# Verify installation
which sorosim

# If not found, check npm global bin
npm config get prefix

# Add to PATH
export PATH="$PATH:$(npm config get prefix)/bin"
```

### Invalid JSON

```bash
# Validate JSON before using
cat args.json | jq .

# Pretty-print for debugging
echo '[{"type":"U32","value":42}]' | jq .
```

### Verbose Output

```bash
# Enable verbose mode for debugging
sorosim simulate --verbose --wasm contract.wasm --function test
```

---

## Related Documentation

- **[CLI Quickstart](/docs/quickstart/cli)** — Getting started guide
- **[CI Integration](/docs/guides/ci-integration)** — Using CLI in pipelines
- **[API Reference](/docs/api/overview)** — REST API (CLI uses this internally)

---

## Need Help?

- 💬 **Discord**: [Ask about CLI](https://discord.gg/stellar)
- 📖 **GitHub**: [CLI source code](https://github.com/sorosim/sorosim-cli)
- 🐛 **Report Issues**: [CLI bugs](https://github.com/sorosim/sorosim-cli/issues)
