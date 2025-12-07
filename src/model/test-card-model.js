import { MOCK_TEST_CARDS } from "../mock/mock-test-cards.js";

export class TestCardModel {
  constructor() {
    this._testCards = MOCK_TEST_CARDS.map((card) => ({ ...card }));
    this._nextId = Math.max(...MOCK_TEST_CARDS.map((c) => c.id), 0) + 1;
  }

  getTestCards() {
    return this._testCards;
  }

  getTestCardById(id) {
    return this._testCards.find((card) => card.id === id);
  }

  getTestCardsByLanguage(language) {
    if (language === "all") return this._testCards;
    return this._testCards.filter((card) => card.language === language);
  }

  toggleTestCardCompletion(id) {
    const card = this.getTestCardById(id);
    if (card) {
      card.completed = !card.completed;
      if (card.completed && card.progress.completed < card.progress.total) {
        card.progress.completed += 1;
      }
      return card;
    }
    return null;
  }
}

