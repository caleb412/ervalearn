import { StatsSection } from "../view/stats-section.js";
import { UserProfile } from "../view/user-profile.js";
import { StatBlocks } from "../view/stat-blocks.js";
import { WordOfTheDay } from "../view/word-of-the-day.js";
import { render, RenderPosition } from "../framework/render.js";
import { TaskModel } from "../model/task-model.js";
import { CourseModel } from "../model/course-model.js";
import { ENGLISH_WORDS } from "../mock/english-words.js";

export class StatsSectionPresenter {
  constructor(container, taskModel, courseModel) {
    this._container = container;
    this._taskModel = taskModel;
    this._courseModel = courseModel;
  }

  init() {
    this._renderStatsSection();

    // Subscribe to model changes for auto-refresh
    this._taskModel.subscribe(() => {
      if (!this._taskModel.isLoading()) {
        this.refresh();
      }
    });
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

      const statBlocksData = this._calculateStatBlocks();
      const statBlocks = new StatBlocks(statBlocksData);
      render(statBlocks, newStatsSection, RenderPosition.BEFOREEND);

      const wordOfTheDay = this._getWordOfTheDay();
      const wordOfTheDayComponent = new WordOfTheDay(wordOfTheDay);
      render(wordOfTheDayComponent, newStatsSection, RenderPosition.BEFOREEND);

      this._attachEventListeners();
    }
  }

  _calculateStats() {
    const course = this._courseModel.getCourse();
    const tasks = this._taskModel.getTasks();
    const completedTasks = tasks.filter((task) => task.completed);
    const isCourseCompleted = course.progress === 100;
    const isCourseInProgress = course.progress > 0 && course.progress < 100;

    return [
      {
        label: "Courses Completed",
        value: String(isCourseCompleted ? 1 : 0).padStart(2, "0"),
      },
      {
        label: "Total Points Gained",
        value: String(completedTasks.length * 10).padStart(3, "0"),
      },
      {
        label: "Courses In Progress",
        value: String(isCourseInProgress ? 1 : 0).padStart(2, "0"),
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

  _calculateStatBlocks() {
    const tasks = this._taskModel.getTasks();
    const completedTasks = tasks.filter((task) => task.completed);
    const unfinishedTasks = tasks.filter((task) => !task.completed);

    // Calculate learning streak (consecutive days with completed tasks)

    const learningStreak = this._calculateLearningStreak();

    return [
      {
        label: "Learning Streak",
        value: String(learningStreak),
      },
      {
        label: "Unfinished Tasks",
        value: String(unfinishedTasks.length),
      },
      {
        label: "Tasks Finished",
        value: String(completedTasks.length),
      },
    ];
  }

  _calculateLearningStreak() {
    // Simple streak calculation - count consecutive completed tasks
    const tasks = this._taskModel.getTasks();
    const completedTasks = tasks.filter((task) => task.completed);

    // Return a simple streak based on completed tasks
    if (completedTasks.length === 0) return 0;

    // streak = completed tasks / 2 (rounded)
    return Math.max(1, Math.floor(completedTasks.length / 2));
  }

  _getWordOfTheDay() {
    // Get a random word from the list. Use date-based seed to get same word for the day
    const today = new Date();
    const seed =
      today.getFullYear() * 10000 + today.getMonth() * 100 + today.getDate();
    const randomIndex = seed % ENGLISH_WORDS.length;
    return ENGLISH_WORDS[randomIndex];
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
      const oldStatBlocks = statsSectionElement.querySelector(".stat-blocks");

      if (oldStatBlocks) {
        const newStatBlocksData = this._calculateStatBlocks();
        const statBlocks = new StatBlocks(newStatBlocksData);
        oldStatBlocks.replaceWith(statBlocks.getElement());
      } else {
        // If stat blocks don't exist, re-render the entire section
        this._renderStatsSection();
      }
    }
  }
}
