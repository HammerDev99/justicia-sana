import { describe, it, expect } from 'vitest';
import { splitRichtextParagraphs } from '../../src/lib/richtext';

describe('splitRichtextParagraphs (F3 — hallazgo AUDIT_04, sin set:html)', () => {
  it('divide en párrafos por saltos de línea dobles (LF)', () => {
    expect(splitRichtextParagraphs('Primer párrafo.\n\nSegundo párrafo.')).toEqual([
      'Primer párrafo.',
      'Segundo párrafo.',
    ]);
  });

  it('divide en párrafos también con saltos de línea dobles CRLF', () => {
    expect(splitRichtextParagraphs('Primer párrafo.\r\n\r\nSegundo párrafo.')).toEqual([
      'Primer párrafo.',
      'Segundo párrafo.',
    ]);
  });

  it('descarta párrafos vacíos producidos por saltos de línea sobrantes', () => {
    expect(splitRichtextParagraphs('Uno.\n\n\n\nDos.\n\n')).toEqual(['Uno.', 'Dos.']);
  });

  it('un texto sin saltos dobles es un único párrafo', () => {
    expect(splitRichtextParagraphs('Un solo párrafo sin saltos.')).toEqual([
      'Un solo párrafo sin saltos.',
    ]);
  });
});
