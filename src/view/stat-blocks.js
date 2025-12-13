import { AbstractComponent } from "../framework/view/abstract-component.js";

export class StatBlocks extends AbstractComponent {
  constructor(stats) {
    super();
    this._stats = stats;
  }

  getTemplate() {
    return `
      <div class="stat-blocks">
        ${this._stats
          .map(
            (stat) => `
          <div class="stat-block-card">
            <div class="stat-block-label">${stat.label}</div>
            <div class="stat-block-value">${stat.value}</div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }
}

