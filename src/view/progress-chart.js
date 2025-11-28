import { AbstractComponent } from "../framework/view/abstract-component.js";

export class ProgressChart extends AbstractComponent {
  constructor(chartData = []) {
    super();
    this._chartData = chartData;
  }

  getTemplate() {
    return `
      <div class="progress-section">
        <div class="progress-header">
          <div class="progress-title">Progress</div>
          <div class="time-filter">
            <button class="filter-btn">Day</button>
            <button class="filter-btn active">Week</button>
            <button class="filter-btn">Month</button>
          </div>
        </div>
        <div class="progress-chart">
          ${this._chartData.map(day => `
            <div class="chart-bar-container">
              <div class="chart-bar ${day.highlight ? "highlight" : ""}" style="height: ${day.height}px"></div>
              <div class="chart-label">${day.label}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }
}

