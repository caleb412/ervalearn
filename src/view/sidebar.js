import { AbstractComponent } from "../framework/view/abstract-component.js";

export class Sidebar extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <div class="sidebar">
        <div class="logo">
          <div class="logo-icon">
            <i><img src="assets/icons/brain.png" alt="ErvaLearn logo" /></i>
          </div>
          <span>ErvaLearn</span>
        </div>

        <div class="nav-menu">
          <div class="nav-item active">
            <i><img src="assets/icons/home.png" alt="home icon" /></i>
            <span>Overview</span>
          </div>
          <div class="nav-item">
            <i><img src="assets/icons/book-bookmark.png" alt="course icon" /></i>
            <span>Course</span>
          </div>
          <div class="nav-item">
            <i><img src="assets/icons/portfolio.png" alt="resources icon" /></i>
            <span>Resources</span>
          </div>
          <div class="nav-item">
            <i><img src="assets/icons/envelope.png" alt="messages icon" /></i>
            <span>Message</span>
          </div>
          <div class="nav-item">
            <i><img src="assets/icons/settings.png" alt="settings icon" /></i>
            <span>Settings</span>
          </div>
        </div>
      </div>
    `;
  }
}

