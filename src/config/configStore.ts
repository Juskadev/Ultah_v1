import { useState, useEffect, useCallback } from 'react';
import { birthdayConfig as defaultConfig } from './birthdayConfig';

export type BirthdayConfigType = typeof defaultConfig;

export interface ColorThemePreset {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentGlowColor: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  previewGradient: string;
}

export const THEME_PRESETS: ColorThemePreset[] = [
  {
    id: 'cosmic-pink',
    name: 'Cosmic Romance 🌌',
    description: 'Deep Space Violet, Magenta Pink & Starlight Lavender',
    primaryColor: '#f472b6',
    secondaryColor: '#a78bfa',
    accentGlowColor: '#fbbf24',
    bgGradientStart: '#12082a',
    bgGradientEnd: '#0a0e1a',
    previewGradient: 'linear-gradient(135deg, #12082a, #f472b6, #a78bfa)',
  },
  {
    id: 'midnight-rose',
    name: 'Midnight Rose 🌹',
    description: 'Bright Velvet Burgundy, Radiant Pink & Ruby Wine',
    primaryColor: '#ff4d8d',
    secondaryColor: '#c2185b',
    accentGlowColor: '#fda4af',
    bgGradientStart: '#3d0a25',
    bgGradientEnd: '#1a0410',
    previewGradient: 'linear-gradient(135deg, #3d0a25, #ff4d8d, #c2185b)',
  },
  {
    id: 'oceanic-aurora',
    name: 'Oceanic Aurora 🌊',
    description: 'Abyssal Navy, Cyan Turquoise & Emerald Glow',
    primaryColor: '#2dd4bf',
    secondaryColor: '#38bdf8',
    accentGlowColor: '#a3e635',
    bgGradientStart: '#041c2c',
    bgGradientEnd: '#020e17',
    previewGradient: 'linear-gradient(135deg, #041c2c, #2dd4bf, #38bdf8)',
  },
  {
    id: 'golden-sunset',
    name: 'Champagne Sunset 👑',
    description: 'Royal Sunset, Champagne Gold & Amber Warmth',
    primaryColor: '#fbbf24',
    secondaryColor: '#f97316',
    accentGlowColor: '#fef08a',
    bgGradientStart: '#201202',
    bgGradientEnd: '#0a0601',
    previewGradient: 'linear-gradient(135deg, #201202, #fbbf24, #f97316)',
  },
  {
    id: 'mystic-violet',
    name: 'Mystic Amethyst 🔮',
    description: 'Electric Indigo, Neon Orchid & Fuchsia Aura',
    primaryColor: '#c084fc',
    secondaryColor: '#818cf8',
    accentGlowColor: '#e879f9',
    bgGradientStart: '#18042b',
    bgGradientEnd: '#080112',
    previewGradient: 'linear-gradient(135deg, #18042b, #c084fc, #818cf8)',
  },
  {
    id: 'silver-diamond',
    name: 'Silver Stardust 🤍',
    description: 'Midnight Slate, Platinum Silver & Diamond Ice',
    primaryColor: '#e2e8f0',
    secondaryColor: '#94a3b8',
    accentGlowColor: '#38bdf8',
    bgGradientStart: '#0f172a',
    bgGradientEnd: '#020617',
    previewGradient: 'linear-gradient(135deg, #0f172a, #e2e8f0, #94a3b8)',
  },
];

const STORAGE_KEY = 'cosmic_birthday_custom_config_v9';
const ADMIN_PIN_KEY = 'cosmic_admin_pin_v3';

// Helper to get initial config from localStorage or defaults
export function getSavedConfig(): BirthdayConfigType {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultConfig,
        ...parsed,
        sellerBrand: parsed.sellerBrand || defaultConfig.sellerBrand,
        watermarkText: parsed.watermarkText || defaultConfig.watermarkText,
        showWatermark: parsed.showWatermark ?? defaultConfig.showWatermark,
        sellerContact: parsed.sellerContact || defaultConfig.sellerContact,
        themePreset: parsed.themePreset || defaultConfig.themePreset,
        primaryColor: parsed.primaryColor || defaultConfig.primaryColor,
        secondaryColor: parsed.secondaryColor || defaultConfig.secondaryColor,
        accentGlowColor: parsed.accentGlowColor || defaultConfig.accentGlowColor,
        bgGradientStart: parsed.bgGradientStart || defaultConfig.bgGradientStart,
        bgGradientEnd: parsed.bgGradientEnd || defaultConfig.bgGradientEnd,
        orbitPhotos: parsed.orbitPhotos || defaultConfig.orbitPhotos,
        galleryPhotos: parsed.galleryPhotos || defaultConfig.galleryPhotos,
        timeline: parsed.timeline || defaultConfig.timeline,
        easterEggQuotes: parsed.easterEggQuotes || defaultConfig.easterEggQuotes,
      };
    }
  } catch (err) {
    console.error('Failed to load saved config from localStorage', err);
  }
  return defaultConfig;
}

const CONFIG_UPDATE_EVENT = 'cosmic_config_updated';

export function saveConfigToStorage(newConfig: BirthdayConfigType): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    window.dispatchEvent(new CustomEvent(CONFIG_UPDATE_EVENT, { detail: newConfig }));
    return true;
  } catch (err) {
    console.error('Failed to save config to localStorage', err);
    return false;
  }
}

export function resetConfigToDefaults(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(CONFIG_UPDATE_EVENT, { detail: defaultConfig }));
  } catch (err) {
    console.error('Failed to reset config', err);
  }
}

export function getAdminPin(): string {
  try {
    return localStorage.getItem(ADMIN_PIN_KEY) || '1234';
  } catch {
    return '1234';
  }
}

export function saveAdminPin(pin: string): void {
  try {
    localStorage.setItem(ADMIN_PIN_KEY, pin);
  } catch (err) {
    console.error('Failed to save admin pin', err);
  }
}

// React Hook for consuming and updating config
export function useBirthdayConfig() {
  const [config, setConfig] = useState<BirthdayConfigType>(getSavedConfig);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BirthdayConfigType>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      } else {
        setConfig(getSavedConfig());
      }
    };

    window.addEventListener(CONFIG_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(CONFIG_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateConfig = useCallback((newConfig: BirthdayConfigType) => {
    saveConfigToStorage(newConfig);
    setConfig(newConfig);
  }, []);

  const resetConfig = useCallback(() => {
    resetConfigToDefaults();
    setConfig(defaultConfig);
  }, []);

  return { config, updateConfig, resetConfig };
}
