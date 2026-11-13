import * as fs from 'fs';
import * as path from 'path';

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

const ROOT = path.join(__dirname, '..', 'src');

function walk(dir: string, out: string[]): string[] {
  fs.readdirSync(dir).forEach(name => {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      walk(full, out);
    } else if (/\.tsx?$/.test(full)) {
      out.push(full);
    }
  });
  return out;
}

const files = walk(ROOT, []);

describe('module graph', () => {
  it('loads every screen, component, hook and game module', () => {
    expect(files.length).toBeGreaterThan(30);
    files.forEach(f => {
      expect(() => require(f)).not.toThrow();
    });
  });

  it('exports a component from every screen', () => {
    const screens = files.filter(f => f.indexOf('screens') >= 0);
    expect(screens.length).toBe(8);
    screens.forEach(f => {
      expect(typeof require(f).default).toBe('function');
    });
  });

  it('every lucide icon referenced in the UI really exists', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const lucide = require('lucide-react-native');
    const used = new Set<string>();
    files.forEach(f => {
      const src = fs.readFileSync(f, 'utf8');
      const re = /import\s*\{([^}]+)\}\s*from\s*'lucide-react-native'/g;
      let m = re.exec(src);
      while (m) {
        m[1]
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0 && s !== 'LucideIcon')
          .forEach(s => used.add(s));
        m = re.exec(src);
      }
    });
    expect(used.size).toBeGreaterThan(10);
    used.forEach(name => {
      expect(lucide[name]).toBeDefined();
    });
  });
});
