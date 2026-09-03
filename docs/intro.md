# Introduction

Welcome to **SoroSim** — the open-source Soroban contract simulation and dry-run sandbox with visual state inspection.

## What is SoroSim?

SoroSim is a comprehensive development tool that lets you **simulate Soroban smart contract invocations with any ledger state — without needing testnet access**. Whether you're prototyping a new contract, debugging complex state transitions, or testing cross-contract interactions, SoroSim provides a complete sandbox environment right in your browser or terminal.

Think of it as **Remix IDE for Soroban** — purpose-built for rapid iteration and deep state inspection.

### Core Capabilities

- **🌐 Browser-Based Sandbox**: Upload WASM contracts, configure mock ledger entries, invoke functions, and inspect results through an intuitive web interface
- **🔍 Visual State Inspector**: See exactly how your contract modifies ledger state with before/after diffs, footprint analysis, and ScVal transformations
- **⚡ CLI for Automation**: Integrate contract simulation into your CI/CD pipeline with the `sorosim` command-line tool
- **🎯 No Testnet Required**: Test contract behavior with custom ledger state without deploying to testnet or managing XLM balances
- **📸 Session Snapshots**: Save and restore complete simulation sessions for reproducible testing and debugging

## The Problem: Soroban's Developer Experience Gap

Soroban developers currently face significant friction during the development cycle:

### 1. **Limited Local Testing**

The Stellar CLI provides basic `stellar contract invoke` simulation, but it's:
- **Terminal-only** with no visual state inspection
- Limited to text output with no diff visualization
- Difficult to configure complex mock ledger states
- Not designed for rapid iteration workflows

### 2. **Testnet Dependency**

Most developers resort to deploying contracts to testnet for realistic testing, which requires:
- Maintaining testnet XLM balances
- Waiting for ledger confirmation times
- Managing deployment addresses and contract IDs
- Network connectivity and RPC endpoint availability
- Dealing with testnet resets and state loss

### 3. **No State Visualization**

Understanding how contracts modify ledger state requires:
- Manually querying RPC endpoints before and after invocations
- Parsing raw XDR and ScVal structures
- Reconstructing state changes mentally
- No tooling for footprint analysis or storage inspection

### 4. **Cross-Contract Complexity**

Testing contracts that invoke other contracts is particularly challenging:
- Requires deploying multiple contracts to testnet
- Difficult to mock dependent contract behavior
- Hard to reproduce specific failure scenarios
- No easy way to spoof auth contexts

## How SoroSim Solves This

SoroSim addresses every pain point in the current Soroban development workflow:

| **Challenge** | **SoroSim Solution** |
|---------------|---------------------|
| Terminal-only simulation | Full browser-based UI with visual state inspector |
| No state visualization | Interactive before/after diffs with ScVal prettification |
| Testnet dependency | Pure local simulation with configurable mock state |
| Complex setup | Drag-and-drop WASM upload, instant simulation |
| Cross-contract testing | Built-in support for multi-contract scenarios with mock dependencies |
| Auth complexity | Spoof signer contexts and authorization entries |
| Reproducibility | Save/load session snapshots for deterministic testing |
| CI integration | CLI tool for automated contract validation |

## The Ecosystem Gap

While the Soroban ecosystem has grown rapidly, a **browser-based contract simulation sandbox** remains a documented gap:

- **Remix IDE equivalent**: Ethereum developers have Remix, Solidity developers have online playgrounds — Soroban has nothing comparable
- **SorobanHub**: Manages deployed contracts and interactions but doesn't provide local simulation or state inspection
- **Stellar CLI**: Excellent for production workflows but not designed for iterative development
- **Existing tools**: Focus on deployment and management, not simulation and debugging

SoroSim fills this critical gap by providing:

✅ **Zero-friction prototyping** — paste WASM, configure state, invoke  
✅ **Visual debugging** — see state changes, not just logs  
✅ **Testnet independence** — simulate any scenario locally  
✅ **CI/CD ready** — automate contract validation in your pipeline  

## Who Should Use SoroSim?

### Smart Contract Developers
- Rapidly prototype and test contract logic
- Debug state transitions visually
- Test edge cases without testnet deployment
- Validate contract behavior before deployment

### Protocol Engineers
- Simulate complex cross-contract interactions
- Test auth flows and signer scenarios
- Analyze storage footprints and costs
- Reproduce production issues locally

### DevOps/CI Teams
- Integrate contract testing into CI/CD pipelines
- Automate pre-deployment validation
- Catch regressions before testnet
- Generate test coverage reports

### Educators & Students
- Learn Soroban development without testnet friction
- Experiment with contract patterns safely
- Visualize how contracts modify state
- Understand ScVal types and ledger entries

## Getting Started

Ready to simulate your first contract? Choose your path:

- **[Browser Quickstart](/docs/quickstart/browser)** — Upload a WASM and simulate in 5 minutes
- **[CLI Quickstart](/docs/quickstart/cli)** — Install the CLI and run your first simulation
- **[Core Concepts](/docs/concepts/ledger-entries)** — Understand Soroban ledger entries and simulation mechanics
- **[Guides](/docs/guides/mock-ledger)** — Deep-dive into mock ledger configuration, cross-contract calls, and more

## Project Status & Roadmap

SoroSim is **actively developed** and growing rapidly. Key milestones:

- ✅ **v0.1**: Core simulation engine and basic browser UI
- ✅ **v0.2**: Visual state inspector and diff visualization
- ✅ **v0.3**: CLI tool and CI integration support
- 🚧 **v0.4**: Advanced auth spoofing and session snapshots (in progress)
- 📋 **v0.5**: Multi-contract simulation and dependency mocking (planned)
- 📋 **v1.0**: Production-ready with comprehensive test coverage (planned)

See the full [roadmap](/docs/roadmap) for planned features and Drips Wave bounties.

## Community & Contribution

SoroSim is open-source and community-driven. We welcome contributions of all kinds:

- 🐛 **Bug reports** — Help us identify and fix issues
- 💡 **Feature requests** — Suggest improvements and new capabilities
- 🔧 **Code contributions** — Submit PRs for bug fixes or new features
- 📖 **Documentation** — Improve guides, examples, and tutorials
- 🎨 **UI/UX** — Enhance the browser sandbox experience

Check out the [Contributing Guide](/docs/contributing) to get started.

---

**Next**: Learn how to [simulate your first contract in the browser](/docs/quickstart/browser) →
