# Roadmap

SoroSim's development roadmap with planned features, milestones, and community bounties.

## Vision

**Make SoroSim the essential tool for every Soroban developer** — from prototype to production.

Our goal is to provide the fastest, most intuitive way to develop, test, and deploy Soroban smart contracts.

---

## Current Version: v0.3.0

**Released:** January 2024

**Highlights:**
- ✅ Browser-based contract simulation
- ✅ CLI tool for automation
- ✅ Visual state diff inspector
- ✅ Cross-contract invocation support
- ✅ Session snapshots
- ✅ CI/CD integration guides

---

## Upcoming Releases

### v0.4.0 — Enhanced Testing & Debugging (Q1 2024)

**Theme:** Better debugging and testing workflows

**Features:**

- [ ] **Advanced Auth Spoofing**
  - Multi-sig threshold testing
  - Time-locked authorization
  - Custom signer weights
  - **Bounty:** 500 USDC

- [ ] **Enhanced Session Snapshots**
  - Snapshot comparison view
  - Snapshot merging
  - Automated snapshot generation
  - **Bounty:** 400 USDC

- [ ] **Breakpoint Debugging**
  - Step-through contract execution
  - Variable inspection at breakpoints
  - Call stack visualization
  - **Bounty:** 800 USDC

- [ ] **Event Log Filtering**
  - Filter events by type
  - Search event data
  - Export event logs
  - **Bounty:** 300 USDC

- [ ] **Performance Profiling**
  - CPU instruction breakdown by function
  - Memory allocation tracking
  - Hotspot identification
  - **Bounty:** 600 USDC

**Target Date:** March 2024

---

### v0.5.0 — Multi-Contract Workflows (Q2 2024)

**Theme:** Advanced cross-contract testing

**Features:**

- [ ] **Contract Dependency Management**
  - Define contract dependencies
  - Auto-load dependent contracts
  - Version management
  - **Bounty:** 500 USDC

- [ ] **Mock Contract Generator**
  - Generate mock contracts from interfaces
  - Configurable return values
  - Response recording/playback
  - **Bounty:** 700 USDC

- [ ] **Call Graph Visualization**
  - Visual cross-contract call chains
  - Interactive graph exploration
  - Export call graphs
  - **Bounty:** 600 USDC

- [ ] **Parallel Simulation**
  - Run multiple simulations concurrently
  - Compare results side-by-side
  - Batch simulation from CSV
  - **Bounty:** 500 USDC

- [ ] **Advanced Footprint Analysis**
  - Cost breakdown by operation
  - Optimization suggestions
  - Historical cost tracking
  - **Bounty:** 400 USDC

**Target Date:** June 2024

---

### v0.6.0 — Real Network Integration (Q3 2024)

**Theme:** Bridge local and network testing

**Features:**

- [ ] **Testnet State Import**
  - Import real testnet state
  - Sync contract storage
  - Clone account balances
  - **Bounty:** 800 USDC

- [ ] **Hybrid Simulation Mode**
  - Simulate locally with testnet data
  - Fallback to real RPC for missing data
  - Cache network responses
  - **Bounty:** 900 USDC

- [ ] **Deployment Diff**
  - Compare local vs deployed contracts
  - Detect breaking changes
  - Generate migration plans
  - **Bounty:** 600 USDC

- [ ] **Testnet Validator**
  - Validate before deployment
  - Pre-flight checks
  - Compatibility warnings
  - **Bounty:** 500 USDC

- [ ] **Network Fork Mode**
  - Fork testnet/mainnet at specific block
  - Test against historical state
  - Time-travel simulations
  - **Bounty:** 1000 USDC

**Target Date:** September 2024

---

### v0.7.0 — Advanced Features (Q4 2024)

**Theme:** Power-user features

**Features:**

- [ ] **Property-Based Testing**
  - Generate random test inputs
  - Automatic invariant checking
  - Fuzz testing integration
  - **Bounty:** 800 USDC

- [ ] **Coverage Analysis**
  - Line coverage tracking
  - Branch coverage reports
  - Uncovered code highlighting
  - **Bounty:** 700 USDC

- [ ] **Time-Travel Debugging**
  - Rewind execution to any point
  - Inspect historical state
  - Replay with modifications
  - **Bounty:** 1000 USDC

- [ ] **Collaborative Sessions**
  - Real-time session sharing
  - Multi-user collaboration
  - WebSocket-based sync
  - **Bounty:** 900 USDC

- [ ] **AI-Powered Suggestions**
  - Contract optimization suggestions
  - Bug pattern detection
  - Gas optimization tips
  - **Bounty:** 1200 USDC

**Target Date:** December 2024

---

### v1.0.0 — Production Ready (Q1 2025)

**Theme:** Stability, polish, and performance

**Goals:**

- [ ] **Comprehensive Test Suite**
  - 90%+ code coverage
  - Load testing
  - Security audit
  - **Bounty:** 1500 USDC

- [ ] **Performance Optimization**
  - Sub-100ms simulation latency
  - Optimized memory usage
  - Faster WASM parsing
  - **Bounty:** 1000 USDC

- [ ] **Documentation Completion**
  - Video tutorials
  - Interactive guides
  - Multi-language support
  - **Bounty:** 800 USDC

- [ ] **Enterprise Features**
  - Self-hosted option
  - SSO integration
  - Team management
  - **Bounty:** 1500 USDC

- [ ] **Monitoring & Analytics**
  - Usage analytics dashboard
  - Performance metrics
  - Error tracking
  - **Bounty:** 700 USDC

**Target Date:** March 2025

---

## Community Wishlist

These features are highly requested but not yet scheduled. Vote on [GitHub Discussions](https://github.com/sorosim/sorosim/discussions/categories/feature-requests)!

### Testing & Quality
- [ ] Mutation testing
- [ ] Contract upgrade testing
- [ ] Gas estimation improvements
- [ ] Stress testing toolkit

### Developer Experience
- [ ] VS Code extension
- [ ] IntelliJ plugin
- [ ] Smart contract templates
- [ ] Contract scaffolding CLI

### Integration
- [ ] SorobanHub integration
- [ ] Stellar Expert integration
- [ ] GitHub Actions templates
- [ ] Docker compose setup

### Advanced Features
- [ ] Custom host functions
- [ ] Plugin system
- [ ] Scripting API (JavaScript)
- [ ] GraphQL API

### UI/UX
- [ ] Dark mode
- [ ] Mobile-responsive design
- [ ] Keyboard shortcuts
- [ ] Customizable themes

---

## Drips Wave Program

SoroSim participates in the **Stellar Drips Wave** program, offering bounties for community contributions.

### How Bounties Work

1. **Find an Issue:** Look for issues labeled `drips-wave` or `bounty`
2. **Claim It:** Comment on the issue to claim it
3. **Build It:** Implement the feature following our guidelines
4. **Submit PR:** Submit a pull request with your changes
5. **Get Paid:** After review and merge, receive your bounty!

### Bounty Tiers

| Tier | Amount | Complexity | Examples |
|------|--------|------------|----------|
| 🥉 **Small** | $200-400 | 1-3 days | UI improvements, bug fixes, documentation |
| 🥈 **Medium** | $400-800 | 1-2 weeks | New features, API endpoints, integrations |
| 🥇 **Large** | $800-1500 | 2-4 weeks | Major features, architecture changes, complex systems |

### Current Bounties

**Available Now:**

| Feature | Amount | Difficulty | Status |
|---------|--------|------------|--------|
| Advanced Auth Spoofing | $500 | Medium | 🟢 Available |
| Event Log Filtering | $300 | Small | 🟢 Available |
| Performance Profiling | $600 | Medium | 🟢 Available |
| Mock Contract Generator | $700 | Medium | 🟢 Available |
| Call Graph Visualization | $600 | Medium | 🟢 Available |

**In Progress:**

| Feature | Assignee | ETA |
|---------|----------|-----|
| Enhanced Session Snapshots | @contributor1 | Feb 2024 |
| Breakpoint Debugging | @contributor2 | Mar 2024 |

**Browse all bounties:** [GitHub Issues](https://github.com/sorosim/sorosim/labels/drips-wave)

---

## Contribution Priorities

Want to contribute but not sure where to start? Focus on these areas:

### 🔥 High Priority
1. **Testnet State Import** — Most requested feature
2. **Breakpoint Debugging** — High developer value
3. **Property-Based Testing** — Quality improvement
4. **Performance Optimization** — User experience

### 📈 Medium Priority
1. **Coverage Analysis** — Testing improvement
2. **Mock Contract Generator** — Developer convenience
3. **Call Graph Visualization** — Debugging aid
4. **Deployment Diff** — Safety feature

### 💡 Low Priority
1. **UI Theme Customization** — Nice to have
2. **Plugin System** — Extensibility
3. **Mobile Support** — Broader access
4. **Scripting API** — Advanced users

---

## Past Milestones

### v0.3.0 (January 2024)
- ✅ Session snapshots
- ✅ CLI tool
- ✅ Cross-contract simulation
- ✅ CI/CD integration

### v0.2.0 (November 2023)
- ✅ Visual state diff
- ✅ Auth context spoofing
- ✅ Mock ledger configuration
- ✅ Browser UI improvements

### v0.1.0 (September 2023)
- ✅ Core simulation engine
- ✅ Basic browser UI
- ✅ REST API
- ✅ Sample contracts

---

## How to Influence the Roadmap

### Vote on Features
- 👍 Upvote issues on GitHub
- 💬 Comment with use cases
- 📊 Participate in polls

### Propose Features
1. Open a [Feature Request](https://github.com/sorosim/sorosim/issues/new?template=feature_request.md)
2. Describe the problem and solution
3. Gather community feedback
4. Maintainers will review and prioritize

### Sponsor Development
- 💰 Sponsor via GitHub Sponsors
- 🏢 Enterprise sponsorship for priority features
- 🎯 Fund specific bounties

---

## Release Schedule

**Cadence:** New minor version every ~3 months  
**Patch releases:** As needed for critical bugs

### Upcoming Dates

| Release | Target Date | Feature Freeze | Code Freeze |
|---------|-------------|----------------|-------------|
| v0.4.0 | Mar 15, 2024 | Mar 1, 2024 | Mar 8, 2024 |
| v0.5.0 | Jun 15, 2024 | Jun 1, 2024 | Jun 8, 2024 |
| v0.6.0 | Sep 15, 2024 | Sep 1, 2024 | Sep 8, 2024 |
| v0.7.0 | Dec 15, 2024 | Dec 1, 2024 | Dec 8, 2024 |
| v1.0.0 | Mar 15, 2025 | Mar 1, 2025 | Mar 8, 2025 |

---

## Development Philosophy

### Principles

1. **Developer First** — Optimize for developer experience
2. **Quality Over Speed** — Stable, well-tested releases
3. **Community Driven** — Listen to user feedback
4. **Open & Transparent** — Public roadmap, open development
5. **Backward Compatible** — Minimize breaking changes

### Decision Making

**Feature Prioritization Criteria:**
1. User impact (how many users benefit?)
2. Development effort (time/complexity)
3. Strategic value (aligns with vision?)
4. Community demand (votes/requests)
5. Dependencies (blocks other features?)

---

## FAQ

### When will feature X be released?

Check the roadmap above for target dates. Dates are estimates and may shift based on development progress.

### Can I request a feature not on the roadmap?

Yes! Open a [Feature Request](https://github.com/sorosim/sorosim/issues/new?template=feature_request.md).

### How do I claim a bounty?

Comment on the issue saying you'd like to work on it. Maintainers will assign it to you.

### Can I work on multiple bounties?

Yes, but please complete one before claiming another to give others a chance.

### What if I can't finish a bounty?

No problem! Just comment on the issue so we can reassign it.

### Are there bounties for non-code contributions?

Yes! Documentation, tutorials, and testing also have bounties.

---

## Stay Updated

### Follow Progress

- 📊 **Project Board:** [GitHub Projects](https://github.com/orgs/sorosim/projects/1)
- 📰 **Changelog:** [CHANGELOG.md](https://github.com/sorosim/sorosim/blob/main/CHANGELOG.md)
- 🐦 **Twitter:** [@SoroSim](https://twitter.com/sorosim)
- 💬 **Discord:** [#sorosim channel](https://discord.gg/stellar)

### Monthly Updates

Subscribe to our monthly newsletter for:
- Feature releases
- New bounties
- Community highlights
- Development updates

**Sign up:** [sorosim.dev/newsletter](https://sorosim.dev/newsletter)

---

## Related Links

- **[Contributing Guide](/docs/contributing)** — How to contribute
- **[Architecture](/docs/architecture)** — System design
- **[GitHub Discussions](https://github.com/sorosim/sorosim/discussions)** — Community discussions
- **[Stellar Drips](https://drips.network/stellar)** — Bounty program details

---

## Questions?

- 💬 **Discord**: [Ask about the roadmap](https://discord.gg/stellar)
- 📖 **Discussions**: [Feature discussions](https://github.com/sorosim/sorosim/discussions/categories/roadmap)
- 📧 **Email**: roadmap@sorosim.dev

---

**Last Updated:** January 15, 2024  
**Next Review:** February 1, 2024
