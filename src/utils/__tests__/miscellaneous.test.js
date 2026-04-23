import { describe, expect, it } from 'vitest';

import { formatDateTime } from '../miscellaneous';
import { parseHtmlUrl } from '../github';

describe('misc utilities', () => {
  it('formats date to a short readable string', () => {
    const value = formatDateTime(new Date('2026-04-23T10:00:00Z'));
    expect(value).toMatch(/^[A-Z][a-z]{2} \d{2} 2026$/);
  });

  it('parses github html urls into parts', () => {
    expect(parseHtmlUrl('https://github.com/Joeyonng/react-big-sur/blob/main/src/index.js')).toEqual({
      username: 'Joeyonng',
      repoName: 'react-big-sur',
      filename: 'index.js',
    });
  });
});
