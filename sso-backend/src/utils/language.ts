
const _availableLanguages = ['fr', 'en'];

const isAvailable = (language?: string): boolean => {
  return !!language && _availableLanguages.includes(language);
}

const defaultOne = 'fr';

export { isAvailable, defaultOne };
