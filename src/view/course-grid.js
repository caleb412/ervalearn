import { AbstractComponent } from "../framework/view/abstract-component.js";

export class CourseGrid extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
    <div class="course-grid-wrapper">
      <div class="section-title">
        My Courses
        <span class="view-all">View All</span>
      </div>
      <div class="course-grid"></div>
    </div>
  `;
  }
}
