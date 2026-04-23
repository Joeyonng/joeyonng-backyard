import { describe, expect, it } from 'vitest';

import { filenameToApp, getFileExtension } from '../files';

describe('files utils', () => {
  it('extracts extensions from common file names', () => {
    expect(getFileExtension('notebook.ipynb')).toBe('ipynb');
    expect(getFileExtension('archive.tar.gz')).toBe('gz');
    expect(getFileExtension('.env')).toBe('');
    expect(getFileExtension('README')).toBe('');
  });

  it('routes known extensions to expected app IDs', () => {
    expect(filenameToApp('work.ipynb')).toBe('2');
    expect(filenameToApp('notes.md')).toBe('0');
  });
});
