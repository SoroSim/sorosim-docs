# ScVal Types

ScVal (Stellar Contract Value) is the type system used by Soroban smart contracts. Understanding ScVal types is essential for working with contract parameters, storage, and return values in SoroSim.

## What is ScVal?

**ScVal** is Soroban's universal value representation. Every piece of data in a Soroban contract—whether a function parameter, storage value, or return value—is encoded as an ScVal.

Think of ScVal as Soroban's version of JSON: a structured way to represent any type of data.

### Why ScVal Matters

When you use SoroSim, you're constantly working with ScVal:
- **Function arguments** are encoded as ScVal before invocation
- **Contract storage** uses ScVal for keys and values
- **Return values** are decoded from ScVal
- **State diffs** show ScVal transformations

---

## ScVal Type Categories

ScVal types fall into four categories:

| Category | Types | Description |
|----------|-------|-------------|
| **Primitives** | Bool, U32, I32, U64, I64, U128, I128, U256, I256 | Basic numeric and boolean types |
| **Data** | Bytes, String, Symbol | Raw data and text |
| **Composite** | Vec, Map, Tuple | Collections and structures |
| **Stellar** | Address, Timepoint, Duration | Blockchain-specific types |

Let's explore each type in detail.

---

## Primitive Types

### Boolean (`Bool`)

Represents `true` or `false`.

**JSON Representation:**
```json
{
  "type": "Bool",
  "value": true
}
```

**SoroSim Form Input:**
```
Checkbox: ☑ true / ☐ false
```

**Rust Equivalent:**
```rust
bool
```

**Example Use Cases:**
- Feature flags: `is_initialized`
- Permissions: `is_admin`
- State checks: `has_voted`

---

### Unsigned Integers

Fixed-size unsigned integers (always positive).

#### `U32` — 32-bit Unsigned Integer

**Range:** 0 to 4,294,967,295

**JSON:**
```json
{
  "type": "U32",
  "value": 42
}
```

**Form Input:**
```
Number input: [42]
```

**Use Cases:**
- Counters, IDs, small amounts

#### `U64` — 64-bit Unsigned Integer

**Range:** 0 to 18,446,744,073,709,551,615

**JSON:**
```json
{
  "type": "U64",
  "value": 1000000
}
```

**Use Cases:**
- Timestamps (Unix time)
- Large counters
- Stroops (XLM amounts)

#### `U128` — 128-bit Unsigned Integer

**Range:** 0 to 340,282,366,920,938,463,463,374,607,431,768,211,455

**JSON:**
```json
{
  "type": "U128",
  "value": "1000000000000000000"
}
```

**Note:** Use strings for values > 2^53 to avoid JavaScript precision loss.

**Use Cases:**
- Token amounts
- Large numeric calculations

#### `U256` — 256-bit Unsigned Integer

**Range:** 0 to 2^256 - 1

**JSON:**
```json
{
  "type": "U256",
  "value": "115792089237316195423570985008687907853269984665640564039457584007913129639935"
}
```

**Use Cases:**
- Cryptographic operations
- Hash values
- Extremely large numbers

---

### Signed Integers

Fixed-size signed integers (positive and negative).

#### `I32` — 32-bit Signed Integer

**Range:** -2,147,483,648 to 2,147,483,647

**JSON:**
```json
{
  "type": "I32",
  "value": -100
}
```

#### `I64` — 64-bit Signed Integer

**JSON:**
```json
{
  "type": "I64",
  "value": -5000000
}
```

#### `I128` — 128-bit Signed Integer

**JSON:**
```json
{
  "type": "I128",
  "value": "-1000000000000000000"
}
```

**Common Use Case:** Token amounts (supporting debits)

#### `I256` — 256-bit Signed Integer

**JSON:**
```json
{
  "type": "I256",
  "value": "-57896044618658097711785492504343953926634992332820282019728792003956564819968"
}
```

---

## Data Types

### Bytes (`Bytes`)

Raw binary data represented as a hex string or base64.

**JSON:**
```json
{
  "type": "Bytes",
  "value": "48656c6c6f"
}
```

**Decoded:** "Hello" (hex-encoded)

**SoroSim Form Input:**
```
Text input (hex): [48656c6c6f]
```

**Rust Equivalent:**
```rust
Bytes  // or BytesN<N> for fixed size
```

**Use Cases:**
- Cryptographic hashes
- Signatures
- Arbitrary binary data

---

### String (`String`)

UTF-8 encoded text strings.

**JSON:**
```json
{
  "type": "String",
  "value": "Hello, Soroban!"
}
```

**SoroSim Form Input:**
```
Text input: [Hello, Soroban!]
```

**Rust Equivalent:**
```rust
String
```

**Use Cases:**
- Token names and symbols
- User messages
- Metadata

---

### Symbol (`Symbol`)

Short, efficient string identifiers (max 32 characters, alphanumeric + underscore).

**JSON:**
```json
{
  "type": "Symbol",
  "value": "COUNTER"
}
```

**SoroSim Form Input:**
```
Text input (symbol): [COUNTER]
```

**Rust Equivalent:**
```rust
Symbol
```

**Use Cases:**
- Storage keys
- Function identifiers
- Enum variants

**Key Difference from String:**
- Symbols are **optimized for identifiers** (more efficient)
- Strings are for **arbitrary text** (more flexible)

---

## Composite Types

### Vector (`Vec`)

Ordered list of ScVal elements (like an array).

**JSON:**
```json
{
  "type": "Vec",
  "value": [
    {"type": "U32", "value": 1},
    {"type": "U32", "value": 2},
    {"type": "U32", "value": 3}
  ]
}
```

**SoroSim Form Input:**
```
JSON editor:
[
  {"type": "U32", "value": 1},
  {"type": "U32", "value": 2},
  {"type": "U32", "value": 3}
]
```

**Rust Equivalent:**
```rust
Vec<u32>
```

**Use Cases:**
- Lists of addresses (whitelist)
- Multiple token IDs
- Transaction batches

**Mixed-Type Vector:**
```json
{
  "type": "Vec",
  "value": [
    {"type": "Symbol", "value": "Balance"},
    {"type": "Address", "value": "GUSER..."},
    {"type": "U32", "value": 1000}
  ]
}
```

---

### Map (`Map`)

Key-value pairs (like an object/dictionary).

**JSON:**
```json
{
  "type": "Map",
  "value": [
    {
      "key": {"type": "Symbol", "value": "name"},
      "val": {"type": "String", "value": "MyToken"}
    },
    {
      "key": {"type": "Symbol", "value": "supply"},
      "val": {"type": "U64", "value": 1000000}
    }
  ]
}
```

**SoroSim Form Input:**
```
JSON editor:
[
  {"key": {"type": "Symbol", "value": "name"}, "val": {"type": "String", "value": "MyToken"}},
  {"key": {"type": "Symbol", "value": "supply"}, "val": {"type": "U64", "value": 1000000}}
]
```

**Rust Equivalent:**
```rust
Map<Symbol, ScVal>
```

**Use Cases:**
- Configuration objects
- Metadata
- Lookup tables

---

### Tuple (`Tuple`)

Fixed-size ordered collection (like a struct without field names).

**JSON:**
```json
{
  "type": "Tuple",
  "value": [
    {"type": "Address", "value": "GUSER..."},
    {"type": "U64", "value": 1000},
    {"type": "Bool", "value": true}
  ]
}
```

**Rust Equivalent:**
```rust
(Address, u64, bool)
```

**Use Cases:**
- Return multiple values
- Composite keys
- Structured data

---

## Stellar-Specific Types

### Address (`Address`)

Represents a Stellar account or contract identifier.

**JSON:**
```json
{
  "type": "Address",
  "value": "GABC123...XYZ"
}
```

**Or for contracts:**
```json
{
  "type": "Address",
  "value": "CCDEF456...ABC"
}
```

**SoroSim Form Input:**
```
Text input: [GABC123...XYZ]
Dropdown: Account (G...) / Contract (C...)
```

**Rust Equivalent:**
```rust
Address
```

**Use Cases:**
- User identities
- Contract references
- Authorization contexts

**Address Types:**
- **Account Address:** Starts with `G` (Stellar public key)
- **Contract Address:** Starts with `C` (contract ID)

---

### Timepoint (`Timepoint`)

Unix timestamp (seconds since epoch).

**JSON:**
```json
{
  "type": "Timepoint",
  "value": 1704067200
}
```

**Decoded:** 2024-01-01 00:00:00 UTC

**SoroSim Form Input:**
```
Number input: [1704067200]
Or datetime picker: [2024-01-01 00:00:00]
```

**Use Cases:**
- Lock expiration times
- Event timestamps
- Deadline checks

---

### Duration (`Duration`)

Time span in seconds.

**JSON:**
```json
{
  "type": "Duration",
  "value": 86400
}
```

**Decoded:** 1 day (24 hours × 60 minutes × 60 seconds)

**SoroSim Form Input:**
```
Number input: [86400]
Helper: 1 day = 86400, 1 hour = 3600, 1 minute = 60
```

**Use Cases:**
- Lock periods
- Cooldown timers
- Validity windows

---

## Special Types

### Void (`Void`)

Represents "no value" (like `()` in Rust or `void` in C).

**JSON:**
```json
{
  "type": "Void"
}
```

**Use Cases:**
- Functions that return nothing
- Placeholder values

---

### Error (`Error`)

Represents contract-defined error codes.

**JSON:**
```json
{
  "type": "Error",
  "value": 1
}
```

**Use Cases:**
- Contract error returns
- Failure conditions

---

## SoroSim Form Mapping

SoroSim provides intelligent form inputs based on ScVal types:

| ScVal Type | Form Input | Features |
|------------|-----------|----------|
| **Bool** | Checkbox | Toggle true/false |
| **U32, I32** | Number input | Validation for 32-bit range |
| **U64, I64** | Number/Text input | Switches to text for large values |
| **U128, I128, U256, I256** | Text input | String representation for precision |
| **String** | Text input | UTF-8 validation |
| **Symbol** | Text input | Alphanumeric + underscore only |
| **Bytes** | Text input | Hex or base64 encoding |
| **Address** | Text input + dropdown | Account (G...) or Contract (C...) |
| **Timepoint** | Number input + datetime picker | Unix timestamp conversion |
| **Duration** | Number input + helper | Common duration presets |
| **Vec, Map, Tuple** | JSON editor | Syntax highlighting & validation |

---

## Common Patterns

### Pattern 1: Composite Storage Keys

Many contracts use Vec as composite keys:

```json
{
  "type": "Vec",
  "value": [
    {"type": "Symbol", "value": "Balance"},
    {"type": "Address", "value": "GUSER...XYZ"}
  ]
}
```

**Represents:** `["Balance", userAddress]`

---

### Pattern 2: Token Amounts

Use I128 for signed amounts (supports debits):

```json
{
  "type": "I128",
  "value": "1000000000"
}
```

**Represents:** 1 billion units (with 7 decimals = 100 tokens)

---

### Pattern 3: Metadata Maps

Store configuration as Maps:

```json
{
  "type": "Map",
  "value": [
    {"key": {"type": "Symbol", "value": "name"}, "val": {"type": "String", "value": "MyToken"}},
    {"key": {"type": "Symbol", "value": "symbol"}, "val": {"type": "String", "value": "MTK"}},
    {"key": {"type": "Symbol", "value": "decimals"}, "val": {"type": "U32", "value": 7}}
  ]
}
```

---

### Pattern 4: Multi-Return with Tuple

Functions returning multiple values:

```rust
// Rust
fn get_balance_and_locked(addr: Address) -> (i128, bool) { ... }
```

**Returns:**
```json
{
  "type": "Tuple",
  "value": [
    {"type": "I128", "value": "5000000"},
    {"type": "Bool", "value": false}
  ]
}
```

---

## Type Conversion Examples

### Browser Form → ScVal

**User inputs in browser:**
```
Function: transfer
From: GUSER1...ABC
To: GUSER2...DEF
Amount: 1000
```

**SoroSim converts to:**
```json
[
  {"type": "Address", "value": "GUSER1...ABC"},
  {"type": "Address", "value": "GUSER2...DEF"},
  {"type": "I128", "value": "1000"}
]
```

---

### CLI JSON → ScVal

**CLI command:**
```bash
sorosim simulate \
  --wasm token.wasm \
  --function mint \
  --args '[{"type":"Address","value":"GUSER..."},{"type":"U64","value":5000}]'
```

**Parsed to ScVal:**
```
Address(GUSER...)
U64(5000)
```

---

## Best Practices

### ✅ Do

- **Use Symbol for keys** — More efficient than String
- **Use I128 for token amounts** — Standard for Stellar Asset Contracts
- **Use Address for identities** — Not String
- **Use Timepoint for timestamps** — Not U64 (more explicit)
- **Use strings for large numbers** — Avoid JavaScript precision loss

### ❌ Don't

- **Don't use U32 for timestamps** — Will overflow in 2106
- **Don't use String for addresses** — Use Address type
- **Don't mix types in Vec** — Unless intentional
- **Don't forget quotes on large numbers** — `"1000000000000000000"` not `1000000000000000000`

---

## Debugging ScVal

### Reading ScVal in State Diffs

SoroSim prettifies ScVal in state diffs:

**Raw XDR:**
```
ScVal(ScVec([ScVal(ScSymbol("Balance")), ScVal(ScAddress(...))]))
```

**SoroSim Display:**
```
Vec(Symbol("Balance"), Address("GUSER...XYZ"))
```

### JSON Mode

For programmatic access, use JSON output:

```bash
sorosim simulate ... --output json
```

Returns ScVal in structured JSON format.

---

## Advanced: Custom Types

Rust structs are encoded as Maps or Tuples:

**Rust:**
```rust
#[contracttype]
pub struct TokenInfo {
    pub name: String,
    pub symbol: String,
    pub decimals: u32,
}
```

**ScVal Representation (Map):**
```json
{
  "type": "Map",
  "value": [
    {"key": {"type": "Symbol", "value": "name"}, "val": {"type": "String", "value": "MyToken"}},
    {"key": {"type": "Symbol", "value": "symbol"}, "val": {"type": "String", "value": "MTK"}},
    {"key": {"type": "Symbol", "value": "decimals"}, "val": {"type": "U32", "value": 7}}
  ]
}
```

---

## Related Concepts

- **[Ledger Entries](/docs/concepts/ledger-entries)** — Storage uses ScVal for keys and values
- **[State Diff Model](/docs/concepts/state-diff)** — How SoroSim tracks ScVal changes
- **[Browser Quickstart](/docs/quickstart/browser)** — Using form inputs for ScVal types
- **[CLI Quickstart](/docs/quickstart/cli)** — Passing ScVal as JSON arguments

---

## Type Reference Table

| ScVal Type | Size | Signed | Range/Description |
|------------|------|--------|-------------------|
| `Bool` | 1 bit | N/A | true or false |
| `U32` | 32-bit | No | 0 to 4.29B |
| `I32` | 32-bit | Yes | -2.14B to 2.14B |
| `U64` | 64-bit | No | 0 to 18.4 quintillion |
| `I64` | 64-bit | Yes | -9.2 to 9.2 quintillion |
| `U128` | 128-bit | No | 0 to 3.4×10^38 |
| `I128` | 128-bit | Yes | -1.7×10^38 to 1.7×10^38 |
| `U256` | 256-bit | No | 0 to 1.15×10^77 |
| `I256` | 256-bit | Yes | -5.78×10^76 to 5.78×10^76 |
| `Bytes` | Variable | N/A | Raw binary data |
| `String` | Variable | N/A | UTF-8 text |
| `Symbol` | Max 32 chars | N/A | Alphanumeric identifier |
| `Address` | 32 bytes | N/A | Account or contract ID |
| `Timepoint` | 64-bit | No | Unix timestamp (seconds) |
| `Duration` | 64-bit | No | Time span (seconds) |
| `Vec` | Variable | N/A | Ordered list |
| `Map` | Variable | N/A | Key-value pairs |
| `Tuple` | Variable | N/A | Fixed-size collection |

---

## Need Help?

- 📖 **Soroban Docs**: [ScVal Reference](https://soroban.stellar.org/docs/reference/scval)
- 💬 **Discord**: [Ask about types](https://discord.gg/stellar)
- 🔍 **Examples**: [ScVal examples repository](https://github.com/sorosim/examples/scval)
