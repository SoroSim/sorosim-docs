# CI/CD Integration Guide

Integrating SoroSim into your continuous integration pipeline ensures contract quality before deployment. This guide covers setup, best practices, and real-world examples for automated contract testing.

## Why CI Integration?

Automated contract simulation in CI/CD provides:

- ✅ **Early bug detection** — Catch issues before testnet deployment
- ✅ **Regression prevention** — Ensure changes don't break existing functionality
- ✅ **Consistent testing** — Same tests run on every commit
- ✅ **Fast feedback** — Results in minutes, not hours
- ✅ **Documentation** — Test results document expected behavior
- ✅ **Confidence** — Deploy knowing contracts work as expected

---

## Quick Start: GitHub Actions

### Basic Workflow

Create `.github/workflows/contract-tests.yml`:

```yaml
name: Contract Simulation Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  simulate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Rust and Soroban CLI
        run: |
          curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
          source "$HOME/.cargo/env"
          cargo install --locked soroban-cli
      
      - name: Install SoroSim CLI
        run: npm install -g sorosim-cli
      
      - name: Build contract
        run: |
          cd contracts/token
          soroban contract build
      
      - name: Run simulations
        run: |
          sorosim simulate \
            --wasm contracts/token/target/wasm32-unknown-unknown/release/token.wasm \
            --function initialize \
            --args '[{"type":"Address","value":"GADMIN...XYZ"}]' \
            --save-state state.json
          
          sorosim simulate \
            --wasm contracts/token/target/wasm32-unknown-unknown/release/token.wasm \
            --function mint \
            --ledger state.json \
            --args '[{"type":"Address","value":"GUSER...ABC"},{"type":"I128","value":"1000"}]' \
            --output json > result.json
      
      - name: Validate results
        run: |
          # Check simulation succeeded
          if ! jq -e '.success == true' result.json; then
            echo "❌ Simulation failed"
            exit 1
          fi
          echo "✓ Simulation passed"
```

---

## Complete GitHub Actions Example

### Multi-Contract Testing

```yaml
name: Comprehensive Contract Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  SOROBAN_VERSION: '20.5.0'
  RUST_VERSION: 'stable'

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      
      - name: Cache Rust dependencies
        uses: actions/cache@v3
        with:
          path: |
            ~/.cargo/bin/
            ~/.cargo/registry/index/
            ~/.cargo/registry/cache/
            ~/.cargo/git/db/
            target/
          key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}
      
      - name: Setup Rust
        uses: actions-rs/toolchain@v1
        with:
          profile: minimal
          toolchain: ${{ env.RUST_VERSION }}
          target: wasm32-unknown-unknown
          override: true
      
      - name: Install Soroban CLI
        run: |
          cargo install --locked soroban-cli --version ${{ env.SOROBAN_VERSION }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install SoroSim CLI
        run: npm install -g sorosim-cli
      
      - name: Build contracts
        run: |
          cd contracts
          soroban contract build
      
      - name: Run simulation test suite
        run: |
          chmod +x ./scripts/run-simulations.sh
          ./scripts/run-simulations.sh
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: simulation-results
          path: test-results/
      
      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const results = fs.readFileSync('test-results/summary.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: results
            });
```

---

## Test Script Example

### `scripts/run-simulations.sh`

```bash
#!/bin/bash
set -e

# Configuration
WASM_DIR="contracts/target/wasm32-unknown-unknown/release"
TEST_DIR="test-configs"
RESULTS_DIR="test-results"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Initialize
mkdir -p $RESULTS_DIR
PASSED=0
FAILED=0

echo "================================"
echo "Running SoroSim Test Suite"
echo "================================"
echo ""

# Test 1: Token Initialization
echo "Test 1: Token Initialization"
if sorosim simulate \
  --wasm $WASM_DIR/token.wasm \
  --function initialize \
  --args '[{"type":"Address","value":"GADMIN123...XYZ"}]' \
  --save-state $RESULTS_DIR/01-initialized.json \
  --output json > $RESULTS_DIR/01-result.json; then
  echo -e "${GREEN}✓ PASS${NC}: Token initialization"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}: Token initialization"
  ((FAILED++))
fi
echo ""

# Test 2: Mint Tokens
echo "Test 2: Mint Tokens"
if sorosim simulate \
  --wasm $WASM_DIR/token.wasm \
  --function mint \
  --ledger $RESULTS_DIR/01-initialized.json \
  --args '[{"type":"Address","value":"GUSER...ABC"},{"type":"I128","value":"1000"}]' \
  --auth '{"address":"GADMIN123...XYZ"}' \
  --save-state $RESULTS_DIR/02-minted.json \
  --output json > $RESULTS_DIR/02-result.json; then
  echo -e "${GREEN}✓ PASS${NC}: Mint tokens"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}: Mint tokens"
  ((FAILED++))
fi
echo ""

# Test 3: Transfer Tokens
echo "Test 3: Transfer Tokens"
if sorosim simulate \
  --wasm $WASM_DIR/token.wasm \
  --function transfer \
  --ledger $RESULTS_DIR/02-minted.json \
  --args '[{"type":"Address","value":"GUSER...ABC"},{"type":"Address","value":"GUSER2...DEF"},{"type":"I128","value":"500"}]' \
  --auth '{"address":"GUSER...ABC"}' \
  --save-state $RESULTS_DIR/03-transferred.json \
  --output json > $RESULTS_DIR/03-result.json; then
  echo -e "${GREEN}✓ PASS${NC}: Transfer tokens"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}: Transfer tokens"
  ((FAILED++))
fi
echo ""

# Test 4: Unauthorized Mint (Should Fail)
echo "Test 4: Unauthorized Mint (Should Fail)"
if ! sorosim simulate \
  --wasm $WASM_DIR/token.wasm \
  --function mint \
  --ledger $RESULTS_DIR/03-transferred.json \
  --args '[{"type":"Address","value":"GUSER...ABC"},{"type":"I128","value":"1000"}]' \
  --auth '{"address":"GUSER...ABC"}' \
  --output json > $RESULTS_DIR/04-result.json 2>&1; then
  echo -e "${GREEN}✓ PASS${NC}: Unauthorized mint correctly rejected"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}: Unauthorized mint should have failed"
  ((FAILED++))
fi
echo ""

# Test 5: Cross-Contract Call
echo "Test 5: Cross-Contract Invocation"
if sorosim simulate \
  --wasm $WASM_DIR/proxy.wasm \
  --function proxy_transfer \
  --ledger $TEST_DIR/cross-contract-config.json \
  --args '[{"type":"Address","value":"CTOKEN...ABC"},{"type":"Address","value":"GUSER1..."},{"type":"Address","value":"GUSER2..."},{"type":"I128","value":"250"}]' \
  --auth '{"address":"GUSER1..."}' \
  --output json > $RESULTS_DIR/05-result.json; then
  echo -e "${GREEN}✓ PASS${NC}: Cross-contract invocation"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}: Cross-contract invocation"
  ((FAILED++))
fi
echo ""

# Summary
echo "================================"
echo "Test Summary"
echo "================================"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo "Total:  $((PASSED + FAILED))"
echo ""

# Generate summary for PR comment
cat > $RESULTS_DIR/summary.md <<EOF
## 🧪 Contract Simulation Test Results

**Status:** $([ $FAILED -eq 0 ] && echo "✅ All tests passed" || echo "❌ Some tests failed")

| Metric | Count |
|--------|-------|
| ✅ Passed | $PASSED |
| ❌ Failed | $FAILED |
| 📊 Total | $((PASSED + FAILED)) |

### Test Details

1. **Token Initialization** - $([ $(jq -r '.success' $RESULTS_DIR/01-result.json 2>/dev/null || echo "false") == "true" ] && echo "✅ Pass" || echo "❌ Fail")
2. **Mint Tokens** - $([ $(jq -r '.success' $RESULTS_DIR/02-result.json 2>/dev/null || echo "false") == "true" ] && echo "✅ Pass" || echo "❌ Fail")
3. **Transfer Tokens** - $([ $(jq -r '.success' $RESULTS_DIR/03-result.json 2>/dev/null || echo "false") == "true" ] && echo "✅ Pass" || echo "❌ Fail")
4. **Unauthorized Mint** - ✅ Pass (correctly rejected)
5. **Cross-Contract Call** - $([ $(jq -r '.success' $RESULTS_DIR/05-result.json 2>/dev/null || echo "false") == "true" ] && echo "✅ Pass" || echo "❌ Fail")

[View detailed results](https://github.com/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID)
EOF

# Exit with error if any tests failed
if [ $FAILED -gt 0 ]; then
  exit 1
fi

echo -e "${GREEN}All tests passed!${NC}"
```

---

## GitLab CI Example

### `.gitlab-ci.yml`

```yaml
image: node:18

stages:
  - build
  - test

variables:
  CARGO_HOME: $CI_PROJECT_DIR/.cargo

cache:
  paths:
    - .cargo/
    - target/

before_script:
  - apt-get update && apt-get install -y curl build-essential
  - curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  - source $HOME/.cargo/env
  - rustup target add wasm32-unknown-unknown

build_contracts:
  stage: build
  script:
    - cargo install --locked soroban-cli
    - cd contracts
    - soroban contract build
  artifacts:
    paths:
      - contracts/target/wasm32-unknown-unknown/release/*.wasm
    expire_in: 1 hour

simulate_contracts:
  stage: test
  dependencies:
    - build_contracts
  script:
    - npm install -g sorosim-cli
    - ./scripts/run-simulations.sh
  artifacts:
    when: always
    paths:
      - test-results/
    reports:
      junit: test-results/junit.xml
```

---

## CircleCI Example

### `.circleci/config.yml`

```yaml
version: 2.1

orbs:
  node: circleci/node@5.0

jobs:
  build-and-test:
    docker:
      - image: cimg/rust:1.70-node
    steps:
      - checkout
      
      - restore_cache:
          keys:
            - cargo-cache-{{ checksum "Cargo.lock" }}
      
      - run:
          name: Install Soroban CLI
          command: cargo install --locked soroban-cli
      
      - run:
          name: Install SoroSim CLI
          command: npm install -g sorosim-cli
      
      - run:
          name: Build contracts
          command: |
            cd contracts
            soroban contract build
      
      - run:
          name: Run simulations
          command: ./scripts/run-simulations.sh
      
      - save_cache:
          paths:
            - ~/.cargo
            - target/
          key: cargo-cache-{{ checksum "Cargo.lock" }}
      
      - store_artifacts:
          path: test-results/
      
      - store_test_results:
          path: test-results/

workflows:
  build-and-test:
    jobs:
      - build-and-test
```

---

## Advanced Patterns

### Pattern 1: Snapshot-Based Testing

Use pre-built snapshots as test fixtures:

```yaml
- name: Run snapshot tests
  run: |
    for snapshot in test-snapshots/**/*.sorosim; do
      echo "Testing: $(basename $snapshot)"
      sorosim validate --snapshot "$snapshot" || exit 1
    done
```

---

### Pattern 2: Parallel Test Execution

Run tests in parallel for faster results:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        test-suite: [token, nft, dex, governance]
    steps:
      - name: Run ${{ matrix.test-suite }} tests
        run: ./scripts/test-${{ matrix.test-suite }}.sh
```

---

### Pattern 3: Performance Benchmarking

Track contract performance over time:

```bash
#!/bin/bash
# benchmark.sh

RESULT=$(sorosim simulate \
  --wasm contract.wasm \
  --function heavy_computation \
  --output json)

CPU=$(echo $RESULT | jq '.metrics.cpuInstructions')
MEMORY=$(echo $RESULT | jq '.metrics.memoryBytes')

echo "CPU: $CPU instructions"
echo "Memory: $MEMORY bytes"

# Fail if performance degrades
if [ $CPU -gt 50000 ]; then
  echo "❌ Performance regression: CPU usage too high"
  exit 1
fi

echo "✅ Performance within limits"
```

---

### Pattern 4: Contract Upgrade Testing

Test upgrade paths:

```bash
#!/bin/bash
# test-upgrade.sh

# Deploy v1
sorosim simulate \
  --wasm contract-v1.wasm \
  --function initialize \
  --save-state v1-state.json

# Upgrade to v2
sorosim simulate \
  --wasm contract-v2.wasm \
  --function migrate \
  --ledger v1-state.json \
  --save-state v2-state.json

# Verify v2 works
sorosim simulate \
  --wasm contract-v2.wasm \
  --function test_new_feature \
  --ledger v2-state.json
```

---

## Best Practices

### ✅ Do

- **Cache dependencies** — Speed up builds (Cargo, npm)
- **Run tests on every PR** — Catch issues early
- **Use matrix builds** — Test multiple scenarios in parallel
- **Generate test reports** — Track results over time
- **Comment PR with results** — Visibility for reviewers
- **Fail fast** — Stop on first failure for quick feedback
- **Archive results** — Keep artifacts for debugging

### ❌ Don't

- **Don't skip contract builds** — Always build fresh WASM
- **Don't ignore failures** — Fix or investigate every failure
- **Don't test only happy paths** — Include failure cases
- **Don't hardcode values** — Use environment variables
- **Don't run on every commit** — Use branch filters

---

## Environment Variables

### Secure Configuration

```yaml
env:
  SOROBAN_NETWORK: ${{ secrets.SOROBAN_NETWORK }}
  ADMIN_ADDRESS: ${{ secrets.ADMIN_ADDRESS }}

- name: Run simulations
  run: |
    sorosim simulate \
      --wasm contract.wasm \
      --function initialize \
      --args '[{"type":"Address","value":"'$ADMIN_ADDRESS'"}]'
```

---

## Monitoring and Alerts

### Slack Notifications

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Contract simulation tests failed'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

### GitHub Status Checks

```yaml
- name: Update commit status
  if: always()
  uses: actions/github-script@v6
  with:
    script: |
      github.rest.repos.createCommitStatus({
        owner: context.repo.owner,
        repo: context.repo.repo,
        sha: context.sha,
        state: '${{ job.status }}',
        context: 'Contract Simulations',
        description: 'Simulation tests ${{ job.status }}'
      });
```

---

## Debugging CI Failures

### Enable Verbose Output

```yaml
- name: Run simulations (verbose)
  run: |
    sorosim simulate \
      --wasm contract.wasm \
      --function my_function \
      --verbose \
      --debug
```

---

### SSH into CI Runner

**GitHub Actions:**
```yaml
- name: Setup tmate session
  if: failure()
  uses: mxschmitt/action-tmate@v3
```

---

### Save Debug Artifacts

```yaml
- name: Upload debug logs
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: debug-logs
    path: |
      test-results/
      *.log
```

---

## Testing Checklist

Before enabling CI:

- [ ] All contracts build successfully
- [ ] Simulation scripts run locally
- [ ] Test fixtures exist and are valid
- [ ] Environment variables configured
- [ ] Caching setup for dependencies
- [ ] Test results uploaded as artifacts
- [ ] Failure notifications configured
- [ ] PR comments enabled
- [ ] Performance benchmarks defined
- [ ] Documentation updated

---

## Real-World Example

### Complete Token Contract CI

**Repository Structure:**
```
my-token-project/
├── .github/
│   └── workflows/
│       └── contract-tests.yml
├── contracts/
│   ├── token/
│   │   ├── src/
│   │   └── Cargo.toml
│   └── Cargo.toml
├── scripts/
│   ├── run-simulations.sh
│   └── benchmark.sh
├── test-configs/
│   ├── base-state.json
│   └── multi-user-state.json
└── test-snapshots/
    ├── mint-scenario.sorosim
    └── transfer-scenario.sorosim
```

**See complete example:** [GitHub Repository](https://github.com/sorosim/examples/ci-integration)

---

## Related Guides

- **[CLI Quickstart](/docs/quickstart/cli)** — Learn CLI basics
- **[Session Snapshots](/docs/guides/snapshots)** — Using snapshots in CI
- **[Mock Ledger Configuration](/docs/guides/mock-ledger)** — Test fixtures setup

---

## Need Help?

- 💬 **Discord**: [Ask about CI integration](https://discord.gg/stellar)
- 📖 **Examples**: [CI workflow examples](https://github.com/sorosim/examples/ci)
- 🎥 **Video**: [CI/CD setup tutorial](https://youtube.com/sorosim)
