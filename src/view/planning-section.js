import { AbstractComponent } from "../framework/view/abstract-component.js";

export class PlanningSection extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <div class="planning-section">
        <div class="planning-header">
          <div class="planning-title">Planning</div>
          <div class="view-all">View All</div>
        </div>
        <div class="schedule-grid"></div>
      </div>
    `;
  }
}

