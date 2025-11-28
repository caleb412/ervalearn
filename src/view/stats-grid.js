import { AbstractComponent } from "../framework/view/abstract-component.js";

export class StatsGrid extends AbstractComponent {
  constructor(stats = []) {
    super();
    this._stats = stats;
  }

  getTemplate() {
    return `
      <div class="stats-header">Statistics</div>
      <div class="stats-grid">
        ${this._stats.map(stat => `
          <div class="stat-card">
            <div class="stat-label">${stat.label}</div>
            <div class="stat-value">${stat.value}</div>
          </div>
        `).join("")}
      </div>
    `;
  }
}

