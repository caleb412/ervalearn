import { Sidebar } from "./view/sidebar.js";
import { MainSectionPresenter } from "./presenter/main-section-presenter.js";
import { StatsSectionPresenter } from "./presenter/stats-section-presenter.js";
import { render, RenderPosition } from "./framework/render.js";
import { TaskModel } from "./model/task-model.js";
import { CourseModel } from "./model/course-model.js";
import { DictionaryModel } from "./model/dictionary-model.js";
import { TestCardModel } from "./model/test-card-model.js";

class App {
  constructor() {
    this._taskModel = new TaskModel();
    this._courseModel = new CourseModel(this._taskModel);
    this._dictionaryModel = new DictionaryModel();
    this._testCardModel = new TestCardModel();
  }

  init() {
    this._renderSidebar();
    this._initMainSection();
    this._initStatsSection();
  }

  _renderSidebar() {
    const sidebarContainer = document.querySelector(".sidebar");
    if (sidebarContainer) {
      const sidebar = new Sidebar();
      render(sidebar, sidebarContainer, RenderPosition.BEFOREEND);

      this._attachSidebarListeners();
    }
  }

  _attachSidebarListeners() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        navItems.forEach((nav) => nav.classList.remove("active"));
        item.classList.add("active");
      });
    });
  }

  _initMainSection() {
    const mainContent = document.querySelector(".main-content .content-area");
    if (mainContent) {
      this._mainSectionPresenter = new MainSectionPresenter(
        mainContent,
        this._taskModel,
        this._courseModel,
        this._dictionaryModel,
        this._testCardModel
      );
      this._mainSectionPresenter.init();
    }
  }

  _initStatsSection() {
    const statsSection = document.querySelector(".stats-section");
    if (statsSection) {
      this._statsSectionPresenter = new StatsSectionPresenter(
        statsSection.parentElement,
        this._taskModel,
        this._courseModel
      );
      this._statsSectionPresenter.init();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
  window.app = app;
});
