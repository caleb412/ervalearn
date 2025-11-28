import { AbstractComponent } from "../framework/view/abstract-component.js";

export class CourseCard extends AbstractComponent {
  constructor(courseData) {
    super();
    this._courseData = courseData;
  }

  getTemplate() {
    const { name, lessonsCount, progress, color } = this._courseData;
    const colorClass = color ? color : "";

    return `
      <div class="course-card ${colorClass}">
        <div class="course-name">${name}</div>
        <div class="lessons-count">${lessonsCount} lessons</div>
        <div class="progress-container">
          <div class="progress-circle">${progress}%</div>
          <div class="progress-text">Complete</div>
        </div>
      </div>
    `;
  }
}
