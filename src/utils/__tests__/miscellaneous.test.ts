import { describe, expect, it } from 'vitest';

import { formatDateTime } from '../miscellaneous';

describe('miscellaneous utils', () => {
  it('formats datetime like "MMM DD YYYY" (toDateString slice)', () => {
    const date = new Date('2025-01-15T12:00:00Z');
    expect(formatDateTime(date)).toBe(date.toDateString().substr(4, 11));
  });

  it('works for another known date', () => {
    const date = new Date('2024-07-04T00:00:00Z');
    expect(formatDateTime(date)).toBe(date.toDateString().substr(4, 11));
  });
});
