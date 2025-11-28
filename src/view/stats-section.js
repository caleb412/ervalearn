import { AbstractComponent } from "../framework/view/abstract-component.js";

export class StatsSection extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="stats-section"></div>`;
  }
}

