import fs from 'fs';
import path from 'path';
import os from 'os';

// Import translation files
import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';

// Data types for translations
export type Language = 'en' | 'es' | 'pt';

// Interface for configuration
interface Config {
  language: Language;
  interaction: 'interactive' | 'non-interactive' | 'hybrid';
}

// Path to configuration file
const CONFIG_DIR = path.join(os.homedir(), '.gitqq');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Default language
const DEFAULT_LANGUAGE: Language = 'en';
const DEFAULT_INTERACTION = 'interactive';

// Load translations
const translations: Record<Language, any> = {
  en,
  es,
  pt
};

// Function to get current configuration
function getConfig(): Config {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
      return JSON.parse(configData);
    }
  } catch (error) {
    console.error('Error reading config file:', error);
  }
  
  // Default configuration if file doesn't exist
  return { language: DEFAULT_LANGUAGE, interaction: DEFAULT_INTERACTION };
}

// Function to save configuration
export function saveConfig(config: Config): boolean {
  try {
    // Ensure directory exists
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
}

// Function to change language
export function setLanguage(language: Language): boolean {
  const config = getConfig();
  config.language = language;
  return saveConfig(config);
}

// Function to get current language
export function getCurrentLanguage(): Language {
  return getConfig().language;
}

// Function to get a translation
export function t(key: string, ...args: any[]): string {
  const language = getCurrentLanguage();
  const keys = key.split('.');
  
  // Navigate through the translations object
  let translation: any = translations[language];
  for (const k of keys) {
    if (!translation || !translation[k]) {
      // If translation not found, try with default language
      translation = translations[DEFAULT_LANGUAGE];
      for (const defaultKey of keys) {
        if (!translation || !translation[defaultKey]) {
          return key; // Return the key if translation not found
        }
        translation = translation[defaultKey];
      }
      break;
    }
    translation = translation[k];
  }
  
  // If translation is not a string, return the key
  if (typeof translation !== 'string') {
    return key;
  }
  
  // Replace arguments in the translation
  if (args.length > 0) {
    return translation.replace(/\{(\d+)\}/g, (match, index) => {
      const argIndex = parseInt(index, 10);
      return argIndex < args.length ? String(args[argIndex]) : match;
    });
  }
  
  return translation;
}

// Function to get a complete translation object
export function getTranslationObject(key: string): any {
  const language = getCurrentLanguage();
  const keys = key.split('.');
  
  // Navigate through the translations object
  let translation: any = translations[language];
  for (const k of keys) {
    if (!translation || !translation[k]) {
      // If translation not found, try with default language
      translation = translations[DEFAULT_LANGUAGE];
      for (const defaultKey of keys) {
        if (!translation || !translation[defaultKey]) {
          return {}; // Return empty object if translation not found
        }
        translation = translation[defaultKey];
      }
      break;
    }
    translation = translation[k];
  }
  
  return translation;
}

// Function to change interaction mode
export function setInteractionMode(mode: 'interactive' | 'non-interactive' | 'hybrid'): boolean {
  const config = getConfig();
  config.interaction = mode;
  return saveConfig(config);
}

// Function to get current interaction mode
export function getCurrentInteractionMode(): 'interactive' | 'non-interactive' | 'hybrid' {
  return getConfig().interaction;
}

// Export translations object for direct access
export const i18n = {
  t,
  getTranslationObject,
  getCurrentLanguage,
  setLanguage,
  getCurrentInteractionMode,
  setInteractionMode,
  saveConfig
};

export default i18n; 