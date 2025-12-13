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
          <div class="nav-item active" data-tab="home">
            <i><img src="assets/icons/home.png" alt="home icon" /></i>
            <span>Главная</span>
          </div>
          <div class="nav-item" data-tab="tests">
            <i><img src="assets/icons/book-bookmark.png" alt="tests icon" /></i>
            <span>Тесты</span>
          </div>
          <div class="nav-item" data-tab="dictionary">
            <i><img src="assets/icons/portfolio.png" alt="dictionary icon" /></i>
            <span>Словарь</span>
          </div>
          <div class="nav-item" data-tab="settings">
            <i><img src="assets/icons/settings.png" alt="settings icon" /></i>
            <span>Настройки</span>
          </div>
        </div>
      </div>
    `;
  }
}
