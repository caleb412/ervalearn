import { AbstractComponent } from "../framework/view/abstract-component.js";

export class CourseDashboard extends AbstractComponent {
  constructor(courseData) {
    super();
    this._courseData = courseData;
  }

  getTemplate() {
    const { name, lessonsCount, progress } = this._courseData;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (progress / 100) * circumference;

    return `
      <div class="course-dash">
        <div class="course-dash-header">
          <div class="course-dash-title">My Course</div>
        </div>
        <div class="course-dash-content">
          <div class="course-dash-card">
            <div class="course-dash-left">
              <div class="progress-container">
                <svg class="progress-circle-svg" width="120" height="120">
                  <circle
                    class="progress-circle-bg"
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    stroke-width="8"
                  />
                  <circle
                    class="progress-circle-fill"
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="white"
                    stroke-width="8"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${offset}"
                    stroke-linecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div class="progress-text-overlay">
                  <div class="progress-percentage">${progress}%</div>
                </div>
              </div>
              <div class="course-info">
                <div class="course-name">${name}</div>
                <div class="lessons-count">${lessonsCount} lessons</div>
              </div>
            </div>
            <div class="course-dash-right">
              <!-- TO-DO: Look for and add background image -->
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
