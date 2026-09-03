# Session Snapshots Guide

Session snapshots let you save and restore complete simulation states, making it easy to reproduce scenarios, share test cases, and build regression test suites. This guide covers everything you need to know about working with snapshots.

## What are Session Snapshots?

A **session snapshot** is a complete capture of your simulation environment, including:

- **Contract WASMs** — All uploaded contract bytecode
- **Mock ledger state** — All configured ledger entries
- **Auth context** — Authorization configurations
- **Invocation history** — Previous function calls and results
- **Session metadata** — Timestamps, version info, descriptions

Think of it as a "save game" for your simulation session.

---

## Why Use Snapshots?

### Reproducibility
Save a specific state and restore it later to reproduce bugs or test scenarios.

### Collaboration
Share snapshots with teammates to demonstrate issues or expected behavior.

### Regression Testing
Build a library of snapshots representing important test cases.

### CI/CD Integration
Use snapshots as fixtures in automated test pipelines.

### Documentation
Include snapshots in bug reports or feature specifications.

---

## Creating Snapshots

### Browser UI

**Method 1: Manual Save**
```
1. Configure your simulation (upload WASM, set ledger state, etc.)
2. Run one or more simulations
3. Click "Save Session" button (top-right)
4. Enter snapshot name: "token-transfer-scenario"
5. Add optional description
6. Click "Download"
```

**Result:** Downloads `token-transfer-scenario.sorosim` file

---

**Method 2: Auto-Save After Simulation**
```
1. Enable "Auto-save after each simulation"
2. Run simulation
3. Snapshot automatically saved to browser storage
4. Export later via "Manage Sessions" panel
```

---

### CLI

**Save State After Simulation:**
```bash
sorosim simulate \
  --wasm token.wasm \
  --function transfer \
  --ledger initial-state.json \
  --args '[...]' \
  --save-state final-state.json
```

**Result:** `final-state.json` contains ledger state after simulation

---

**Save Complete Session:**
```bash
sorosim simulate \
  --wasm token.wasm \
  --function transfer \
  --ledger initial-state.json \
  --args '[...]' \
  --save-session session-snapshot.sorosim
```

**Result:** `session-snapshot.sorosim` contains:
- Contract WASM (base64-encoded)
- Initial ledger state
- Final ledger state
- Invocation parameters
- Results and metrics

---

## Snapshot File Format

### .sorosim Format

SoroSim snapshots use JSON format with `.sorosim` extension:

```json
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "name": "Token Transfer Scenario",
  "description": "Alice transfers 500 tokens to Bob",
  "contracts": [
    {
      "name": "token",
      "wasm": "AGFzbQEAAAABpICAgAABYAN...",
      "hash": "a1b2c3d4e5f6..."
    }
  ],
  "ledger": {
    "initial": {
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
          "value": {"type": "I128", "value": "1000"},
          "durability": "Persistent"
        }
      ]
    },
    "final": {
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
          "value": {"type": "I128", "value": "500"},
          "durability": "Persistent"
        }
      ]
    }
  },
  "invocations": [
    {
      "function": "transfer",
      "args": [
        {"type": "Address", "value": "GALICE...XYZ"},
        {"type": "Address", "value": "GBOB...DEF"},
        {"type": "I128", "value": "500"}
      ],
      "result": {"type": "Void"},
      "success": true,
      "metrics": {
        "cpuInstructions": 12450,
        "memoryBytes": 2048
      }
    }
  ],
  "auth": {
    "address": "GALICE...XYZ"
  }
}
```

---

## Loading Snapshots

### Browser UI

**Method 1: Drag and Drop**
```
1. Drag .sorosim file into SoroSim browser window
2. Click "Load Session"
3. Session restored with all state
```

---

**Method 2: File Upload**
```
1. Click "Load Session" button
2. Click "Choose File"
3. Select .sorosim file
4. Click "Load"
```

---

**Result:**
- ✅ Contracts uploaded
- ✅ Ledger state restored
- ✅ Auth context configured
- ✅ Ready to run same or new simulations

---

### CLI

**Load and Continue:**
```bash
sorosim simulate \
  --load-session session-snapshot.sorosim \
  --function balance \
  --args '[{"type":"Address","value":"GALICE...XYZ"}]'
```

**Result:** Simulates new function call using restored state

---

**Load and Replay:**
```bash
sorosim replay session-snapshot.sorosim
```

**Result:** Re-executes all invocations from snapshot

---

## Workflow Patterns

### Pattern 1: State Checkpoints

Save state at key points in a workflow.

**Example: Token Lifecycle**

```bash
# 1. Initialize
sorosim simulate \
  --wasm token.wasm \
  --function initialize \
  --args '[{"type":"Address","value":"GADMIN..."}]' \
  --save-session 01-initialized.sorosim

# 2. Mint
sorosim simulate \
  --load-session 01-initialized.sorosim \
  --function mint \
  --args '[{"type":"Address","value":"GALICE..."},{"type":"I128","value":"1000"}]' \
  --save-session 02-minted.sorosim

# 3. Transfer
sorosim simulate \
  --load-session 02-minted.sorosim \
  --function transfer \
  --args '[{"type":"Address","value":"GALICE..."},{"type":"Address","value":"GBOB..."},{"type":"I128","value":"500"}]' \
  --save-session 03-transferred.sorosim

# 4. Burn
sorosim simulate \
  --load-session 03-transferred.sorosim \
  --function burn \
  --args '[{"type":"Address","value":"GBOB..."},{"type":"I128","value":"100"}]' \
  --save-session 04-burned.sorosim
```

**Result:** 4 snapshots representing token lifecycle stages

---

### Pattern 2: Branch Testing

Start from a common state, test different paths.

```bash
# Common starting point
sorosim simulate \
  --wasm dex.wasm \
  --function add_liquidity \
  --ledger base-state.json \
  --args '[...]' \
  --save-session base-liquidity.sorosim

# Branch 1: Large swap
sorosim simulate \
  --load-session base-liquidity.sorosim \
  --function swap \
  --args '[{"type":"I128","value":"10000"}]' \
  --save-session branch-large-swap.sorosim

# Branch 2: Small swap
sorosim simulate \
  --load-session base-liquidity.sorosim \
  --function swap \
  --args '[{"type":"I128","value":"100"}]' \
  --save-session branch-small-swap.sorosim

# Branch 3: Remove liquidity
sorosim simulate \
  --load-session base-liquidity.sorosim \
  --function remove_liquidity \
  --args '[...]' \
  --save-session branch-remove-liquidity.sorosim
```

---

### Pattern 3: Regression Test Suite

Build a library of test scenarios.

**Directory Structure:**
```
test-snapshots/
  ├── happy-paths/
  │   ├── token-transfer-success.sorosim
  │   ├── token-mint-success.sorosim
  │   └── token-burn-success.sorosim
  ├── edge-cases/
  │   ├── transfer-max-amount.sorosim
  │   ├── transfer-zero-amount.sorosim
  │   └── transfer-insufficient-balance.sorosim
  └── failure-cases/
      ├── unauthorized-mint.sorosim
      ├── transfer-to-zero-address.sorosim
      └── burn-more-than-balance.sorosim
```

**Run Suite:**
```bash
#!/bin/bash
for snapshot in test-snapshots/**/*.sorosim; do
  echo "Testing: $snapshot"
  sorosim validate --snapshot "$snapshot" || exit 1
done
echo "✓ All tests passed"
```

---

### Pattern 4: Incremental State Building

Build complex state incrementally.

```bash
# Start with empty state
echo '{"entries":[]}' > state.json

# Add accounts
sorosim simulate \
  --wasm setup.wasm \
  --function add_accounts \
  --ledger state.json \
  --save-state state.json

# Add token balances
sorosim simulate \
  --wasm setup.wasm \
  --function add_balances \
  --ledger state.json \
  --save-state state.json

# Add liquidity pools
sorosim simulate \
  --wasm setup.wasm \
  --function add_pools \
  --ledger state.json \
  --save-state state.json

# Save final snapshot
sorosim simulate \
  --wasm main.wasm \
  --function noop \
  --ledger state.json \
  --save-session complete-ecosystem.sorosim
```

---

## Sharing Snapshots

### With Team Members

**Export:**
```
1. Create snapshot
2. Click "Export" or save to file
3. Share .sorosim file via Git, Slack, email, etc.
```

**Import:**
```
1. Receive .sorosim file
2. Load into SoroSim
3. Reproduce exact scenario
```

---

### In Documentation

**GitHub README:**
```markdown
## Reproducing the Bug

1. Download [bug-scenario.sorosim](./snapshots/bug-scenario.sorosim)
2. Load in SoroSim: https://app.sorosim.dev
3. Click "Simulate" to see the issue
4. Expected: Balance increases
5. Actual: Balance remains unchanged
```

---

### In Bug Reports

**GitHub Issue Template:**
```markdown
### Bug Report

**Description:** Transfer function fails with insufficient balance error

**Reproduction:**
1. Load attached snapshot: [transfer-bug.sorosim](./transfer-bug.sorosim)
2. Run simulation
3. Observe error

**Expected Behavior:** Transfer should succeed
**Actual Behavior:** Error: Insufficient balance

**Snapshot:** [Download](./transfer-bug.sorosim)
```

---

## Snapshot Management

### Browser Storage

**View Saved Sessions:**
```
1. Click "Manage Sessions" button
2. See list of saved snapshots
3. Filter, search, or sort
```

**Session List:**
```
📁 My Sessions (12)
  
  🕐 2024-01-15 10:30
     Token Transfer - Alice to Bob
     [Load] [Export] [Delete]
  
  🕐 2024-01-14 15:20
     NFT Mint Test
     [Load] [Export] [Delete]
  
  🕐 2024-01-13 09:45
     DAO Vote Scenario
     [Load] [Export] [Delete]
```

---

### CLI Session Management

**List Sessions:**
```bash
sorosim sessions list
```

**Output:**
```
Saved Sessions:
  1. token-transfer-2024-01-15.sorosim
  2. nft-mint-2024-01-14.sorosim
  3. dao-vote-2024-01-13.sorosim
```

---

**Delete Session:**
```bash
sorosim sessions delete token-transfer-2024-01-15.sorosim
```

---

**Export Session:**
```bash
sorosim sessions export token-transfer-2024-01-15.sorosim --output ~/exports/
```

---

## CI/CD Integration

### GitHub Actions

Use snapshots as test fixtures:

**Workflow:**
```yaml
name: Contract Snapshot Tests

on: [push, pull_request]

jobs:
  test-snapshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install SoroSim CLI
        run: npm install -g sorosim-cli
      
      - name: Run Snapshot Tests
        run: |
          for snapshot in test-snapshots/**/*.sorosim; do
            echo "Testing: $snapshot"
            sorosim validate --snapshot "$snapshot"
          done
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

---

### Automated Regression Testing

**Script:**
```bash
#!/bin/bash
# test-snapshots.sh

SNAPSHOT_DIR="./test-snapshots"
RESULTS_FILE="test-results.txt"

echo "Running snapshot tests..." > $RESULTS_FILE

for snapshot in $SNAPSHOT_DIR/**/*.sorosim; do
  echo "Testing: $(basename $snapshot)"
  
  if sorosim validate --snapshot "$snapshot" >> $RESULTS_FILE 2>&1; then
    echo "  ✓ PASS: $(basename $snapshot)" | tee -a $RESULTS_FILE
  else
    echo "  ✗ FAIL: $(basename $snapshot)" | tee -a $RESULTS_FILE
    exit 1
  fi
done

echo "All tests passed!" | tee -a $RESULTS_FILE
```

---

## Advanced Features

### Snapshot Comparison

Compare two snapshots to see differences:

**CLI:**
```bash
sorosim diff snapshot1.sorosim snapshot2.sorosim
```

**Output:**
```
Comparing snapshots:
  snapshot1.sorosim (2024-01-15 10:30)
  snapshot2.sorosim (2024-01-15 11:45)

Differences:

Ledger State:
  ~ ContractData: Balance(GALICE)
    snapshot1: I128(1000)
    snapshot2: I128(500)
  
  + ContractData: Balance(GBOB)
    snapshot2: I128(500)

Invocations:
  snapshot1: 1 invocation
  snapshot2: 2 invocations
```

---

### Snapshot Merging

Combine multiple snapshots:

**CLI:**
```bash
sorosim merge \
  --base initial-state.sorosim \
  --add user-balances.sorosim \
  --add liquidity-pools.sorosim \
  --output complete-state.sorosim
```

---

### Snapshot Filtering

Extract specific parts of a snapshot:

**CLI:**
```bash
# Extract only ledger state
sorosim extract snapshot.sorosim --ledger-only --output ledger-state.json

# Extract only contract WASMs
sorosim extract snapshot.sorosim --contracts-only --output contracts/

# Extract specific contract state
sorosim extract snapshot.sorosim --contract CTOKEN...ABC --output token-state.json
```

---

## Best Practices

### ✅ Do

- **Name snapshots descriptively** — "token-transfer-alice-to-bob" not "test1"
- **Add descriptions** — Explain what the snapshot demonstrates
- **Version snapshots** — Include contract version in filename
- **Commit to Git** — Track snapshots alongside code
- **Document expected behavior** — Note what should happen when loaded
- **Clean up old snapshots** — Remove obsolete test cases

### ❌ Don't

- **Don't include secrets** — Snapshots may contain sensitive data
- **Don't commit huge snapshots** — Keep file sizes reasonable
- **Don't use production data** — Use synthetic test data
- **Don't hardcode timestamps** — Use relative time when possible
- **Don't skip validation** — Verify snapshots load correctly

---

## Snapshot Security

### Sensitive Data

Snapshots may contain:
- ⚠️ Account addresses
- ⚠️ Private keys (if accidentally included)
- ⚠️ Business logic details
- ⚠️ Proprietary algorithms

**Precautions:**
- Review snapshots before sharing
- Use placeholder addresses for demos
- Redact sensitive information
- Consider access controls for shared snapshots

---

### Sanitizing Snapshots

**CLI:**
```bash
sorosim sanitize snapshot.sorosim --output sanitized.sorosim
```

**Actions:**
- Replaces real addresses with placeholders
- Removes private keys
- Redacts sensitive metadata
- Preserves functional behavior

---

## Troubleshooting

### Issue: Snapshot Won't Load

**Error:**
```
❌ Failed to load snapshot: Invalid format
```

**Solutions:**
1. Check file is valid JSON
2. Verify .sorosim extension
3. Ensure SoroSim version compatibility
4. Try re-exporting from original session

---

### Issue: State Mismatch After Load

**Problem:** Loaded state doesn't match saved state

**Causes:**
- Contract WASM version mismatch
- SoroSim version incompatibility
- Corrupted snapshot file

**Solution:**
1. Check contract versions
2. Update SoroSim to latest
3. Re-create snapshot

---

### Issue: Large Snapshot Files

**Problem:** Snapshot file is very large (>10MB)

**Solutions:**
- Remove unnecessary contract WASMs
- Compress with gzip
- Extract only needed state
- Use state-only snapshots (exclude history)

---

## Snapshot Library

### Official Examples

Download pre-built snapshots:

- [Token Transfer Example](https://github.com/sorosim/snapshots/token-transfer.sorosim)
- [NFT Mint Example](https://github.com/sorosim/snapshots/nft-mint.sorosim)
- [DEX Swap Example](https://github.com/sorosim/snapshots/dex-swap.sorosim)
- [DAO Vote Example](https://github.com/sorosim/snapshots/dao-vote.sorosim)

---

### Community Snapshots

Browse and share:
- [SoroSim Snapshot Hub](https://snapshots.sorosim.dev)
- [GitHub Discussions](https://github.com/sorosim/sorosim/discussions/categories/snapshots)

---

## Related Guides

- **[Mock Ledger Configuration](/docs/guides/mock-ledger)** — Setting up initial state
- **[CI Integration](/docs/guides/ci-integration)** — Using snapshots in pipelines
- **[Browser Quickstart](/docs/quickstart/browser)** — Creating your first snapshot
- **[CLI Quickstart](/docs/quickstart/cli)** — CLI snapshot workflow

---

## Need Help?

- 💬 **Discord**: [Ask about snapshots](https://discord.gg/stellar)
- 📖 **Examples**: [Snapshot workflow examples](https://github.com/sorosim/examples/snapshots)
- 🎥 **Video**: [Session snapshots tutorial](https://youtube.com/sorosim)
