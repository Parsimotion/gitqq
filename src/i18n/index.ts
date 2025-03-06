import fs from 'fs';
import path from 'path';
import os from 'os';

// Importar archivos de traducción
import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';

// Tipos de datos para las traducciones
export type Language = 'en' | 'es' | 'pt';

// Interfaz para la configuración
interface Config {
  language: Language;
}

// Ruta al archivo de configuración
const CONFIG_DIR = path.join(os.homedir(), '.git-smart');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Idioma por defecto
const DEFAULT_LANGUAGE: Language = 'en';

// Cargar traducciones
const translations: Record<Language, any> = {
  en,
  es,
  pt
};

// Función para obtener la configuración actual
function getConfig(): Config {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
      return JSON.parse(configData);
    }
  } catch (error) {
    console.error('Error reading config file:', error);
  }
  
  // Configuración por defecto si no existe el archivo
  return { language: DEFAULT_LANGUAGE };
}

// Función para guardar la configuración
export function saveConfig(config: Config): boolean {
  try {
    // Asegurar que el directorio existe
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

// Función para cambiar el idioma
export function setLanguage(language: Language): boolean {
  const config = getConfig();
  config.language = language;
  return saveConfig(config);
}

// Función para obtener el idioma actual
export function getCurrentLanguage(): Language {
  return getConfig().language;
}

// Función para obtener una traducción
export function t(key: string, ...args: any[]): string {
  const language = getCurrentLanguage();
  const keys = key.split('.');
  
  // Navegar por el objeto de traducciones
  let translation: any = translations[language];
  for (const k of keys) {
    if (!translation || !translation[k]) {
      // Si no se encuentra la traducción, intentar con el idioma por defecto
      translation = translations[DEFAULT_LANGUAGE];
      for (const defaultKey of keys) {
        if (!translation || !translation[defaultKey]) {
          return key; // Devolver la clave si no se encuentra la traducción
        }
        translation = translation[defaultKey];
      }
      break;
    }
    translation = translation[k];
  }
  
  // Si la traducción no es una cadena, devolver la clave
  if (typeof translation !== 'string') {
    return key;
  }
  
  // Reemplazar los argumentos en la traducción
  if (args.length > 0) {
    return translation.replace(/\{(\d+)\}/g, (match, index) => {
      const argIndex = parseInt(index, 10);
      return argIndex < args.length ? String(args[argIndex]) : match;
    });
  }
  
  return translation;
}

// Función para obtener un objeto de traducción completo
export function getTranslationObject(key: string): any {
  const language = getCurrentLanguage();
  const keys = key.split('.');
  
  // Navegar por el objeto de traducciones
  let translation: any = translations[language];
  for (const k of keys) {
    if (!translation || !translation[k]) {
      // Si no se encuentra la traducción, intentar con el idioma por defecto
      translation = translations[DEFAULT_LANGUAGE];
      for (const defaultKey of keys) {
        if (!translation || !translation[defaultKey]) {
          return {}; // Devolver un objeto vacío si no se encuentra la traducción
        }
        translation = translation[defaultKey];
      }
      break;
    }
    translation = translation[k];
  }
  
  return translation;
}

// Exportar el objeto de traducciones para acceso directo
export const i18n = {
  t,
  getTranslationObject,
  getCurrentLanguage,
  setLanguage,
  saveConfig
};

export default i18n; 