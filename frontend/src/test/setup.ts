import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';

// The app remembers the selected trip and data source in localStorage; reset
// it between tests so one test's selection never leaks into the next.
afterEach(() => {
  localStorage.clear();
});
