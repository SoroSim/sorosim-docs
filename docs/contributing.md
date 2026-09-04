# Contributing to SoroSim

Thank you for your interest in contributing to SoroSim! This guide covers how to contribute to all four repositories in the SoroSim ecosystem.

## Quick Links

- 🌐 **Frontend:** [sorosim-frontend](https://github.com/sorosim/sorosim-frontend) — Browser UI
- 🔧 **Backend:** [sorosim-backend](https://github.com/sorosim/sorosim-backend) — Simulation engine & API
- 💻 **CLI:** [sorosim-cli](https://github.com/sorosim/sorosim-cli) — Command-line tool
- 📜 **Contracts:** [sorosim-contracts](https://github.com/sorosim/sorosim-contracts) — Sample contracts
- 📚 **Docs:** [sorosim-docs](https://github.com/sorosim/sorosim-docs) — Documentation site

---

## Code of Conduct

SoroSim follows the [Stellar Community Code of Conduct](https://stellar.org/community/code-of-conduct). By participating, you agree to uphold this code.

**In short:**
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Report unacceptable behavior

---

## Ways to Contribute

### 🐛 Report Bugs

Found a bug? Help us fix it!

**Before reporting:**
1. Search [existing issues](https://github.com/sorosim/sorosim/issues) to avoid duplicates
2. Test on the latest version
3. Gather reproduction steps

**Bug report template:** [Report a bug](https://github.com/sorosim/sorosim/issues/new?template=bug_report.md)

**Include:**
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- SoroSim version
- Operating system
- Browser (for frontend bugs)
- Error messages and logs
- Session snapshot (if applicable)

---

### 💡 Suggest Features

Have an idea for improvement?

**Feature request template:** [Request a feature](https://github.com/sorosim/sorosim/issues/new?template=feature_request.md)

**Include:**
- Problem you're trying to solve
- Proposed solution
- Alternative solutions considered
- Use cases and examples
- Impact on existing users

---

### 📖 Improve Documentation

Documentation improvements are always welcome!

**What to contribute:**
- Fix typos and grammar
- Add missing examples
- Clarify confusing explanations
- Write new guides
- Translate to other languages

**Docs repository:** [sorosim-docs](https://github.com/sorosim/sorosim-docs)

---

### 💻 Submit Code

Ready to write code? Great!

**Good first issues:** Look for issues labeled [`good first issue`](https://github.com/sorosim/sorosim/issues?q=label%3A%22good+first+issue%22)

**Process:**
1. Comment on issue to claim it
2. Fork the repository
3. Create a feature branch
4. Make your changes
5. Write tests
6. Submit a pull request

---

### 📜 Share Contracts

Built a useful example contract?

**Contract contributions:**
- Sample contracts for learning
- Testing utilities
- Common patterns
- Integration examples

**Contracts repository:** [sorosim-contracts](https://github.com/sorosim/sorosim-contracts)

---

### 💬 Help Others

Join the community and help other users!

- Answer questions on [Discord](https://discord.gg/stellar)
- Help on [GitHub Discussions](https://github.com/sorosim/sorosim/discussions)
- Review pull requests
- Share your experience

---

## Repository Structure

### sorosim-frontend (React/TypeScript)

Browser-based UI for contract simulation.

**Tech stack:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- Monaco Editor

**Setup:**
```bash
git clone https://github.com/sorosim/sorosim-frontend.git
cd sorosim-frontend
npm install
npm run dev
```

**Project structure:**
```
sorosim-frontend/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and helpers
│   ├── api/            # API client
│   └── types/          # TypeScript types
├── public/             # Static assets
└── tests/              # Test files
```

**Running tests:**
```bash
npm test
npm run test:coverage
```

**Building:**
```bash
npm run build
```

---

### sorosim-backend (Node.js/Rust)

Simulation engine and REST API.

**Tech stack:**
- Node.js (Express)
- Rust (simulation core)
- PostgreSQL (session storage)
- Redis (caching)

**Setup:**
```bash
git clone https://github.com/sorosim/sorosim-backend.git
cd sorosim-backend

# Install Node dependencies
npm install

# Install Rust dependencies
cd simulator-core
cargo build
cd ..

# Setup database
docker-compose up -d postgres redis
npm run migrate

# Start server
npm run dev
```

**Project structure:**
```
sorosim-backend/
├── src/
│   ├── api/            # REST API routes
│   ├── services/       # Business logic
│   ├── models/         # Database models
│   └── middleware/     # Express middleware
├── simulator-core/     # Rust simulation engine
│   ├── src/
│   │   ├── vm/        # WASM VM
│   │   ├── ledger/    # Ledger simulation
│   │   └── diff/      # State diff computation
│   └── Cargo.toml
├── migrations/         # Database migrations
└── tests/              # Test files
```

**Running tests:**
```bash
# Node tests
npm test

# Rust tests
cd simulator-core
cargo test
```

---

### sorosim-cli (Node.js)

Command-line interface for simulation.

**Tech stack:**
- Node.js
- Commander.js (CLI framework)
- Axios (API client)

**Setup:**
```bash
git clone https://github.com/sorosim/sorosim-cli.git
cd sorosim-cli
npm install
npm link  # Make 'sorosim' command available
```

**Project structure:**
```
sorosim-cli/
├── src/
│   ├── commands/       # Command implementations
│   ├── lib/            # Shared utilities
│   ├── api/            # API client
│   └── index.js        # Entry point
└── tests/              # Test files
```

**Running tests:**
```bash
npm test
```

**Testing locally:**
```bash
npm link
sorosim --version
```

---

### sorosim-contracts (Rust)

Sample Soroban contracts for testing and learning.

**Tech stack:**
- Rust
- Soroban SDK

**Setup:**
```bash
git clone https://github.com/sorosim/sorosim-contracts.git
cd sorosim-contracts

# Install Soroban CLI
cargo install --locked soroban-cli

# Build all contracts
./build-all.sh
```

**Project structure:**
```
sorosim-contracts/
├── hello-world/
│   ├── src/
│   │   └── lib.rs
│   └── Cargo.toml
├── counter/
├── token/
├── nft/
├── voting/
└── dex-pool/
```

**Adding a new contract:**
```bash
# Create new contract directory
mkdir my-contract
cd my-contract

# Initialize
soroban contract init .

# Implement contract in src/lib.rs

# Add to build-all.sh

# Test
cargo test
soroban contract build
```

---

## Development Workflow

### 1. Fork and Clone

```bash
# Fork on GitHub, then clone
git clone https://github.com/YOUR_USERNAME/sorosim-REPO.git
cd sorosim-REPO

# Add upstream remote
git remote add upstream https://github.com/sorosim/sorosim-REPO.git
```

---

### 2. Create a Branch

```bash
# Update main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/my-awesome-feature

# Or for bug fixes
git checkout -b fix/bug-description
```

**Branch naming:**
- `feature/` — New features
- `fix/` — Bug fixes
- `docs/` — Documentation changes
- `refactor/` — Code refactoring
- `test/` — Test additions/changes
- `chore/` — Maintenance tasks

---

### 3. Make Changes

**Follow coding standards:**

**JavaScript/TypeScript:**
- Use ESLint and Prettier (configs in repo)
- Run `npm run lint` before committing
- Use TypeScript types (no `any`)

**Rust:**
- Follow Rust style guidelines
- Run `cargo fmt` and `cargo clippy`
- No compiler warnings

**Commit messages:**
```
type(scope): short description

Longer explanation if needed.

Fixes #123
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(frontend): add state diff visualization
fix(cli): handle missing WASM file gracefully
docs(api): update simulate endpoint examples
test(backend): add cross-contract simulation tests
```

---

### 4. Write Tests

**All code changes need tests.**

**Frontend (Jest + React Testing Library):**
```typescript
import { render, screen } from '@testing-library/react';
import { ContractUpload } from './ContractUpload';

test('uploads contract WASM', async () => {
  render(<ContractUpload />);
  const input = screen.getByLabelText('Upload WASM');
  // ... test logic
});
```

**Backend (Jest):**
```javascript
describe('POST /simulate', () => {
  it('simulates contract invocation', async () => {
    const response = await request(app)
      .post('/v1/simulate')
      .send({ wasm: wasmBase64, function: 'test' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

**Rust (built-in test framework):**
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_simulation() {
        let result = simulate_invocation(...);
        assert!(result.is_ok());
    }
}
```

**Run tests:**
```bash
# Frontend/CLI/Backend
npm test

# Rust
cargo test
```

---

### 5. Submit Pull Request

**Before submitting:**
- [ ] Tests pass (`npm test` or `cargo test`)
- [ ] Linting passes (`npm run lint` or `cargo clippy`)
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main

**Submit:**
```bash
# Push to your fork
git push origin feature/my-awesome-feature

# Open pull request on GitHub
```

**PR template will auto-populate. Fill in:**
- Description of changes
- Related issue number
- Testing performed
- Screenshots (for UI changes)
- Breaking changes (if any)

---

### 6. Code Review

**What to expect:**
- Maintainers will review within 1-2 weeks
- CI tests will run automatically
- Feedback may be requested
- Be responsive to comments

**After approval:**
- Maintainer will merge your PR
- Your contribution is live! 🎉

---

## Coding Standards

### TypeScript/JavaScript

**Style:**
```typescript
// Use camelCase for variables and functions
const myVariable = 42;
function myFunction() {}

// Use PascalCase for classes and components
class MyClass {}
const MyComponent = () => {};

// Use UPPER_SNAKE_CASE for constants
const MAX_RETRIES = 3;

// Prefer const over let
const data = [...];  // ✓
let data = [...];    // ✗

// Use async/await over promises
async function fetchData() {  // ✓
  const data = await api.get();
}

// Arrow functions for callbacks
items.map(item => item.id);  // ✓
```

**TypeScript:**
```typescript
// Always specify types
function process(input: string): number {
  return input.length;
}

// Use interfaces for object shapes
interface Contract {
  id: string;
  name: string;
  wasm: Uint8Array;
}

// No 'any' type
const data: any = ...;  // ✗
const data: unknown = ...;  // ✓ (then type guard)
```

---

### Rust

**Style:**
```rust
// Follow rustfmt defaults
// Run: cargo fmt

// Use snake_case for functions and variables
fn my_function() {}
let my_variable = 42;

// Use PascalCase for types
struct MyStruct {}
enum MyEnum {}

// Use SCREAMING_SNAKE_CASE for constants
const MAX_SIZE: usize = 1024;

// Prefer ? operator over unwrap
let result = function_that_may_fail()?;  // ✓
let result = function_that_may_fail().unwrap();  // ✗

// Document public APIs
/// Simulates a contract invocation.
///
/// # Arguments
/// * `wasm` - Contract WASM bytecode
/// * `function` - Function name to invoke
///
/// # Returns
/// Simulation result with state changes
pub fn simulate(wasm: &[u8], function: &str) -> Result<SimResult> {
    // ...
}
```

---

## Testing Guidelines

### Test Coverage

**Minimum coverage:** 80%

**Check coverage:**
```bash
# JavaScript/TypeScript
npm run test:coverage

# Rust
cargo tarpaulin --out Html
```

---

### Test Types

**Unit tests:**
- Test individual functions in isolation
- Mock dependencies
- Fast execution

**Integration tests:**
- Test multiple components together
- Use real dependencies (when feasible)
- Test API endpoints end-to-end

**E2E tests (frontend only):**
- Test complete user workflows
- Use Playwright or Cypress

---

### Writing Good Tests

**✓ Good:**
```javascript
describe('ContractSimulator', () => {
  it('simulates increment function', async () => {
    const result = await simulator.simulate({
      wasm: counterWasm,
      function: 'increment',
      args: []
    });
    
    expect(result.success).toBe(true);
    expect(result.stateChanges).toHaveLength(1);
    expect(result.stateChanges[0].after.value).toBe(1);
  });
  
  it('fails with invalid function name', async () => {
    await expect(simulator.simulate({
      wasm: counterWasm,
      function: 'nonexistent',
      args: []
    })).rejects.toThrow('Function not found');
  });
});
```

**✗ Bad:**
```javascript
it('works', async () => {
  const result = await simulator.simulate(...);
  expect(result).toBeTruthy(); // Too vague
});
```

---

## Documentation Standards

### Code Comments

**When to comment:**
- Complex algorithms
- Non-obvious behavior
- Public APIs
- Edge cases

**When NOT to comment:**
```javascript
// ✗ Bad: Obvious
// Increment counter
counter++;

// ✓ Good: Explains why
// Use atomic increment to prevent race conditions in concurrent scenarios
atomicIncrement(counter);
```

---

### API Documentation

**Document all public APIs:**

```typescript
/**
 * Simulates a contract invocation with mock ledger state.
 * 
 * @param wasm - Base64-encoded WASM bytecode
 * @param functionName - Function name to invoke
 * @param args - Function arguments in ScVal format
 * @param ledger - Optional mock ledger configuration
 * @returns Simulation result with state changes and metrics
 * @throws {InvalidWasmError} If WASM is invalid or corrupted
 * @throws {FunctionNotFoundError} If function doesn't exist
 * 
 * @example
 * ```typescript
 * const result = await simulate({
 *   wasm: wasmBase64,
 *   functionName: 'transfer',
 *   args: [fromAddr, toAddr, amount]
 * });
 * ```
 */
export async function simulate(
  wasm: string,
  functionName: string,
  args: ScVal[],
  ledger?: LedgerConfig
): Promise<SimulationResult>
```

---

## Release Process

### Versioning

SoroSim follows [Semantic Versioning](https://semver.org/):

- **MAJOR:** Breaking changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes

**Example:** `v0.3.2` → `v0.4.0` (new features) → `v1.0.0` (stable release)

---

### Changelog

All changes are documented in `CHANGELOG.md`:

```markdown
## [0.4.0] - 2024-01-15

### Added
- Cross-contract invocation simulation
- Session snapshot export/import
- Performance metrics in CLI output

### Changed
- Improved state diff visualization
- Updated Soroban SDK to v20.5.0

### Fixed
- Auth context not applied to nested calls
- Memory leak in long-running simulations

### Deprecated
- Old ledger config format (use new format)

### Breaking Changes
- API response format changed for `/simulate` endpoint
```

---

## Community

### Discord

Join the [Stellar Discord](https://discord.gg/stellar) and find the #sorosim channel.

**Use Discord for:**
- Quick questions
- Brainstorming ideas
- Getting help with contributions
- Community chat

---

### GitHub Discussions

Use [GitHub Discussions](https://github.com/sorosim/sorosim/discussions) for:
- Feature proposals
- Architecture discussions
- Show and tell (share your projects)
- Q&A

---

### Monthly Contributor Calls

**When:** First Tuesday of each month, 3 PM UTC  
**Where:** Discord voice channel  
**Agenda:** Posted in #sorosim channel

**Topics:**
- Roadmap updates
- Feature prioritization
- Contributor highlights
- Q&A

---

## Recognition

### Contributors

All contributors are recognized in:
- Repository README
- Release notes
- Contributors page on website

### Maintainers

Active, trusted contributors may be invited to become maintainers with:
- Commit access
- PR review rights
- Issue triage permissions

---

## Getting Help

**Stuck? Need guidance?**

- 💬 **Discord:** [discord.gg/stellar](https://discord.gg/stellar) (#sorosim)
- 📖 **Discussions:** [GitHub Discussions](https://github.com/sorosim/sorosim/discussions)
- 📧 **Email:** contribute@sorosim.dev

**Mentorship available for:**
- First-time contributors
- Complex contributions
- Architecture decisions

---

## License

By contributing, you agree that your contributions will be licensed under the **Apache License 2.0**.

See [LICENSE](https://github.com/sorosim/sorosim/blob/main/LICENSE) for details.

---

## Thank You! 🎉

Your contributions make SoroSim better for everyone. We appreciate your time and effort!

**Happy coding!** 🚀
