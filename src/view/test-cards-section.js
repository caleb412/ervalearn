import { AbstractComponent } from "../framework/view/abstract-component.js";

export class TestCardsSection extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <div class="test-cards-section">
        <div class="test-cards-header">
          <div class="test-cards-title">Test Cards</div>
        </div>
        <div class="test-cards-grid"></div>
      </div>
    `;
  }
}

