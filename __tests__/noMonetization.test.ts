import * as fs from 'fs';
import * as path from 'path';
import {defaultProfile} from '../src/game/profile';
import {PRODUCT_FOOTER} from '../src/constants/config';

const ROOT = path.join(__dirname, '..', 'src');

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

describe('no real money, no ads, offline', () => {
  const files = walk(ROOT, []);
  const sources = files.map(f => fs.readFileSync(f, 'utf8'));

  it('has no balance, bet or purchase in the state', () => {
    const p: any = defaultProfile();
    expect(p.balance).toBeUndefined();
    expect(p.coins).toBeUndefined();
    expect(p.bet).toBeUndefined();
    expect(p.purchases).toBeUndefined();
  });

  it('never mentions ads, billing, IAP or real currency', () => {
    const banned = [
      'admob',
      'adsense',
      'billing',
      'in-app purchase',
      'iap',
      'paywall',
      'subscription',
      'real money',
      'rtp',
    ];
    sources.forEach((src, i) => {
      const lower = src.toLowerCase();
      banned.forEach(word => {
        if (word === 'real money' && files[i].indexOf('config') >= 0) {
          return;
        }
        expect(lower.indexOf(word)).toBe(-1);
      });
    });
  });

  it('does no networking', () => {
    sources.forEach(src => {
      expect(src).not.toMatch(/fetch\s*\(/);
      expect(src).not.toMatch(/XMLHttpRequest/);
      expect(src).not.toMatch(/https?:\/\/(?!schemas)/);
    });
  });

  it('states the product constraints on screen', () => {
    expect(PRODUCT_FOOTER).toContain('NO ADS');
    expect(PRODUCT_FOOTER).toContain('OFFLINE');
    expect(PRODUCT_FOOTER).toContain('FICTIONAL POINTS ONLY');
  });
});
