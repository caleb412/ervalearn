import { Sidebar } from "./view/sidebar.js";
import { MainSectionPresenter } from "./presenter/main-section-presenter.js";
import { StatsSectionPresenter } from "./presenter/stats-section-presenter.js";
import { render, RenderPosition } from "./framework/render.js";
import { TaskModel } from "./model/task-model.js";
import { CourseModel } from "./model/course-model.js";
import { TestCardModel } from "./model/test-card-model.js";

class App {
  constructor() {
    this._taskModel = new TaskModel();
    this._courseModel = new CourseModel(this._taskModel);
    this._testCardModel = new TestCardModel();
    this._isInitializing = false;
  }

  async init() {
    this._renderSidebar();
    await this._initializeData();
    this._initMainSection();
    this._initStatsSection();
  }

  async _initializeData() {
    this._isInitializing = true;
    this._showLoading();
    
    try {
      await Promise.all([
        this._taskModel.initialize(),
        this._testCardModel.initialize(),
      ]);
      // Update course model after tasks are loaded
      this._courseModel = new CourseModel(this._taskModel);
    } catch (error) {
    } finally {
      this._isInitializing = false;
      this._hideLoading();
    }
  }

  _showLoading() {
    if (document.querySelector(".loading-overlay")) return; // Prevent duplicate overlays
    const loading = document.createElement("div");
    loading.className = "loading-overlay";
    loading.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    `;
    document.body.appendChild(loading);
  }

  _hideLoading() {
    const loading = document.querySelector(".loading-overlay");
    if (loading) {
      loading.remove();
    }
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
        const tabName = item.dataset.tab;
        if (tabName) {
          this._switchTab(tabName);
          navItems.forEach((nav) => nav.classList.remove("active"));
          item.classList.add("active");
        }
      });
    });
  }

  _switchTab(tabName) {
    const tabPanes = document.querySelectorAll(".tab-pane");
    tabPanes.forEach((pane) => {
      if (pane.dataset.tab === tabName) {
        pane.classList.add("active");
      } else {
        pane.classList.remove("active");
      }
    });

    // Only re-render main section for dictionary tab (as per requirements)
    if (tabName === "dictionary" && this._mainSectionPresenter) {
      this._mainSectionPresenter.renderDictionaryTab();
    }
    // Home and Tests tabs just show/hide existing content, no re-render needed
  }

  _initMainSection() {
    const mainContent = document.querySelector(".main-content .content-area");
    if (mainContent) {
      this._mainSectionPresenter = new MainSectionPresenter(
        mainContent,
        this._taskModel,
        this._courseModel,
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
