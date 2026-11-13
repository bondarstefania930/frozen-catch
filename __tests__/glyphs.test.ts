import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..', 'src');
const BANNED = ['›', '‹', '▸', '▶', '▾', '▴', '→', '←', '⇒', '⟶', '⟵'];

function walk(dir: string, out: string[]): string[] {
  const entries = fs.readdirSync(dir);
  for (let i = 0; i < entries.length; i++) {
    const full = path.join(dir, entries[i]);
    if (fs.statSync(full).isDirectory()) {
      walk(full, out);
    } else if (/\.(ts|tsx)$/.test(full)) {
      out.push(full);
    }
  }
  return out;
}

describe('text safe for Android fallback fonts', () => {
  const files = walk(ROOT, []);

  it('uses no tofu-prone arrow glyphs', () => {
    files.forEach(f => {
      const src = fs.readFileSync(f, 'utf8');
      BANNED.forEach(g => {
        expect(src.indexOf(g)).toBe(-1);
      });
    });
  });

  it('uses no emoji anywhere', () => {
    const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
    files.forEach(f => {
      const src = fs.readFileSync(f, 'utf8');
      expect(emoji.test(src)).toBe(false);
    });
  });
});
