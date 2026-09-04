---
slug: introducing-sorosim
title: Introducing SoroSim - The Missing Soroban Development Tool
authors: [sorosim-team]
tags: [launch, soroban, stellar, smart-contracts, development-tools]
---

# Introducing SoroSim: The Missing Soroban Development Tool

**TL;DR:** We built SoroSim — an open-source browser and CLI tool for simulating Soroban smart contracts locally with visual state inspection. No testnet. No XLM. Just rapid iteration.

<!--truncate-->

## The Problem: Soroban's Developer Experience Gap

When we started building Soroban smart contracts, we kept hitting the same frustrations:

### 1. Testnet Dependency Hell

Want to test a simple contract change?

```bash
# Build contract
soroban contract build

# Deploy to testnet
stellar contract deploy --wasm contract.wasm --network testnet
# ⏱️  Wait 5-6 seconds...

# Test function
stellar contract invoke --id CONTRACT_ID --function test --network testnet
# ⏱️  Wait another 5-6 seconds...

# Realize you have a bug
# 🔄 Repeat entire process
```

**Every test cycle takes 10+ seconds.** Testing 10 scenarios = 2+ minutes of waiting. A day of development = hours of waiting.

### 2. No Visual State Inspection

After invoking a contract, you get:

```
✓ Transaction succeeded
```

Great! But **what changed?**

To find out, you manually query RPC endpoints, parse XDR, compare before/after states, and try to understand what happened. There's no visual diff, no clear "this balance changed from X to Y."

### 3. Terminal-Only Simulation

The Stellar CLI has `stellar contract invoke --simulate-only`, but:
- No state visualization
- No state diff
- No GUI
- No session management
- No snapshot replay

It's useful for pre-flight checks, but not for iterative development.

### 4. Complex Setup for Cross-Contract Testing

Testing a contract that calls other contracts requires:
- Deploying all dependencies to testnet
- Managing multiple contract IDs
- Coordinating state across contracts
- No easy way to mock dependencies

**For complex DeFi protocols with 5+ contracts, this becomes unmanageable.**

---

## The Gap: No Remix for Soroban

Ethereum developers have **Remix IDE** — a browser-based tool where you:
- Write Solidity
- Deploy locally
- Test instantly
- See state changes
- Iterate rapidly

**Soroban has nothing like this.**

Other ecosystems have similar tools:
- **Ethereum:** Remix, Hardhat, Foundry
- **Solana:** Solana Playground, Anchor
- **Near:** Near Workspaces

Soroban had a CLI (excellent for production) and SorobanHub (great for deployed contracts), but **no rapid prototyping sandbox**.

---

## The Solution: SoroSim

We built SoroSim to fill this gap. It's the tool we wished existed when we started building on Soroban.

### What is SoroSim?

**SoroSim is a local Soroban contract simulator with three interfaces:**

1. **Browser UI** — Visual sandbox for contract testing
2. **CLI Tool** — Command-line automation for CI/CD
3. **REST API** — Programmatic access for integrations

**Core Principle:** Simulate contracts locally with any ledger state, without needing testnet.

---

## Key Features

### 1. Instant Local Simulation

```bash
# Simulate locally (< 100ms)
sorosim simulate \
  --wasm token.wasm \
  --function transfer \
  --args '[...]'

✓ Simulation completed in 45ms
```

**No testnet. No waiting. Instant feedback.**

---

### 2. Visual State Diff Inspector

The browser UI shows exactly what changed:

```diff
State Changes:

~ ContractData: Balance(Alice)
  Before: I128(1000)
  After:  I128(500)

~ ContractData: Balance(Bob)
  Before: I128(500)
  After:  I128(1000)

+ ContractData: LastTransfer
  Added: U64(1704067200)
```

**Finally, you can *see* what your contract does.**

---

### 3. Mock Ledger Configuration

Set up any test scenario with JSON:

```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "Balance"},
      "value": {"type": "I128", "value": "1000"},
      "durability": "Persistent"
    }
  ]
}
```

**Test edge cases, reproduce bugs, and validate logic without complex testnet setup.**

---

### 4. Cross-Contract Simulation

Test contracts calling other contracts:

```bash
sorosim simulate \
  --wasm dex.wasm \
  --function swap \
  --contracts '{"token":"CTOKEN..."}' \
  --contract-wasms '{"CTOKEN...":"token.wasm"}'
```

**Mock dependencies, test integrations, and validate multi-contract workflows locally.**

---

### 5. Session Snapshots

Save complete simulation states:

```bash
# Save session
sorosim simulate ... --save-session test-scenario.sorosim

# Later: load and replay
sorosim replay test-scenario.sorosim
```

**Build a library of test scenarios. Share with team. Use in CI/CD.**

---

### 6. CI/CD Integration

Automate contract testing in GitHub Actions:

```yaml
- name: Test contracts
  run: |
    sorosim simulate --wasm contract.wasm --function test
```

**Catch bugs before deployment. Every PR. Every commit.**

---

## Real-World Impact

### Case Study: DeFi Protocol Development

**Before SoroSim:**
- 5 contracts (Router, 2 Tokens, Pool, Oracle)
- Deploy all to testnet for each test
- 30+ seconds per test cycle
- Hard to reproduce specific scenarios
- Testing time: ~4 hours/day

**After SoroSim:**
- Simulate entire protocol locally
- < 100ms per test cycle
- Easy scenario reproduction
- Testing time: ~30 minutes/day

**Result:** **8x faster development**, fewer bugs, more comprehensive testing.

---

## How It Works

SoroSim uses the same Soroban VM as production, but with:
- **Configurable ledger state** (you provide initial state)
- **Local execution** (no network calls)
- **State tracking** (before/after comparison)

**It's not a mock — it's real contract execution, just local.**

```
Your Contract (WASM)
        ↓
   Soroban VM
        ↓
  Mock Ledger State
        ↓
   Execute Function
        ↓
   Compute State Diff
        ↓
  Visual Results
```

---

## Open Source & Community-Driven

SoroSim is **100% open source** (Apache 2.0):

- **Frontend:** [github.com/sorosim/sorosim-frontend](https://github.com/sorosim/sorosim-frontend)
- **Backend:** [github.com/sorosim/sorosim-backend](https://github.com/sorosim/sorosim-backend)
- **CLI:** [github.com/sorosim/sorosim-cli](https://github.com/sorosim/sorosim-cli)
- **Contracts:** [github.com/sorosim/sorosim-contracts](https://github.com/sorosim/sorosim-contracts)

**We're building in public. Contributions welcome!**

---

## Drips Wave Bounty Program

We're participating in **Stellar's Drips Wave** program with bounties ranging from **$200 to $1500** for:

- New features
- Bug fixes
- Documentation
- Sample contracts
- Integrations

**Browse bounties:** [github.com/sorosim/sorosim/labels/drips-wave](https://github.com/sorosim/sorosim/labels/drips-wave)

---

## What's Next?

We have an ambitious roadmap:

**Q1 2024 (v0.4.0):**
- Advanced auth spoofing
- Breakpoint debugging
- Performance profiling

**Q2 2024 (v0.5.0):**
- Contract dependency management
- Mock contract generator
- Call graph visualization

**Q3 2024 (v0.6.0):**
- Testnet state import
- Hybrid simulation mode
- Network fork mode

**See full roadmap:** [docs.sorosim.dev/docs/roadmap](https://docs.sorosim.dev/docs/roadmap)

---

## Try SoroSim Today

### Browser

Visit **[app.sorosim.dev](https://app.sorosim.dev)** and simulate in 5 minutes:

1. Load a sample contract
2. Select a function
3. Configure parameters
4. Click "Simulate"
5. See state changes visually

### CLI

```bash
# Install
npm install -g sorosim-cli

# Simulate
sorosim simulate \
  --wasm your-contract.wasm \
  --function your-function
```

---

## Why This Matters for Soroban

Soroban is **powerful** — predictable fees, resource isolation, Rust safety. But adoption requires **great developer experience**.

**Developer experience = velocity.**

Fast iteration = more experimentation = better contracts = stronger ecosystem.

SoroSim removes friction from the development loop:

```
Old: Write → Build → Deploy → Wait → Test → Repeat (30+ seconds)
New: Write → Build → Simulate → Iterate (< 1 second)
```

**That's 30x faster.**

---

## The Vision

We want SoroSim to be **the essential tool for every Soroban developer** — from first prototype to production deployment.

**Our North Star:**
- **Fastest** way to test Soroban contracts
- **Easiest** way to debug state changes
- **Most intuitive** way to learn Soroban

**If you build on Soroban, you should use SoroSim.**

---

## Get Involved

### Use It
- **Browser:** [app.sorosim.dev](https://app.sorosim.dev)
- **CLI:** `npm install -g sorosim-cli`
- **Docs:** [docs.sorosim.dev](https://docs.sorosim.dev)

### Contribute
- **Code:** [github.com/sorosim](https://github.com/sorosim)
- **Bounties:** [Drips Wave program](https://github.com/sorosim/sorosim/labels/drips-wave)
- **Feedback:** [GitHub Discussions](https://github.com/sorosim/sorosim/discussions)

### Connect
- **Discord:** [discord.gg/stellar](https://discord.gg/stellar) (#sorosim)
- **Twitter:** [@SoroSim](https://twitter.com/sorosim)
- **Newsletter:** [sorosim.dev/newsletter](https://sorosim.dev/newsletter)

---

## Thank You

To the **Stellar Foundation** for supporting this project through Drips Wave.

To the **Soroban team** for building an incredible smart contract platform.

To **early testers** who provided invaluable feedback.

And to **you** for reading this. We hope SoroSim makes your Soroban development faster, easier, and more enjoyable.

**Happy building!** 🚀

---

_This post was originally published on [sorosim.dev/blog](https://sorosim.dev/blog) on January 15, 2024._
