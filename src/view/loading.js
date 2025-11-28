import { AbstractComponent } from "../framework/view/abstract-component.js";

export class Loading extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <div class="loading-overlay">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    `;
  }
}

