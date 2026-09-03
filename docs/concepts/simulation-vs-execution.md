# Simulation vs Dry-Run vs Actual Submission

Understanding the difference between simulation, dry-run, and actual submission is crucial for effective Soroban development. This guide explains each execution mode, when to use them, and how SoroSim fits into your workflow.

## Overview

Soroban contracts can be executed in three distinct modes:

| Mode | Purpose | Network | State Changes | Cost | Reversible |
|------|---------|---------|---------------|------|------------|
| **Simulation** | Local testing | None | Mock only | Free | Always |
| **Dry-Run** | Pre-flight check | Testnet/Mainnet | None (preview) | Free | N/A |
| **Actual Submission** | Production execution | Testnet/Mainnet | Permanent | XLM fees | Never |

Let's explore each mode in detail.

---

## Simulation (SoroSim)

**Simulation** is purely local execution with configurable mock state. No network connection required.

### How It Works

1. **Load WASM** — Contract bytecode runs in a local Soroban VM
2. **Configure mock ledger** — You define the initial state
3. **Execute function** — Contract runs against mock data
4. **Inspect results** — See state changes, return values, and metrics

### Characteristics

✅ **Fully Local** — No network, no testnet, no RPC endpoints  
✅ **Instant** — No ledger confirmation time  
✅ **Free** — No XLM fees  
✅ **Configurable State** — Set up any ledger scenario  
✅ **Repeatable** — Same inputs = same outputs  
✅ **Isolated** — No side effects on real networks  

### When to Use Simulation

- ✅ **Rapid prototyping** — Test contract logic without deployment
- ✅ **Unit testing** — Validate individual functions in isolation
- ✅ **Edge case testing** — Reproduce specific state conditions
- ✅ **Pre-deployment validation** — Catch bugs before testnet
- ✅ **Learning** — Experiment without testnet friction
- ✅ **CI/CD** — Automated contract validation in pipelines

### Limitations

- ❌ **No real network state** — Can't query actual testnet/mainnet data
- ❌ **Mock dependencies** — External contracts must be manually mocked
- ❌ **No fee calculation** — Estimates only (not real network fees)
- ❌ **Clock differences** — Timestamps are simulated, not real network time

### Example Workflow

```bash
# Upload WASM to SoroSim
sorosim simulate \
  --wasm token.wasm \
  --function mint \
  --args '[{"type":"Address","value":"GUSER..."},{"type":"U64","value":1000}]'

# Output: Instant local execution
✓ Result: Void
✓ State: Balance entry created
✓ CPU: 12,450 instructions
✓ Memory: 2.1 KB
```

---

## Dry-Run (Stellar CLI)

**Dry-run** executes the contract on a real network (testnet or mainnet) but **does not commit** the transaction. It's a preview of what would happen.

### How It Works

1. **Connect to RPC** — Query real network state
2. **Submit transaction** — Marked as simulation-only
3. **Execute on network** — Contract runs on real Horizon/Soroban RPC
4. **Return preview** — Shows what would happen, but doesn't persist
5. **Calculate fees** — Real network fee estimation

### Characteristics

✅ **Real Network State** — Uses actual ledger data  
✅ **Accurate Fee Estimation** — Real network costs  
✅ **Auth Validation** — Checks real signatures  
✅ **Cross-Contract** — Invokes actual deployed contracts  
✅ **No State Changes** — Transaction is not committed  
✅ **Free** — No XLM charged (simulation flag)  

❌ **Requires Network** — Testnet/mainnet connection needed  
❌ **Slower** — Network round-trip time  
❌ **Less Flexible** — Can't mock arbitrary state  

### When to Use Dry-Run

- ✅ **Pre-submission validation** — Test before committing transaction
- ✅ **Fee calculation** — Get accurate cost estimates
- ✅ **Real state testing** — Test against current network state
- ✅ **Cross-contract validation** — Test with real deployed dependencies
- ✅ **Auth debugging** — Verify signature requirements

### Limitations

- ❌ **Network dependency** — Requires RPC endpoint and connectivity
- ❌ **State constraints** — Can't arbitrarily modify ledger state
- ❌ **Slower iteration** — Network latency vs instant local simulation

### Example Workflow

```bash
# Dry-run using Stellar CLI
stellar contract invoke \
  --id CTOKEN... \
  --source GUSER... \
  --network testnet \
  --simulate-only \
  -- \
  mint \
  --to GUSER... \
  --amount 1000

# Output: Network simulation (no commit)
✓ Preview: Transaction would succeed
✓ Fee: 150,000 stroops (0.015 XLM)
✓ CPU: 14,200 instructions
✓ State: Balance would be updated
⚠️  Not committed to ledger
```

---

## Actual Submission (Production)

**Actual submission** executes the contract on a real network and **permanently commits** the transaction to the ledger.

### How It Works

1. **Build transaction** — Create signed transaction
2. **Submit to network** — Send to Horizon/Soroban RPC
3. **Execute on validators** — Contract runs on consensus network
4. **Commit to ledger** — State changes are permanent
5. **Pay fees** — XLM deducted from source account

### Characteristics

✅ **Permanent** — State changes are irreversible  
✅ **Consensus** — Validated by network  
✅ **Real Fees** — XLM charged to account  
✅ **Production State** — Modifies actual ledger  
✅ **Publicly Visible** — Transaction recorded on blockchain  

❌ **Irreversible** — Mistakes are permanent  
❌ **Costly** — Every invocation costs XLM  
❌ **Slower** — Ledger confirmation time (5-6 seconds)  
❌ **High Stakes** — Production errors affect real users  

### When to Use Actual Submission

- ✅ **Production deployments** — Deploy contracts to mainnet
- ✅ **Real transactions** — Execute actual token transfers, payments
- ✅ **User interactions** — Process real user actions
- ✅ **Integration testing** — End-to-end testnet validation

### Precautions

⚠️ **Always dry-run first** — Validate before committing  
⚠️ **Double-check parameters** — No undo button  
⚠️ **Verify fees** — Ensure account has sufficient XLM  
⚠️ **Test on testnet** — Never deploy untested code to mainnet  

### Example Workflow

```bash
# Actual submission using Stellar CLI
stellar contract invoke \
  --id CTOKEN... \
  --source GUSER... \
  --network testnet \
  -- \
  mint \
  --to GUSER... \
  --amount 1000

# Output: Real transaction committed
✓ Transaction: 3a4f2c1d...
✓ Fee: 150,000 stroops (0.015 XLM)
✓ Ledger: 123456
✓ Status: SUCCESS
✓ Balance updated permanently
```

---

## Comparison Table

| Feature | Simulation (SoroSim) | Dry-Run (Stellar CLI) | Actual Submission |
|---------|---------------------|----------------------|-------------------|
| **Network** | None | Testnet/Mainnet | Testnet/Mainnet |
| **Speed** | Instant | ~1-2 seconds | ~5-6 seconds |
| **Cost** | Free | Free | XLM fees |
| **State** | Mock (configurable) | Real (read-only) | Real (committed) |
| **Repeatability** | Perfect | Variable | Variable |
| **Reversibility** | Always | N/A (no changes) | Never |
| **Use Case** | Development/testing | Pre-flight check | Production |
| **Iteration Speed** | Very fast | Medium | Slow |
| **Dependencies** | None | RPC endpoint | RPC + funded account |

---

## Development Workflow: When to Use Each

### Phase 1: Prototyping (Simulation)

**Goal:** Rapidly iterate on contract logic

```
1. Write Rust code
2. Build WASM
3. Simulate in SoroSim
4. Iterate quickly
```

**Tools:** SoroSim browser or CLI

**Feedback loop:** Seconds

---

### Phase 2: Validation (Simulation + Dry-Run)

**Goal:** Validate contract behavior with realistic data

```
1. Simulate edge cases in SoroSim
2. Deploy to testnet
3. Dry-run against real state
4. Fix issues found
```

**Tools:** SoroSim + Stellar CLI

**Feedback loop:** Minutes

---

### Phase 3: Integration Testing (Dry-Run + Testnet)

**Goal:** Test cross-contract interactions and auth flows

```
1. Deploy dependencies to testnet
2. Dry-run main contract
3. Submit test transactions
4. Validate end-to-end flow
```

**Tools:** Stellar CLI (dry-run + submit)

**Feedback loop:** Minutes to hours

---

### Phase 4: Production Deployment (Actual Submission)

**Goal:** Deploy to mainnet and serve users

```
1. Final testnet validation
2. Audit code
3. Deploy to mainnet
4. Monitor production invocations
```

**Tools:** Stellar CLI (mainnet)

**Feedback loop:** Once (irreversible)

---

## SoroSim's Role in the Workflow

SoroSim specializes in **Phase 1 (Prototyping)** and early **Phase 2 (Validation)**:

### What SoroSim Does Best

✅ **Instant feedback** — Test logic in real-time  
✅ **State control** — Set up any scenario  
✅ **Visual inspection** — See state changes clearly  
✅ **No setup friction** — No testnet, no XLM, no RPC  
✅ **CI integration** — Automated contract validation  

### What SoroSim Doesn't Replace

❌ **Testnet deployment** — Still needed for integration testing  
❌ **Real network fees** — Estimates only  
❌ **Production monitoring** — Not a mainnet tool  

---

## Common Questions

### Q: Should I skip testnet and go straight to mainnet?

**Never.** Always follow this path:

```
SoroSim (dev) → Testnet (staging) → Mainnet (production)
```

### Q: Why simulate if I can dry-run?

**Speed and control.** Simulation is:
- **10-100x faster** (no network latency)
- **More flexible** (arbitrary state configuration)
- **Free forever** (no RPC rate limits)

Dry-run is for final validation, not rapid iteration.

### Q: Can SoroSim replace the Stellar CLI?

**No.** They're complementary tools:
- **SoroSim** = Development and testing
- **Stellar CLI** = Deployment and production

Use both for best results.

### Q: Is dry-run safe?

**Yes.** Dry-run never commits transactions. But note:
- You're still **sending data to the network**
- RPC logs may record your transaction
- Use testnet for sensitive testing

### Q: Can I simulate mainnet state in SoroSim?

**Yes, manually.** You can:
1. Query mainnet state via RPC
2. Export ledger entries as JSON
3. Import into SoroSim as mock state

But you must do this explicitly—SoroSim doesn't auto-sync with networks.

---

## Best Practices

### ✅ Do

- **Start with simulation** for all new features
- **Dry-run before every submission** to testnet/mainnet
- **Use simulation for unit tests** in CI/CD
- **Test on testnet before mainnet** (always)
- **Save SoroSim sessions** for reproducible test scenarios

### ❌ Don't

- **Don't skip simulation** — It catches bugs early
- **Don't skip dry-run** — It prevents costly mistakes
- **Don't deploy untested code** to mainnet
- **Don't assume simulation = production** — Always validate on testnet
- **Don't use mainnet for testing** — Use testnet or simulation

---

## Tool Comparison

| Tool | Type | Network | Primary Use |
|------|------|---------|-------------|
| **SoroSim** | Simulator | None | Development, unit testing, rapid iteration |
| **Stellar CLI** | Network Client | Testnet/Mainnet | Deployment, dry-run, production invocations |
| **SorobanHub** | Contract Manager | Testnet/Mainnet | Contract discovery, interaction UI |
| **Horizon API** | Query Interface | Testnet/Mainnet | Ledger queries, historical data |

---

## Example: End-to-End Workflow

### Scenario: Deploy a Token Contract

#### Step 1: Develop Locally (Simulation)

```bash
# Build contract
soroban contract build

# Simulate initialize
sorosim simulate \
  --wasm token.wasm \
  --function initialize \
  --args '[{"type":"Address","value":"GADMIN..."}]'

# Simulate mint
sorosim simulate \
  --wasm token.wasm \
  --function mint \
  --ledger state.json \
  --args '[{"type":"Address","value":"GUSER..."},{"type":"U64","value":1000}]'
```

#### Step 2: Validate on Testnet (Dry-Run)

```bash
# Deploy to testnet
stellar contract deploy \
  --wasm token.wasm \
  --source GADMIN... \
  --network testnet

# Dry-run initialize
stellar contract invoke \
  --id CTOKEN... \
  --source GADMIN... \
  --network testnet \
  --simulate-only \
  -- \
  initialize \
  --admin GADMIN...
```

#### Step 3: Test on Testnet (Actual)

```bash
# Submit initialize
stellar contract invoke \
  --id CTOKEN... \
  --source GADMIN... \
  --network testnet \
  -- \
  initialize \
  --admin GADMIN...

# Submit mint
stellar contract invoke \
  --id CTOKEN... \
  --source GADMIN... \
  --network testnet \
  -- \
  mint \
  --to GUSER... \
  --amount 1000
```

#### Step 4: Deploy to Mainnet (Production)

```bash
# Deploy to mainnet (after audits!)
stellar contract deploy \
  --wasm token.wasm \
  --source GADMIN... \
  --network mainnet

# Initialize on mainnet
stellar contract invoke \
  --id CTOKEN... \
  --source GADMIN... \
  --network mainnet \
  -- \
  initialize \
  --admin GADMIN...
```

---

## Related Concepts

- **[Ledger Entries](/docs/concepts/ledger-entries)** — What simulation modifies
- **[State Diff Model](/docs/concepts/state-diff)** — How simulation tracks changes
- **[CLI Quickstart](/docs/quickstart/cli)** — Using SoroSim CLI for simulation
- **[CI Integration](/docs/guides/ci-integration)** — Automating simulations

---

## Need Help?

- 📖 **Stellar Docs**: [Transaction Simulation](https://developers.stellar.org/docs/smart-contracts/guides/transactions/simulate-transaction)
- 💬 **Discord**: [Ask about workflows](https://discord.gg/stellar)
- 🎥 **Video**: [Simulation vs Dry-Run explained](https://youtube.com/sorosim)
