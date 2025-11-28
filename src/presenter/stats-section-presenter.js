import { StatsSection } from "../view/stats-section.js";
import { UserProfile } from "../view/user-profile.js";
import { StatsGrid } from "../view/stats-grid.js";
import { ProgressChart } from "../view/progress-chart.js";
import { render, RenderPosition } from "../framework/render.js";
import { TaskModel } from "../model/task-model.js";
import { CourseModel } from "../model/course-model.js";

export class StatsSectionPresenter {
  constructor(container, taskModel, courseModel) {
    this._container = container;
    this._taskModel = taskModel;
    this._courseModel = courseModel;
  }

  init() {
    this._renderStatsSection();
  }

  _renderStatsSection() {
    const statsSectionContainer =
      this._container.querySelector(".stats-section");
    if (statsSectionContainer) {
      const statsSection = new StatsSection();
      const statsSectionElement = statsSection.getElement();
      statsSectionContainer.replaceWith(statsSectionElement);

      const newStatsSection = this._container.querySelector(".stats-section");

      const userProfile = new UserProfile();
      render(userProfile, newStatsSection, RenderPosition.BEFOREEND);

      const stats = this._calculateStats();
      const statsGrid = new StatsGrid(stats);
      render(statsGrid, newStatsSection, RenderPosition.BEFOREEND);

      const chartData = this._getChartData();
      const progressChart = new ProgressChart(chartData);
      render(progressChart, newStatsSection, RenderPosition.BEFOREEND);

      this._attachEventListeners();
    }
  }

  _calculateStats() {
    const courses = this._courseModel.getCourses();
    const tasks = this._taskModel.getTasks();
    const completedTasks = tasks.filter((task) => task.completed);
    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );

    return [
      {
        label: "Courses Completed",
        value: String(completedCourses.length).padStart(2, "0"),
      },
      {
        label: "Total Points Gained",
        value: String(completedTasks.length * 10).padStart(3, "0"),
      },
      {
        label: "Courses In Progress",
        value: String(
          courses.filter((c) => c.progress > 0 && c.progress < 100).length
        ).padStart(2, "0"),
      },
      {
        label: "Tasks Finished",
        value: String(completedTasks.length).padStart(2, "0"),
      },
    ];
  }

  _getChartData() {
    return [
      { label: "Mon", height: 80, highlight: false },
      { label: "Tue", height: 100, highlight: false },
      { label: "Wed", height: 60, highlight: false },
      { label: "Thu", height: 120, highlight: true },
      { label: "Fri", height: 90, highlight: false },
      { label: "Sat", height: 110, highlight: false },
      { label: "Sun", height: 95, highlight: false },
    ];
  }

  //TO-DO: Come back to this for future implementation
  _attachEventListeners() {
    const filterButtons = this._container.querySelectorAll(".filter-btn");
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
      });
    });
  }

  refresh() {
    const statsSectionElement = this._container.querySelector(".stats-section");
    if (statsSectionElement) {
      const oldStatsGridContainer =
        statsSectionElement.querySelector(".stats-grid")?.parentElement;
      if (oldStatsGridContainer) {
        const newStats = this._calculateStats();
        const statsGrid = new StatsGrid(newStats);
        oldStatsGridContainer.replaceWith(statsGrid.getElement());
      } else {
        this._renderStatsSection();
      }
    }
  }
}
