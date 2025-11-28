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
        <div class="dictionary-list"></div>
      </div>
    `;
  }
}
