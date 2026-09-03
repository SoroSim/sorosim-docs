# Auth Context Simulation Guide

Authorization is critical for secure smart contracts. This guide explains how to simulate authentication contexts in SoroSim, test auth requirements, and spoof signers for comprehensive testing.

## What is Auth Context?

**Auth context** (authorization context) defines who is authorized to execute a contract function and what permissions they have. In Soroban:

- Contracts can **require authorization** from specific addresses
- Authorization is checked during function execution
- Failed auth checks cause transaction rejection

**Example:**
```rust
pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
    from.require_auth();  // ← Requires authorization from 'from' address
    // ... transfer logic
}
```

---

## Why Auth Simulation Matters

In production, authorization requires:
- Real account signatures
- Proper transaction structure
- Valid signature expiration
- Correct nonce values

In SoroSim, you can **spoof authorization** to:
- ✅ Test auth-protected functions without real signatures
- ✅ Simulate different signer scenarios
- ✅ Validate auth logic quickly
- ✅ Test multi-sig and threshold requirements
- ✅ Reproduce auth-related bugs

---

## Basic Auth Simulation

### Browser UI

**Step 1: Access Auth Panel**
```
1. Load your contract
2. Select function requiring auth
3. Click "Configure Auth" tab
4. Enable "Spoof Authorization"
```

**Step 2: Add Authorized Addresses**
```
Auth Context:
  ☑ Spoof Authorization
  
  Authorized Addresses:
    • GALICE...XYZ  [✓ Authorized]
    • GBOB...DEF    [✗ Not Authorized]
```

**Step 3: Simulate**
```
Function: transfer
  from: GALICE...XYZ  ✓ Auth will succeed
  to:   GBOB...DEF
  amount: 100
  
[Simulate Invocation]
```

---

### CLI

Use `--auth` flag to specify authorized addresses:

```bash
sorosim simulate \
  --wasm token.wasm \
  --function transfer \
  --args '[
    {"type":"Address","value":"GALICE...XYZ"},
    {"type":"Address","value":"GBOB...DEF"},
    {"type":"I128","value":"100"}
  ]' \
  --auth '{"address":"GALICE...XYZ"}'
```

**Output:**
```
✓ Simulation completed

Auth Check:
  Address: GALICE...XYZ
  Status: ✓ Authorized (spoofed)

Result: Void

State Changes:
  ~ Balance(GALICE)  I128(1000) → I128(900)
  ~ Balance(GBOB)    I128(500) → I128(600)
```

---

## Auth Context Structure

### Simple Auth

**JSON Structure:**
```json
{
  "address": "GALICE...XYZ"
}
```

Authorizes a single address for all auth checks.

---

### Multi-Address Auth

**JSON Structure:**
```json
{
  "addresses": [
    "GALICE...XYZ",
    "GBOB...DEF",
    "GCHARLOTTE...GHI"
  ]
}
```

All listed addresses are authorized.

---

### Advanced Auth Context

**JSON Structure:**
```json
{
  "authorizations": [
    {
      "address": "GALICE...XYZ",
      "signatureExpirationLedger": 1000,
      "invocations": ["transfer", "burn"]
    },
    {
      "address": "GBOB...DEF",
      "signatureExpirationLedger": 2000,
      "invocations": ["mint"]
    }
  ]
}
```

**Fields:**
- `address` — The authorized address
- `signatureExpirationLedger` — Signature validity (ledger number)
- `invocations` — Specific functions this auth covers (optional)

---

## Testing Auth Scenarios

### Scenario 1: Single Signer Authorization

**Contract Function:**
```rust
pub fn withdraw(env: Env, user: Address, amount: i128) {
    user.require_auth();
    // Withdrawal logic
}
```

**Simulation:**
```bash
sorosim simulate \
  --wasm bank.wasm \
  --function withdraw \
  --args '[
    {"type":"Address","value":"GALICE...XYZ"},
    {"type":"I128","value":"500"}
  ]' \
  --auth '{"address":"GALICE...XYZ"}'
```

**Result:**
```
✓ Auth check passed for GALICE...XYZ
✓ Withdrawal successful
```

---

### Scenario 2: Unauthorized Access (Should Fail)

**Test that auth failure is caught:**

```bash
sorosim simulate \
  --wasm bank.wasm \
  --function withdraw \
  --args '[
    {"type":"Address","value":"GALICE...XYZ"},
    {"type":"I128","value":"500"}
  ]'
  # Note: No --auth flag provided
```

**Expected Result:**
```
❌ Simulation failed

Error: Authorization required
  Function: withdraw
  Required auth from: GALICE...XYZ
  Provided auth: None

Tip: Use --auth flag to spoof authorization
```

---

### Scenario 3: Multi-Sig Authorization

**Contract Function:**
```rust
pub fn admin_action(env: Env, signers: Vec<Address>) {
    for signer in signers {
        signer.require_auth();
    }
    // Admin action logic
}
```

**Configuration:**

**multi-sig-auth.json:**
```json
{
  "addresses": [
    "GADMIN1...ABC",
    "GADMIN2...DEF",
    "GADMIN3...GHI"
  ]
}
```

**Simulation:**
```bash
sorosim simulate \
  --wasm governance.wasm \
  --function admin_action \
  --args '[
    {
      "type":"Vec",
      "value":[
        {"type":"Address","value":"GADMIN1...ABC"},
        {"type":"Address","value":"GADMIN2...DEF"},
        {"type":"Address","value":"GADMIN3...GHI"}
      ]
    }
  ]' \
  --auth-file multi-sig-auth.json
```

**Result:**
```
✓ Auth checks passed:
  • GADMIN1...ABC ✓
  • GADMIN2...DEF ✓
  • GADMIN3...GHI ✓

✓ Admin action executed
```

---

### Scenario 4: Threshold Signatures

**Stellar Account with Threshold:**
```json
{
  "type": "Account",
  "accountId": "GMULTISIG...XYZ",
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
```

**Auth Context (Medium Threshold = 2):**
```json
{
  "authorizations": [
    {
      "address": "GMULTISIG...XYZ",
      "providedSignatures": [
        {"signer": "GSIGNER2...DEF", "weight": 2}
      ],
      "requiredWeight": 2
    }
  ]
}
```

**Simulation:**
```bash
sorosim simulate \
  --wasm contract.wasm \
  --function medium_threshold_action \
  --ledger accounts.json \
  --auth-file threshold-auth.json
```

---

## Advanced Auth Patterns

### Pattern 1: Contract-as-Signer

Contracts can require auth from other contracts.

**Example:**
```rust
pub fn proxy_transfer(env: Env, proxy: Address, from: Address, to: Address, amount: i128) {
    proxy.require_auth();  // Requires auth from proxy contract
    // Transfer logic
}
```

**Auth Context:**
```json
{
  "address": "CPROXY...ABC"
}
```

**Note:** Use contract address (C-prefix), not account address (G-prefix).

---

### Pattern 2: Time-Limited Authorization

Simulate expired signatures.

**Current Ledger: 1000**

**Valid Auth (expires at ledger 2000):**
```json
{
  "authorizations": [
    {
      "address": "GALICE...XYZ",
      "signatureExpirationLedger": 2000
    }
  ]
}
```

**Expired Auth (expired at ledger 500):**
```json
{
  "authorizations": [
    {
      "address": "GALICE...XYZ",
      "signatureExpirationLedger": 500
    }
  ]
}
```

**Simulation with ledger context:**
```bash
sorosim simulate \
  --wasm contract.wasm \
  --function time_sensitive \
  --auth-file expired-auth.json \
  --current-ledger 1000
```

**Expected Result:**
```
❌ Simulation failed

Error: Authorization expired
  Address: GALICE...XYZ
  Signature expired at ledger: 500
  Current ledger: 1000
```

---

### Pattern 3: Function-Specific Authorization

Authorize only specific function calls.

**Auth Context:**
```json
{
  "authorizations": [
    {
      "address": "GALICE...XYZ",
      "invocations": ["transfer", "approve"]
    }
  ]
}
```

**Allowed:**
```bash
# ✓ Transfer authorized
sorosim simulate --function transfer --auth-file auth.json ...

# ✓ Approve authorized
sorosim simulate --function approve --auth-file auth.json ...
```

**Not Allowed:**
```bash
# ✗ Mint not authorized
sorosim simulate --function mint --auth-file auth.json ...

# Result:
❌ Error: Authorization not provided for function 'mint'
```

---

### Pattern 4: Nested Auth Contexts

Cross-contract calls with auth requirements.

**Main Contract → Token Contract (requires auth)**

**Auth Context:**
```json
{
  "authorizations": [
    {
      "address": "GALICE...XYZ",
      "context": "CMAIN...ABC"
    },
    {
      "address": "GALICE...XYZ",
      "context": "CTOKEN...DEF"
    }
  ]
}
```

Auth is scoped to specific contract contexts.

---

## Testing Auth Failures

Always test that unauthorized access fails:

### Test Case 1: Missing Auth

```bash
# Should fail
sorosim simulate \
  --wasm token.wasm \
  --function transfer \
  --args '[...]'
  # Intentionally omit --auth flag
```

**Expected:** `❌ Authorization required`

---

### Test Case 2: Wrong Signer

```bash
# Should fail
sorosim simulate \
  --wasm token.wasm \
  --function transfer \
  --args '[{"type":"Address","value":"GALICE...XYZ"},...]' \
  --auth '{"address":"GBOB...DEF"}'  # Wrong address!
```

**Expected:** `❌ Required auth from GALICE...XYZ, got GBOB...DEF`

---

### Test Case 3: Insufficient Weight

```bash
# Should fail (need weight 2, only have weight 1)
sorosim simulate \
  --wasm multisig.wasm \
  --function high_threshold_action \
  --auth '{
    "authorizations":[{
      "address":"GMULTISIG...XYZ",
      "providedSignatures":[{"signer":"GSIGNER1...ABC","weight":1}],
      "requiredWeight":2
    }]
  }'
```

**Expected:** `❌ Insufficient signature weight: 1 < 2 required`

---

## Mock Ledger + Auth Configuration

Combine ledger state with auth context for complete scenarios.

**Complete Configuration:**

**scenario.json:**
```json
{
  "ledger": {
    "entries": [
      {
        "type": "Account",
        "accountId": "GALICE...XYZ",
        "balance": "10000000000",
        "seqNum": "1"
      },
      {
        "type": "ContractData",
        "contract": "CURRENT_CONTRACT",
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
  "auth": {
    "address": "GALICE...XYZ",
    "signatureExpirationLedger": 2000
  }
}
```

**Usage:**
```bash
sorosim simulate \
  --wasm token.wasm \
  --function transfer \
  --config scenario.json \
  --args '[...]'
```

---

## Browser Auth Configuration

### Auth Panel Features

**1. Quick Auth Toggle**
```
☑ Enable Auth Spoofing
  When enabled, all auth checks pass automatically
```

**2. Address List**
```
Authorized Addresses:
  + Add Address
  
  • GALICE...XYZ     [Remove]
  • GBOB...DEF       [Remove]
```

**3. Advanced Mode**
```
☐ Advanced Auth Configuration
  
  Signature Expiration: [2000] (ledger)
  Allowed Functions: [transfer, approve] (comma-separated)
  
  Multi-Sig Configuration:
    Threshold: [2]
    Signers:
      • GSIGNER1 (weight: 1)
      • GSIGNER2 (weight: 2)
```

---

## Common Auth Patterns by Contract Type

### Token Contract

**Required Auth:**
- `transfer(from, to, amount)` — Requires auth from `from`
- `approve(owner, spender, amount)` — Requires auth from `owner`
- `burn(from, amount)` — Requires auth from `from`

**Admin Auth:**
- `mint(to, amount)` — Requires auth from admin

**Config:**
```json
{
  "addresses": ["GUSER...XYZ", "GADMIN...ABC"]
}
```

---

### NFT Contract

**Required Auth:**
- `transfer(from, to, token_id)` — Requires auth from `from` (owner)
- `approve(owner, operator, token_id)` — Requires auth from `owner`
- `burn(owner, token_id)` — Requires auth from `owner`

**Admin Auth:**
- `mint(to, token_id, metadata)` — Requires auth from minter

---

### DAO/Voting Contract

**Required Auth:**
- `vote(voter, proposal_id, vote)` — Requires auth from `voter`
- `create_proposal(proposer, ...)` — Requires auth from `proposer`

**Admin/Multi-Sig Auth:**
- `execute_proposal(proposal_id)` — Requires multi-sig auth

---

## Debugging Auth Issues

### Enable Auth Tracing

**CLI:**
```bash
sorosim simulate \
  --wasm contract.wasm \
  --function my_function \
  --auth '...' \
  --trace-auth
```

**Output:**
```
Auth Trace:
  1. Function: transfer
     Required auth: GALICE...XYZ
     Provided auth: GALICE...XYZ
     ✓ Match

  2. Function: internal_helper
     Required auth: GADMIN...ABC
     Provided auth: (none)
     ✗ Missing auth

Error: Authorization required for GADMIN...ABC
```

---

### Common Issues

**Issue 1: Auth Required But Not Provided**

**Error:**
```
❌ Authorization required from GUSER...XYZ
```

**Solution:** Add `--auth` flag with the address

---

**Issue 2: Contract Address vs Account Address**

**Error:**
```
❌ Invalid address format for auth context
```

**Solution:** 
- Use `G...` addresses for accounts
- Use `C...` addresses for contracts
- Check address format matches requirement

---

**Issue 3: Multi-Sig Weight Mismatch**

**Error:**
```
❌ Signature weight 1 < required threshold 2
```

**Solution:** Add more signers or use higher-weight signers

---

## Best Practices

### ✅ Do

- **Test both authorized and unauthorized cases**
- **Verify auth failures** — Ensure unauthorized access is rejected
- **Use realistic addresses** — Match production address formats
- **Test multi-sig thresholds** — All weight combinations
- **Document auth requirements** — Clear in function docs
- **Test expiration** — Simulate expired signatures

### ❌ Don't

- **Don't skip auth testing** — Critical security feature
- **Don't only test happy paths** — Test failures too
- **Don't ignore threshold logic** — Test all weight scenarios
- **Don't hardcode auth in tests** — Use configurable auth contexts
- **Don't forget contract-as-signer** — Test proxy patterns

---

## Auth Testing Checklist

- [ ] Happy path: Authorized user succeeds
- [ ] Unhappy path: Unauthorized user fails
- [ ] Multi-sig: All threshold combinations tested
- [ ] Expiration: Expired signatures rejected
- [ ] Contract auth: Contract-as-signer works
- [ ] Cross-contract: Nested auth contexts work
- [ ] Admin functions: Admin-only access enforced
- [ ] Edge cases: Missing auth, wrong signer, insufficient weight

---

## Related Guides

- **[Ledger Entries](/docs/concepts/ledger-entries)** — Account entries for multi-sig
- **[Mock Ledger Configuration](/docs/guides/mock-ledger)** — Setting up accounts
- **[Cross-Contract Guide](/docs/guides/cross-contract)** — Nested auth contexts
- **[Browser Quickstart](/docs/quickstart/browser)** — Using the auth panel

---

## Need Help?

- 📖 **Soroban Docs**: [Authorization](https://soroban.stellar.org/docs/learn/authorization)
- 💬 **Discord**: [Ask about auth testing](https://discord.gg/stellar)
- 🔍 **Examples**: [Auth simulation examples](https://github.com/sorosim/examples/auth)
