import { AbstractComponent } from "../framework/view/abstract-component.js";

export class DictionarySection extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <div class="dictionary-section">
        <div class="dictionary-header">
          <div class="dictionary-title">Dictionary</div>
        </div>
        <div class="dictionary-search-prompt">
          <div class="search-prompt-icon">🔍</div>
          <div class="search-prompt-text">Search for a word to see its definition</div>
          <div class="dictionary-search-container">
            <input type="text" class="dictionary-search-input" placeholder="Enter a word..." />
            <button class="dictionary-search-btn">Search</button>
          </div>
          <div class="dictionary-results"></div>
        </div>
      </div>
    `;
  }
}
