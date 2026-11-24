import { Injectable, signal } from '@angular/core';

export type ThemeName = 'moonlight' | 'phosphor' | 'amber' | 'paper';

export type Theme = {
  name: ThemeName;
  label: string;
  swatch: string;
};

export const THEMES: Theme[] = [
  { name: 'moonlight', label: 'moonlight', swatch: '#8fb7f5' },
  { name: 'phosphor', label: 'phosphor', swatch: '#7ef0b2' },
  { name: 'amber', label: 'amber', swatch: '#e8b06a' },
  { name: 'paper', label: 'paper', swatch: '#cfd8e4' },
];

const STORAGE_KEY = 'adi.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<ThemeName>('moonlight');

  constructor() {
    const saved = this.readSaved();
    this.apply(saved);
  }

  cycle(): ThemeName {
    const index = THEMES.findIndex((t) => t.name === this.theme());
    const next = THEMES[(index + 1) % THEMES.length].name;
    this.apply(next);
    return next;
  }

  set(name: ThemeName): void {
    this.apply(name);
  }

  private readSaved(): ThemeName {
    if (typeof localStorage === 'undefined') return 'moonlight';
    try {
      const value = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
      return value && THEMES.some((t) => t.name === value) ? value : 'moonlight';
    } catch {
      return 'moonlight';
    }
  }

  private apply(name: ThemeName): void {
    this.theme.set(name);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset['theme'] = name;
    }
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch {
      /* storage can be blocked; the theme still applies for this session */
    }
  }
}
