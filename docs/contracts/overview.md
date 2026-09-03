# Sample Contracts

SoroSim includes pre-built sample contracts to help you get started quickly. These contracts demonstrate common patterns and provide ready-to-use examples for learning and testing.

## Available Sample Contracts

| Contract | Purpose | Complexity | Use Cases |
|----------|---------|------------|-----------|
| [Hello World](#hello-world) | Simple greeting | Beginner | Learn basics, test setup |
| [Counter](#counter) | Persistent storage | Beginner | Storage patterns, state management |
| [Token](#token-sac) | Stellar Asset Contract | Intermediate | Token operations, transfers |
| [NFT](#nft-contract) | Non-fungible tokens | Intermediate | NFT minting, ownership |
| [Voting](#voting-dao) | Simple governance | Advanced | DAO patterns, multi-user scenarios |
| [DEX Pool](#dex-liquidity-pool) | Liquidity pool | Advanced | DeFi patterns, cross-contract calls |

---

## Hello World

**Complexity:** 🟢 Beginner  
**Category:** Educational  
**WASM Size:** ~15 KB

### Description

A minimal contract that demonstrates basic Soroban functionality. Returns a greeting message to a specified user.

### Functions

#### `hello`
Returns a personalized greeting.

**Parameters:**
- `to` (String) — Name to greet

**Returns:** String

**Example:**
```json
{
  "function": "hello",
  "args": [
    {"type": "String", "value": "Alice"}
  ]
}
```

**Result:**
```
String("Hello, Alice!")
```

### Use Cases

- ✅ First contract simulation
- ✅ Testing SoroSim setup
- ✅ Learning contract structure
- ✅ Understanding ScVal types

### Storage

None — stateless contract

### Quick Start

**Browser:**
```
1. Click "Load Sample"
2. Select "Hello World"
3. Function: hello
4. Parameter: Your name
5. Click "Simulate"
```

**CLI:**
```bash
sorosim simulate \
  --wasm samples/hello_world.wasm \
  --function hello \
  --args '[{"type":"String","value":"Alice"}]'
```

---

## Counter

**Complexity:** 🟢 Beginner  
**Category:** State Management  
**WASM Size:** ~18 KB

### Description

A simple counter demonstrating persistent storage. Increments, decrements, and resets a stored value.

### Functions

#### `increment`
Increases counter by 1.

**Parameters:** None  
**Returns:** U32 (new counter value)

**Example:**
```bash
sorosim simulate --wasm samples/counter.wasm --function increment
```

**Result:** `U32(1)`

---

#### `decrement`
Decreases counter by 1.

**Parameters:** None  
**Returns:** U32 (new counter value)

**Example:**
```bash
sorosim simulate --wasm samples/counter.wasm --function decrement
```

**Result:** `U32(0)` (or error if counter is 0)

---

#### `get_count`
Returns current counter value.

**Parameters:** None  
**Returns:** U32

---

#### `reset`
Resets counter to 0.

**Parameters:** None  
**Returns:** Void

### Storage

| Key | Type | Durability | Description |
|-----|------|------------|-------------|
| `COUNTER` | U32 | Persistent | Current count value |

### Use Cases

- ✅ Learning persistent storage
- ✅ Understanding state changes
- ✅ Testing state diff visualization
- ✅ Simple integration tests

### Sample Configuration

```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "COUNTER"},
      "value": {"type": "U32", "value": 0},
      "durability": "Persistent"
    }
  ]
}
```

---

## Token (SAC)

**Complexity:** 🟡 Intermediate  
**Category:** DeFi / Tokens  
**WASM Size:** ~45 KB

### Description

A Stellar Asset Contract (SAC) implementation supporting standard token operations: minting, transferring, burning, and balance queries.

### Functions

#### `initialize`
Initializes the token with admin, name, symbol, and decimals.

**Parameters:**
- `admin` (Address) — Admin address
- `name` (String) — Token name
- `symbol` (String) — Token symbol
- `decimals` (U32) — Decimal places

**Returns:** Void

**Example:**
```json
{
  "function": "initialize",
  "args": [
    {"type": "Address", "value": "GADMIN...XYZ"},
    {"type": "String", "value": "MyToken"},
    {"type": "String", "value": "MTK"},
    {"type": "U32", "value": 7}
  ]
}
```

---

#### `mint`
Mints new tokens to a recipient (admin only).

**Parameters:**
- `to` (Address) — Recipient address
- `amount` (I128) — Amount to mint

**Returns:** Void

**Auth Required:** Admin

---

#### `transfer`
Transfers tokens from one address to another.

**Parameters:**
- `from` (Address) — Source address
- `to` (Address) — Destination address
- `amount` (I128) — Amount to transfer

**Returns:** Void

**Auth Required:** `from` address

---

#### `balance`
Returns token balance of an address.

**Parameters:**
- `id` (Address) — Address to query

**Returns:** I128

---

#### `burn`
Burns tokens from an address.

**Parameters:**
- `from` (Address) — Address to burn from
- `amount` (I128) — Amount to burn

**Returns:** Void

**Auth Required:** `from` address

### Storage

| Key | Type | Durability | Description |
|-----|------|------------|-------------|
| `Metadata` | Map | Persistent | Token name, symbol, decimals |
| `Admin` | Address | Persistent | Admin address |
| `Balance(Address)` | I128 | Persistent | Balance for each address |
| `TotalSupply` | I128 | Persistent | Total token supply |

### Use Cases

- ✅ Token transfer testing
- ✅ Authorization simulation
- ✅ Balance management
- ✅ DeFi protocol integration
- ✅ Cross-contract token operations

### Sample Workflow

```bash
# 1. Initialize
sorosim simulate \
  --wasm samples/token.wasm \
  --function initialize \
  --args '[{"type":"Address","value":"GADMIN..."},{"type":"String","value":"MyToken"},{"type":"String","value":"MTK"},{"type":"U32","value":7}]' \
  --save-state state1.json

# 2. Mint
sorosim simulate \
  --wasm samples/token.wasm \
  --function mint \
  --ledger state1.json \
  --args '[{"type":"Address","value":"GALICE..."},{"type":"I128","value":"1000000"}]' \
  --auth '{"address":"GADMIN..."}' \
  --save-state state2.json

# 3. Transfer
sorosim simulate \
  --wasm samples/token.wasm \
  --function transfer \
  --ledger state2.json \
  --args '[{"type":"Address","value":"GALICE..."},{"type":"Address","value":"GBOB..."},{"type":"I128","value":"500000"}]' \
  --auth '{"address":"GALICE..."}'
```

---

## NFT Contract

**Complexity:** 🟡 Intermediate  
**Category:** NFT / Collectibles  
**WASM Size:** ~38 KB

### Description

A non-fungible token (NFT) contract supporting minting, transfers, and metadata management.

### Functions

#### `mint`
Mints a new NFT to a recipient.

**Parameters:**
- `to` (Address) — Recipient address
- `token_id` (U32) — Unique token ID
- `metadata_uri` (String) — URI to token metadata (IPFS, HTTP, etc.)

**Returns:** Void

**Auth Required:** Minter (admin)

---

#### `transfer`
Transfers NFT ownership.

**Parameters:**
- `from` (Address) — Current owner
- `to` (Address) — New owner
- `token_id` (U32) — Token ID to transfer

**Returns:** Void

**Auth Required:** `from` address

---

#### `owner_of`
Returns the owner of a token.

**Parameters:**
- `token_id` (U32) — Token ID to query

**Returns:** Address

---

#### `metadata`
Returns token metadata URI.

**Parameters:**
- `token_id` (U32) — Token ID to query

**Returns:** String

---

#### `burn`
Burns (destroys) an NFT.

**Parameters:**
- `token_id` (U32) — Token ID to burn

**Returns:** Void

**Auth Required:** Token owner

### Storage

| Key | Type | Durability | Description |
|-----|------|------------|-------------|
| `Owner(U32)` | Address | Persistent | Owner of each token |
| `Metadata(U32)` | String | Persistent | Metadata URI for each token |
| `NextTokenId` | U32 | Persistent | Next available token ID |
| `CollectionName` | String | Persistent | NFT collection name |

### Use Cases

- ✅ NFT minting and transfers
- ✅ Ownership tracking
- ✅ Metadata management
- ✅ Marketplace integration testing

### Sample Configuration

```json
{
  "entries": [
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "CollectionName"},
      "value": {"type": "String", "value": "CoolNFTs"},
      "durability": "Persistent"
    },
    {
      "type": "ContractData",
      "contract": "CURRENT_CONTRACT",
      "key": {"type": "Symbol", "value": "NextTokenId"},
      "value": {"type": "U32", "value": 1},
      "durability": "Persistent"
    }
  ]
}
```

---

## Voting (DAO)

**Complexity:** 🔴 Advanced  
**Category:** Governance / DAO  
**WASM Size:** ~52 KB

### Description

A governance contract for decentralized voting. Supports proposal creation, voting, and execution.

### Functions

#### `create_proposal`
Creates a new governance proposal.

**Parameters:**
- `proposer` (Address) — Proposal creator
- `title` (String) — Proposal title
- `description` (String) — Detailed description
- `end_time` (U64) — Voting deadline (Unix timestamp)

**Returns:** U32 (proposal ID)

**Auth Required:** `proposer` address

---

#### `vote`
Casts a vote on a proposal.

**Parameters:**
- `voter` (Address) — Voter address
- `proposal_id` (U32) — Proposal to vote on
- `in_favor` (Bool) — true = yes, false = no

**Returns:** Void

**Auth Required:** `voter` address

---

#### `execute_proposal`
Executes a passed proposal.

**Parameters:**
- `proposal_id` (U32) — Proposal to execute

**Returns:** Void

**Conditions:** Voting ended, proposal passed

---

#### `get_proposal`
Returns proposal details.

**Parameters:**
- `proposal_id` (U32) — Proposal ID

**Returns:** Map (proposal details)

---

#### `get_votes`
Returns vote counts for a proposal.

**Parameters:**
- `proposal_id` (U32) — Proposal ID

**Returns:** Tuple(U32, U32) — (votes_for, votes_against)

### Storage

| Key | Type | Durability | Description |
|-----|------|------------|-------------|
| `ProposalCount` | U32 | Persistent | Total proposals created |
| `Proposal(U32)` | Map | Persistent | Proposal details |
| `HasVoted(U32,Address)` | Bool | Persistent | Voting status per user |
| `VotesFor(U32)` | U32 | Persistent | Yes votes count |
| `VotesAgainst(U32)` | U32 | Persistent | No votes count |

### Use Cases

- ✅ DAO governance testing
- ✅ Multi-user voting scenarios
- ✅ Time-based logic testing
- ✅ Proposal execution flows

### Sample Workflow

```bash
# 1. Create proposal
sorosim simulate \
  --wasm samples/voting.wasm \
  --function create_proposal \
  --args '[{"type":"Address","value":"GPROPOSER..."},{"type":"String","value":"Upgrade Contract"},{"type":"String","value":"Upgrade to v2.0"},{"type":"U64","value":1735689600}]' \
  --auth '{"address":"GPROPOSER..."}' \
  --save-state state1.json

# 2. Vote (user 1)
sorosim simulate \
  --wasm samples/voting.wasm \
  --function vote \
  --ledger state1.json \
  --args '[{"type":"Address","value":"GVOTER1..."},{"type":"U32","value":1},{"type":"Bool","value":true}]' \
  --auth '{"address":"GVOTER1..."}' \
  --save-state state2.json

# 3. Vote (user 2)
sorosim simulate \
  --wasm samples/voting.wasm \
  --function vote \
  --ledger state2.json \
  --args '[{"type":"Address","value":"GVOTER2..."},{"type":"U32","value":1},{"type":"Bool","value":true}]' \
  --auth '{"address":"GVOTER2..."}'
```

---

## DEX Liquidity Pool

**Complexity:** 🔴 Advanced  
**Category:** DeFi / AMM  
**WASM Size:** ~58 KB

### Description

An automated market maker (AMM) liquidity pool supporting token swaps and liquidity provision.

### Functions

#### `initialize`
Initializes the pool with two tokens.

**Parameters:**
- `token_a` (Address) — First token contract
- `token_b` (Address) — Second token contract

**Returns:** Void

---

#### `add_liquidity`
Adds liquidity to the pool.

**Parameters:**
- `provider` (Address) — Liquidity provider
- `amount_a` (I128) — Amount of token A
- `amount_b` (I128) — Amount of token B

**Returns:** I128 (LP tokens minted)

**Auth Required:** `provider` address

---

#### `remove_liquidity`
Removes liquidity from the pool.

**Parameters:**
- `provider` (Address) — Liquidity provider
- `lp_tokens` (I128) — LP tokens to burn

**Returns:** Tuple(I128, I128) — (token_a_amount, token_b_amount)

**Auth Required:** `provider` address

---

#### `swap`
Swaps one token for another.

**Parameters:**
- `user` (Address) — User performing swap
- `token_in` (Address) — Input token contract
- `amount_in` (I128) — Input amount
- `min_amount_out` (I128) — Minimum output (slippage protection)

**Returns:** I128 (actual output amount)

**Auth Required:** `user` address

---

#### `get_reserves`
Returns current pool reserves.

**Parameters:** None

**Returns:** Tuple(I128, I128) — (reserve_a, reserve_b)

### Storage

| Key | Type | Durability | Description |
|-----|------|------------|-------------|
| `TokenA` | Address | Persistent | First token contract |
| `TokenB` | Address | Persistent | Second token contract |
| `ReserveA` | I128 | Persistent | Reserve of token A |
| `ReserveB` | I128 | Persistent | Reserve of token B |
| `LPTokens(Address)` | I128 | Persistent | LP tokens per provider |
| `TotalLPTokens` | I128 | Persistent | Total LP tokens |

### Use Cases

- ✅ DEX swap testing
- ✅ Liquidity provision scenarios
- ✅ Cross-contract token interactions
- ✅ Price impact calculations
- ✅ Slippage protection testing

### Sample Configuration

Requires mock token contracts — see [Cross-Contract Guide](/docs/guides/cross-contract).

---

## Downloading Sample Contracts

### Browser

Sample contracts are pre-loaded in SoroSim:
```
1. Click "Load Sample"
2. Choose contract
3. Click "Load"
```

### CLI

Download from GitHub:
```bash
# Clone repository
git clone https://github.com/sorosim/sample-contracts.git

# Use in simulations
sorosim simulate \
  --wasm sample-contracts/token/target/wasm32-unknown-unknown/release/token.wasm \
  --function transfer \
  --args '[...]'
```

### Direct Links

- [Hello World WASM](https://github.com/sorosim/samples/hello_world.wasm)
- [Counter WASM](https://github.com/sorosim/samples/counter.wasm)
- [Token WASM](https://github.com/sorosim/samples/token.wasm)
- [NFT WASM](https://github.com/sorosim/samples/nft.wasm)
- [Voting WASM](https://github.com/sorosim/samples/voting.wasm)
- [DEX Pool WASM](https://github.com/sorosim/samples/dex_pool.wasm)

---

## Source Code

All sample contracts are open source:

**Repository:** [github.com/sorosim/sample-contracts](https://github.com/sorosim/sample-contracts)

Each contract includes:
- ✅ Full Rust source code
- ✅ Build instructions
- ✅ Test suite
- ✅ Example configurations
- ✅ Documentation

---

## Building from Source

```bash
# Clone repository
git clone https://github.com/sorosim/sample-contracts.git
cd sample-contracts

# Build all contracts
./build-all.sh

# Or build individual contracts
cd token
soroban contract build
```

---

## Contributing

Want to add a sample contract?

1. Fork the [sample-contracts repository](https://github.com/sorosim/sample-contracts)
2. Add your contract following the template
3. Include tests and documentation
4. Submit a pull request

See [Contributing Guide](/docs/contributing) for details.

---

## Related Guides

- **[Browser Quickstart](/docs/quickstart/browser)** — Load and simulate samples
- **[Mock Ledger Configuration](/docs/guides/mock-ledger)** — Configure sample state
- **[Cross-Contract Guide](/docs/guides/cross-contract)** — Use DEX pool sample

---

## Need Help?

- 💬 **Discord**: [Ask about sample contracts](https://discord.gg/stellar)
- 📖 **Source Code**: [Browse on GitHub](https://github.com/sorosim/sample-contracts)
- 🐛 **Report Issues**: [Sample contract bugs](https://github.com/sorosim/sample-contracts/issues)
