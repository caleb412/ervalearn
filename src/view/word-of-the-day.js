import { AbstractComponent } from "../framework/view/abstract-component.js";

export class WordOfTheDay extends AbstractComponent {
  constructor(wordData) {
    super();
    this._wordData = wordData;
  }

  getTemplate() {
    const { word, type, meaning, example } = this._wordData;

    return `
      <div class="word-of-the-day">
        <div class="word-of-the-day-header">
          <div class="word-of-the-day-title">Слово дня</div>
        </div>
        <div class="word-of-the-day-content">
          <div class="word-main">
            <div class="word-text">${word}</div>
            <div class="word-type">${type}</div>
          </div>
          <div class="word-meaning">${meaning}</div>
          <div class="word-example">
            <em>${example}</em>
          </div>
        </div>
      </div>
    `;
  }
}
