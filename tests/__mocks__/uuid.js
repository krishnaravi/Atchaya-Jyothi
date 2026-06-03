// CJS shim for uuid v14 (pure ESM) — used only in Jest's CommonJS test environment.
let counter = 0;
module.exports = {
  v4: () => `test-${++counter}-${Math.random().toString(36).slice(2)}`
};
