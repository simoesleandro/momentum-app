export interface ColorPalette {
  DEFAULT: string;
  light: string;
  dark: string;
}

export interface ThemeColors {
  'brand-primary': ColorPalette;
  'brand-background': { DEFAULT: string; dark: string; };
  'brand-surface': { DEFAULT: string; dark: string; };
  'brand-text': { DEFAULT: string; dark: string; };
  'brand-subtle': { DEFAULT: string; dark: string; };
}

export interface Theme {
  name: string;
  colors: ThemeColors;
}

export const themes: { [key: string]: Theme } = {
  default: {
    name: 'Púrpura (Padrão)',
    colors: {
      'brand-primary': { DEFAULT: '#7c3aed', light: '#a78bfa', dark: '#6d28d9' },
      'brand-background': { DEFAULT: '#f8f9fa', dark: '#111827' },
      'brand-surface': { DEFAULT: '#ffffff', dark: '#1f2937' },
      'brand-text': { DEFAULT: '#1f2937', dark: '#f9fafb' },
      'brand-subtle': { DEFAULT: '#6b7280', dark: '#9ca3af' }
    }
  },
  orange: {
    name: 'Laranja Pôr do Sol',
    colors: {
      'brand-primary': { DEFAULT: '#f97316', light: '#fb923c', dark: '#ea580c' },
      'brand-background': { DEFAULT: '#f8f9fa', dark: '#111827' },
      'brand-surface': { DEFAULT: '#ffffff', dark: '#1f2937' },
      'brand-text': { DEFAULT: '#1f2937', dark: '#f9fafb' },
      'brand-subtle': { DEFAULT: '#6b7280', dark: '#9ca3af' }
    }
  },
  emerald: {
    name: 'Esmeralda',
    colors: {
      'brand-primary': { DEFAULT: '#10b981', light: '#6ee7b7', dark: '#059669' },
      'brand-background': { DEFAULT: '#f8f9fa', dark: '#111827' },
      'brand-surface': { DEFAULT: '#ffffff', dark: '#1f2937' },
      'brand-text': { DEFAULT: '#1f2937', dark: '#f9fafb' },
      'brand-subtle': { DEFAULT: '#6b7280', dark: '#9ca3af' }
    }
  },
  rose: {
    name: 'Rosa',
    colors: {
      'brand-primary': { DEFAULT: '#f43f5e', light: '#fb7185', dark: '#e11d48' },
      'brand-background': { DEFAULT: '#f8f9fa', dark: '#111827' },
      'brand-surface': { DEFAULT: '#ffffff', dark: '#1f2937' },
      'brand-text': { DEFAULT: '#1f2937', dark: '#f9fafb' },
      'brand-subtle': { DEFAULT: '#6b7280', dark: '#9ca3af' }
    }
  },
  sky: {
    name: 'Céu',
    colors: {
      'brand-primary': { DEFAULT: '#0ea5e9', light: '#38bdf8', dark: '#0284c7' },
      'brand-background': { DEFAULT: '#f8f9fa', dark: '#111827' },
      'brand-surface': { DEFAULT: '#ffffff', dark: '#1f2937' },
      'brand-text': { DEFAULT: '#1f2937', dark: '#f9fafb' },
      'brand-subtle': { DEFAULT: '#6b7280', dark: '#9ca3af' }
    }
  }
};