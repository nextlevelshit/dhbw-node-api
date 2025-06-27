# DHBW - Server-side JavaScript Testing Pyramid Demo

A simple Express cache API demonstrating proper test architecture following the testing pyramid principle.

## Test Structure

- **Unit Tests** (`tests/unit/`): Test individual components in isolation
  - `Cache.test.js`: Pure cache logic without HTTP layer
  - Fast execution (~1-10ms per test)
  - No external dependencies

- **Integration Tests** (`tests/integration/`): Test component interactions
  - `api.test.js`: HTTP endpoints with mocked cache
  - Medium execution (~10-100ms per test)
  - Mocked external dependencies

- **E2E Tests** (`tests/e2e/`): Test complete user scenarios
  - `server.test.js`: Full HTTP server with real database
  - Slow execution (~100ms-1s+ per test)
  - Real external dependencies

## Running Tests

```bash
npm test                  # Run all tests
npm run test.unit         # Fast feedback loop during development
npm run test.integration  # API contract validation
npm run test.e2e          # Full system validation
npm run test.coverage     # Coverage report
```

## Why This Structure?

1. **Speed**: Unit tests give instant feedback
2. **Reliability**: Less moving parts = less flakiness
3. **Cost**: Unit tests are cheap to maintain
4. **Debugging**: Failures are easier to isolate
5. **Confidence**: E2E tests validate real user scenarios

The ratio should be roughly 70% unit, 20% integration, 10% e2e tests.

```

This structure follows Kent Beck's testing philosophy and gives you a proper foundation for teaching the testing pyramid concept. The unit tests are blazing fast, integration tests validate contracts, and e2e tests ensure the whole system works together.
```
