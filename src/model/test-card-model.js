import { LearningAPIService } from "../api.js";

export class TestCardModel {
  constructor(apiService = null) {
    this._testCards = [];
    this._apiService = apiService || new LearningAPIService();
    this._isLoading = false;
    this._subscribers = [];
  }

  subscribe(callback) {
    this._subscribers.push(callback);
  }

  _notify() {
    this._subscribers.forEach((cb) => cb());
  }

  async initialize() {
    this._isLoading = true;
    this._notify();
    try {
      const cards = await this._apiService.getTestCards();
      if (cards && cards.length > 0) {
        this._testCards = cards.map((card) => ({
          ...card,
          lastReviewed: card.lastReviewed || null,
        }));
      } else {
        // No test cards from server - show empty state
        this._testCards = [];
      }
    } catch (error) {
      // API error - show empty state
      this._testCards = [];
    } finally {
      this._isLoading = false;
      this._notify();
    }
  }

  isLoading() {
    return this._isLoading;
  }

  getTestCards() {
    return this._testCards;
  }

  getTestCardById(id) {
    if (!id) return null;
    // Normalize ID comparison - handle both string and number IDs
    const normalizedId = String(id);
    return this._testCards.find((card) => String(card.id) === normalizedId);
  }

  async toggleTestCardCompletion(id) {
    const card = this.getTestCardById(id);
    if (!card) {
      return null;
    }

    const normalizedId = String(id);
    const cardIndex = this._testCards.findIndex(
      (c) => String(c.id) === normalizedId
    );
    if (cardIndex === -1) {
      return null;
    }

    // Store original state for potential revert
    const originalCard = { ...card };

    // Optimistic update - update local state immediately
    const newCompletedState = !card.completed;
    const newLastReviewed = new Date().toISOString();

    this._testCards[cardIndex] = {
      ...card,
      completed: newCompletedState,
      lastReviewed: newLastReviewed,
    };

    // Notify immediately for instant UI update
    this._notify();

    // Sync with API - await to ensure it completes before returning
    try {
      const updatedCard = await this._apiService.updateTestCard(normalizedId, {
        title: card.title,
        question: card.question,
        answer: card.answer,
        completed: newCompletedState,
        lastReviewed: newLastReviewed,
      });

      if (updatedCard) {
        // Update with server response to ensure consistency
        this._testCards[cardIndex] = {
          ...updatedCard,
          lastReviewed: updatedCard.lastReviewed || newLastReviewed,
        };
        this._notify();
        return this._testCards[cardIndex];
      } else {
        // API call failed - revert optimistic update to maintain integrity
        this._testCards[cardIndex] = originalCard;
        this._notify();
        return null;
      }
    } catch (error) {
      // API call failed - revert optimistic update to maintain integrity
      this._testCards[cardIndex] = originalCard;
      this._notify();
      return null;
    }
  }
}
