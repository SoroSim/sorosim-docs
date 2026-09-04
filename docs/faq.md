# Frequently Asked Questions

Common questions, troubleshooting tips, and solutions for SoroSim users.

## General

### What is SoroSim?

SoroSim is an open-source Soroban contract simulation and testing tool. It lets you test smart contracts locally without deploying to testnet, with visual state inspection and detailed debugging capabilities.

**Key features:**
- Browser-based and CLI interfaces
- Mock ledger configuration
- Visual state diff inspection
- Cross-contract simulation
- CI/CD integration

---

### How is SoroSim different from the Stellar CLI?

| Feature | SoroSim | Stellar CLI |
|---------|---------|-------------|
| **Network** | Local only | Testnet/Mainnet |
| **Speed** | Instant | ~5-6 seconds |
| **Cost** | Free | XLM fees |
| **State Control** | Full control | Real network state |
| **Visualization** | Rich UI + diffs | Terminal only |
| **Use Case** | Development/Testing | Deployment/Production |

**Use both:**
- SoroSim for rapid development and testing
- Stellar CLI for testnet validation and mainnet deployment

---

### Do I need testnet XLM to use SoroSim?

**No.** SoroSim runs entirely locally and doesn't interact with any blockchain network. No XLM, no testnet, no RPC endpoints required.

---

### Can SoroSim deploy contracts to testnet or mainnet?

**No.** SoroSim is for local simulation only. Use the Stellar CLI to deploy contracts:

```bash
# After testing in SoroSim, deploy with Stellar CLI
stellar contract deploy \
  --wasm contract.wasm \
  --source GADMIN... \
  --network testnet
```

---

### Is SoroSim open source?

**Yes.** All components are open source:

- **Browser UI:** [github.com/sorosim/sorosim-frontend](https://github.com/sorosim/sorosim-frontend)
- **Backend API:** [github.com/sorosim/sorosim-backend](https://github.com/sorosim/sorosim-backend)
- **CLI:** [github.com/sorosim/sorosim-cli](https://github.com/sorosim/sorosim-cli)
- **Contracts:** [github.com/sorosim/sorosim-contracts](https://github.com/sorosim/sorosim-contracts)

Licensed under Apache 2.0.

---

## WASM & Contract Issues

### My WASM file won't upload

**Error:** "Failed to parse WASM bytecode"

**Common causes:**

1. **Not a WASM file**
   ```bash
   # Check file type
   file contract.wasm
   # Should output: WebAssembly (wasm) binary module
   ```

2. **Wrong build target**
   ```bash
   # Ensure you're building for wasm32-unknown-unknown
   soroban contract build
   # Not: cargo build
   ```

3. **Corrupted file**
   ```bash
   # Rebuild contract
   cd contracts/my_contract
   cargo clean
   soroban contract build
   ```

4. **File path issue**
   ```bash
   # Use absolute path
   sorosim simulate --wasm /full/path/to/contract.wasm ...
   ```

---

### How do I build a Soroban contract?

**Prerequisites:**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add wasm target
rustup target add wasm32-unknown-unknown

# Install Soroban CLI
cargo install --locked soroban-cli
```

**Build:**
```bash
cd your-contract-directory
soroban contract build
```

**WASM location:**
```
target/wasm32-unknown-unknown/release/your_contract.wasm
```

---

### What Soroban SDK versions are supported?

SoroSim supports Soroban SDK **v20.0.0 and later**.

**Check your contract's SDK version:**
```bash
sorosim inspect --wasm contract.wasm
# Look for: SDK Version: 20.5.0
```

**Update SDK in Cargo.toml:**
```toml
[dependencies]
soroban-sdk = "20.5.0"
```

---

### Contract simulation fails with "Function not found"

**Error:** "Function 'my_function' not found in contract"

**Causes:**

1. **Function name typo**
   ```bash
   # List all functions
   sorosim inspect --wasm contract.wasm --functions-only
   
   # Check exact name
   sorosim simulate --wasm contract.wasm --function transfer
   # Not: Transfer, TRANSFER, or transferTokens
   ```

2. **Function not exported**
   ```rust
   // Rust: Function must be in #[contractimpl] block
   #[contractimpl]
   impl MyContract {
       pub fn my_function(env: Env) { } // ✓ Exported
   }
   
   impl MyContract {
       fn helper_function(env: Env) { } // ✗ Not exported
   }
   ```

3. **Wrong contract version**
   - Rebuild contract
   - Ensure you're using the latest WASM

---

### Why does my contract invocation fail with "Invalid argument type"?

**Error:** "Expected Address, got String"

**Cause:** ScVal type mismatch

**Solution:** Use correct ScVal types:

```bash
# ✗ Wrong
--args '[{"type":"String","value":"GUSER...XYZ"}]'

# ✓ Correct
--args '[{"type":"Address","value":"GUSER...XYZ"}]'
```

**Common mistakes:**

| Wrong | Correct |
|-------|---------|
| `String` for addresses | `Address` |
| `U64` for timestamps | `Timepoint` |
| `Number` (raw) | `{"type":"U32","value":42}` |
| `String` for symbols | `Symbol` |

See [ScVal Types Guide](/docs/concepts/scval-types) for complete reference.

---

## Authorization Issues

### Simulation fails with "Authorization required"

**Error:** "Authorization required from GUSER...XYZ"

**Cause:** Contract requires auth but none provided

**Solution:** Add `--auth` flag:

```bash
sorosim simulate \
  --wasm token.wasm \
  --function transfer \
  --args '[{"type":"Address","value":"GALICE..."},...]' \
  --auth '{"address":"GALICE...XYZ"}'
```

**For multiple addresses:**
```bash
--auth '{"addresses":["GALICE...XYZ","GBOB...DEF"]}'
```

See [Auth Context Guide](/docs/guides/auth-context) for details.

---

### How do I test admin-only functions?

**Admin functions require auth from admin address:**

```bash
# 1. Configure admin in ledger
cat > ledger.json <<EOF
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "Admin"},
      "value": {"type": "Address", "value": "GADMIN...XYZ"},
      "durability": "Persistent"
    }
  ]
}
EOF

# 2. Simulate with admin auth
sorosim simulate \
  --wasm contract.wasm \
  --function admin_function \
  --ledger ledger.json \
  --auth '{"address":"GADMIN...XYZ"}'
```

---

### Can I test multi-sig scenarios?

**Yes.** Configure account with threshold and signers:

```json
{
  "entries": [
    {
      "type": "Account",
      "accountId": "GMULTISIG...XYZ",
      "balance": "10000000000",
      "seqNum": "1",
      "thresholds": {
        "low": 1,
        "medium": 2,
        "high": 3,
        "masterWeight": 1
      },
      "signers": [
        {"key": "GSIGNER1...ABC", "weight": 1},
        {"key": "GSIGNER2...DEF", "weight": 2}
      ]
    }
  ]
}
```

Then provide auth meeting threshold:

```bash
--auth '{
  "authorizations":[{
    "address":"GMULTISIG...XYZ",
    "providedSignatures":[
      {"signer":"GSIGNER2...DEF","weight":2}
    ],
    "requiredWeight":2
  }]
}'
```

---

## State & Storage Issues

### State changes aren't appearing in the diff

**Possible causes:**

1. **Contract didn't modify storage**
   - Check contract logic
   - Verify function writes to storage

2. **Wrong durability**
   ```bash
   # Check both Persistent and Temporary
   sorosim simulate ... --verbose
   # Look for state changes in both categories
   ```

3. **Simulation failed before write**
   - Check for errors in output
   - Function may have returned early

4. **Key mismatch**
   ```rust
   // Contract reads with key "COUNTER"
   env.storage().persistent().get(&symbol_short!("COUNTER"))
   
   // But mock ledger has "Counter" (different!)
   ```
   Keys are case-sensitive.

---

### How do I pre-populate contract storage?

**Use mock ledger configuration:**

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

**Save to file and load:**
```bash
sorosim simulate \
  --wasm contract.wasm \
  --function transfer \
  --ledger initial-state.json
```

See [Mock Ledger Guide](/docs/guides/mock-ledger) for patterns.

---

### What's the difference between Persistent and Temporary storage?

| Aspect | Persistent | Temporary |
|--------|-----------|-----------|
| **Lifetime** | Long-term | Short-term |
| **Cost** | Higher | Lower |
| **Use Case** | Critical data | Cache, session data |
| **Example** | Balances, ownership | Price cache, temp locks |

**In Rust:**
```rust
// Persistent
env.storage().persistent().set(&key, &value);

// Temporary
env.storage().temporary().set(&key, &value);
```

**In mock ledger:**
```json
{
  "durability": "Persistent"  // or "Temporary"
}
```

---

## Cross-Contract Issues

### Cross-contract call fails with "Contract not found"

**Error:** "Contract CCALLEE...ABC not found in ledger"

**Cause:** Callee contract WASM not provided

**Solution:** Add `ContractCode` entry:

```json
{
  "entries": [
    {
      "type": "ContractCode",
      "contractId": "CCALLEE...ABC",
      "hash": "contract_wasm_hash",
      "wasm": "<base64-encoded-callee-wasm>"
    }
  ]
}
```

**Encode WASM to base64:**
```bash
# Linux/Mac
base64 -w 0 callee.wasm

# Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("callee.wasm"))
```

See [Cross-Contract Guide](/docs/guides/cross-contract) for details.

---

### How do I mock an external contract?

**Option 1:** Provide a minimal mock contract:

```rust
// mock_oracle.rs
#[contract]
pub struct MockOracle;

#[contractimpl]
impl MockOracle {
    pub fn get_price(env: Env, asset: Symbol) -> u64 {
        50000 // Fixed price for testing
    }
}
```

Build and include in ledger config.

**Option 2:** Pre-configure return values in storage (if contract reads from storage).

---

## Performance & Limits

### My simulation is slow

**Possible causes:**

1. **Large WASM file**
   - Optimize contract size
   - Remove unused dependencies

2. **Complex computation**
   - Contract is CPU-intensive
   - This is expected behavior

3. **Large ledger state**
   - Reduce mock ledger entries
   - Only include necessary state

**Check metrics:**
```bash
sorosim simulate ... --output json | jq '.metrics'
```

---

### Is there a size limit for WASM files?

**Browser:** 1 MB per WASM file  
**CLI:** 10 MB per WASM file  
**API:** 5 MB per request

Most contracts are 20-100 KB. If you exceed limits:
- Remove unused dependencies
- Optimize contract code
- Split into multiple contracts

---

### How many simulations can I run?

**Browser:** Unlimited (local execution)  
**CLI:** Unlimited (local execution)  
**API:** Rate limited (60 requests/minute for `/simulate`)

See [API Reference](/docs/api/overview#rate-limits) for details.

---

## CLI Issues

### CLI command not found

**Error:** `sorosim: command not found`

**Solution:**

```bash
# 1. Verify installation
npm list -g sorosim-cli

# 2. Check npm global bin path
npm config get prefix

# 3. Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$PATH:$(npm config get prefix)/bin"

# 4. Reload shell
source ~/.bashrc  # or source ~/.zshrc

# 5. Try using npx
npx sorosim-cli --version
```

---

### JSON parsing error in CLI

**Error:** "Invalid JSON in --args"

**Common issues:**

1. **Single quotes in JSON** (use double quotes)
   ```bash
   # ✗ Wrong
   --args '[{'type':'U32','value':42}]'
   
   # ✓ Correct
   --args '[{"type":"U32","value":42}]'
   ```

2. **Escaping issues in shell**
   ```bash
   # Use args file instead
   echo '[{"type":"U32","value":42}]' > args.json
   sorosim simulate --args-file args.json ...
   ```

3. **Validate JSON first**
   ```bash
   echo '[{"type":"U32","value":42}]' | jq .
   ```

---

## Browser Issues

### Browser simulation fails silently

**Check browser console** (F12 → Console):
- Look for JavaScript errors
- Check for CORS issues
- Verify WASM module loaded

**Try:**
- Refresh page
- Clear browser cache
- Use incognito/private mode
- Try different browser

---

### Can I use SoroSim offline?

**Browser:** Yes, after initial load (Progressive Web App)  
**CLI:** Yes, completely offline  
**API:** No, requires internet connection

---

## RPC & Network Issues

### Do I need an RPC endpoint for SoroSim?

**No.** SoroSim doesn't connect to any network. It simulates everything locally.

**Exception:** If you want to import real testnet/mainnet state into SoroSim, you'd query RPC manually and convert to mock ledger config.

---

### Can SoroSim connect to testnet?

**No.** SoroSim is local-only by design.

**Workflow:**
1. Develop and test in SoroSim (local)
2. Deploy to testnet with Stellar CLI
3. Test on testnet with Stellar CLI
4. Deploy to mainnet with Stellar CLI

---

### How do I test with real network state?

**Export state from network:**

```bash
# 1. Query testnet with Stellar CLI
stellar contract invoke \
  --id CTOKEN...ABC \
  --network testnet \
  --simulate-only \
  -- \
  balance \
  --id GUSER...XYZ

# 2. Manually convert output to SoroSim ledger config
# (No automated tool yet)

# 3. Use in SoroSim
sorosim simulate --ledger testnet-state.json ...
```

---

## Integration & CI

### How do I use SoroSim in CI/CD?

See the [CI Integration Guide](/docs/guides/ci-integration) for complete examples.

**Quick setup:**
```yaml
# .github/workflows/test.yml
- name: Install SoroSim CLI
  run: npm install -g sorosim-cli

- name: Run simulations
  run: ./scripts/run-simulations.sh
```

---

### Can I generate test reports?

**Yes.**

```bash
# JUnit format (for CI)
sorosim validate --suite tests.json --output junit > results.xml

# JSON format
sorosim validate --suite tests.json --output json > results.json
```

---

## Advanced Topics

### Can I modify SoroSim's simulation engine?

**Yes.** SoroSim is open source. The simulation engine is in:
[github.com/sorosim/sorosim-backend](https://github.com/sorosim/sorosim-backend)

Contributions welcome!

---

### Does SoroSim support custom host functions?

**Not yet.** SoroSim uses the standard Soroban host environment. Custom host functions would require modifying the simulation engine.

---

### Can I use SoroSim for fuzz testing?

**Yes.** Generate random inputs and run simulations:

```bash
#!/bin/bash
for i in {1..1000}; do
  AMOUNT=$((RANDOM % 1000000))
  sorosim simulate \
    --wasm token.wasm \
    --function transfer \
    --args "[..., {\"type\":\"I128\",\"value\":\"$AMOUNT\"}]" \
    || echo "Failed with amount: $AMOUNT"
done
```

---

## Getting Help

### Where can I ask questions?

- 💬 **Discord:** [discord.gg/stellar](https://discord.gg/stellar) (SoroSim channel)
- 📖 **GitHub Discussions:** [github.com/sorosim/sorosim/discussions](https://github.com/sorosim/sorosim/discussions)
- 🐛 **GitHub Issues:** [github.com/sorosim/sorosim/issues](https://github.com/sorosim/sorosim/issues)

---

### How do I report a bug?

**GitHub Issues:** [github.com/sorosim/sorosim/issues/new](https://github.com/sorosim/sorosim/issues/new)

**Include:**
- SoroSim version (`sorosim --version`)
- Operating system
- Contract WASM (if possible)
- Steps to reproduce
- Expected vs actual behavior
- Error messages (full output)
- Session snapshot (if applicable)

---

### How can I contribute?

See the [Contributing Guide](/docs/contributing) for details.

**Ways to contribute:**
- Report bugs
- Suggest features
- Improve documentation
- Submit code changes
- Share example contracts
- Help other users

---

## Related Documentation

- **[Browser Quickstart](/docs/quickstart/browser)** — Getting started in browser
- **[CLI Quickstart](/docs/quickstart/cli)** — Getting started with CLI
- **[Concepts](/docs/concepts/ledger-entries)** — Core concepts explained
- **[Guides](/docs/guides/mock-ledger)** — Detailed how-to guides
- **[Contributing](/docs/contributing)** — How to contribute

---

## Still Have Questions?

If your question isn't answered here:

1. **Search the docs:** Use the search bar (top-right)
2. **Ask on Discord:** [discord.gg/stellar](https://discord.gg/stellar)
3. **GitHub Discussions:** [Ask the community](https://github.com/sorosim/sorosim/discussions)
4. **Open an issue:** [github.com/sorosim/sorosim/issues](https://github.com/sorosim/sorosim/issues)

We're here to help! 🚀
