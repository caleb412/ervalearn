import { MOCK_DICTIONARY_ITEMS } from "../mock/mock-dictionary.js";

export class DictionaryModel {
  constructor() {
    this._words = MOCK_DICTIONARY_ITEMS.map((word) => ({ ...word }));
    this._nextId = Math.max(...MOCK_DICTIONARY_ITEMS.map((w) => w.id), 0) + 1;
  }

  getWords() {
    return this._words;
  }

  getWordById(id) {
    return this._words.find((word) => word.id === id);
  }

  getWordsByLanguage(language) {
    if (language === "all") return this._words;
    return this._words.filter((word) => word.language === language);
  }

  toggleWordCompletion(id) {
    const word = this.getWordById(id);
    if (word) {
      word.completed = !word.completed;
      return word;
    }
    return null;
  }
}

