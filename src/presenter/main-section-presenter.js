import { Header } from "../components/header.js";
import { CourseGrid } from "../components/course-grid.js";
import { CourseCard } from "../components/course-card.js";
import { PlanningSection } from "../components/planning-section.js";
import { TaskForm } from "../components/task-form.js";
import { ScheduleItem } from "../components/schedule-item.js";
import { DictionarySection } from "../components/dictionary-section.js";
import { DictionaryItem } from "../components/dictionary-item.js";
import { TestCardsSection } from "../components/test-cards-section.js";
import { TestCard } from "../components/test-card.js";
import { FilterBar } from "../components/filter-bar.js";
import { Loading } from "../components/loading.js";
import { render, RenderPosition } from "../framework/render.js";
import { TaskModel } from "../model/task-model.js";
import { CourseModel } from "../model/course-model.js";
import { TASK_ICON_MAP, LANGUAGE_NAMES } from "../model/task-icon-map.js";

export class MainSectionPresenter {
  constructor(
    container,
    taskModel,
    courseModel,
    dictionaryModel,
    testCardModel
  ) {
    this._container = container;
    this._taskModel = taskModel;
    this._courseModel = courseModel;
    this._dictionaryModel = dictionaryModel;
    this._testCardModel = testCardModel;
    this._editingTaskId = null;
    this._filterLanguage = "all";
    this._filterTaskType = "all";
  }

  init() {
    this._renderHeader();
    this._renderCourseGrid();
    this._renderPlanningSection();
    this._renderDictionarySection();
    this._renderTestCardsSection();
  }

  _renderHeader() {
    const headerContainer = this._container.querySelector(".header");
    if (headerContainer) {
      headerContainer.innerHTML = "";
      const header = new Header();
      render(header, headerContainer, RenderPosition.BEFOREEND);
    }
  }

  _renderCourseGrid() {
    const sectionTitleContainer =
      this._container.querySelector(".section-title");
    const courseGridContainer = this._container.querySelector(".course-grid");

    if (sectionTitleContainer && courseGridContainer) {
      // Set section title content directly. Or render directly in the component? Come back to this!!
      sectionTitleContainer.innerHTML = `
        My Courses
        <span class="view-all">View All</span>
      `;

      // Clear and render course cards. Rerendering to keep info updatad
      courseGridContainer.innerHTML = "";
      const courses = this._courseModel.getCourses();
      courses.forEach((course) => {
        const courseCard = new CourseCard(course);
        render(courseCard, courseGridContainer, RenderPosition.BEFOREEND);
      });
    }
  }

  _renderPlanningSection() {
    const planningSectionContainer =
      this._container.querySelector(".planning-section");
    if (planningSectionContainer) {
      // Replacing the planning section
      const planningSection = new PlanningSection();
      const planningSectionElement = planningSection.getElement();
      planningSectionContainer.replaceWith(planningSectionElement);

      const newPlanningSection =
        this._container.querySelector(".planning-section");

      // Rendering the  filter bar
      const filterBar = new FilterBar();
      render(filterBar, newPlanningSection, RenderPosition.BEFOREEND);

      // Rendering task form
      const taskForm = new TaskForm(false);
      render(taskForm, newPlanningSection, RenderPosition.BEFOREEND);

      // Rendering schedule items
      this._renderScheduleItems();

      // Attach event listeners to the planning section
      this._attachPlanningEventListeners();
    }
  }

  _renderScheduleItems() {
    const scheduleGrid = this._container.querySelector(".schedule-grid");
    if (scheduleGrid) {
      scheduleGrid.innerHTML = "";
      let tasks = this._taskModel.getTasks();

      // Applying filters
      if (this._filterLanguage !== "all") {
        tasks = tasks.filter((task) => task.language === this._filterLanguage);
      }
      if (this._filterTaskType !== "all") {
        tasks = tasks.filter((task) => task.taskType === this._filterTaskType);
      }

      tasks.forEach((task) => {
        const taskData = this._formatTaskForSchedule(task);
        const scheduleItem = new ScheduleItem(taskData);
        render(scheduleItem, scheduleGrid, RenderPosition.BEFOREEND);
      });
    }
  }

  _formatTaskForSchedule(task) {
    const taskTypeConfig =
      TASK_ICON_MAP[task.taskType] || TASK_ICON_MAP.reading;
    const languageName = LANGUAGE_NAMES[task.language] || task.language;

    return {
      id: task.id,
      title: `${
        task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)
      } - ${task.title}`,
      time: task.time,
      icon: taskTypeConfig.icon,
      color: taskTypeConfig.color,
      language: languageName,
      taskType: task.taskType,
      completed: task.completed,
    };
  }

  _attachPlanningEventListeners() {
    // Task form toggles
    const addTaskBtn = this._container.querySelector(".add-task-btn");
    const taskForm = this._container.querySelector(".task-form");
    const cancelBtn = this._container.querySelector(".cancel-btn");

    if (addTaskBtn && taskForm) {
      addTaskBtn.addEventListener("click", () => {
        taskForm.style.display =
          taskForm.style.display === "none" ? "block" : "none";
        addTaskBtn.style.display =
          taskForm.style.display === "block" ? "none" : "block";
      });
    }

    if (cancelBtn && taskForm && addTaskBtn) {
      cancelBtn.addEventListener("click", () => {
        taskForm.style.display = "none";
        addTaskBtn.style.display = "block";
        taskForm.reset();
        this._editingTaskId = null;
      });
    }

    // Submitting the task form. Keep the arrow function as is? TEST FUNCTIONALITY
    if (taskForm) {
      taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this._handleTaskSubmit(e.target);
      });
    }

    // Filter change handlers
    const filterLanguage = this._container.querySelector("#filter-language");
    const filterTaskType = this._container.querySelector("#filter-task-type");

    if (filterLanguage) {
      filterLanguage.addEventListener("change", (e) => {
        this._filterLanguage = e.target.value;
        this._renderScheduleItems();
      });
    }

    if (filterTaskType) {
      filterTaskType.addEventListener("change", (e) => {
        this._filterTaskType = e.target.value;
        this._renderScheduleItems();
      });
    }

    // Edit, delete, and complete buttons for each task
    this._container.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit-task-btn")) {
        const taskId = parseInt(e.target.dataset.taskId);
        this._handleEditTask(taskId);
      } else if (e.target.classList.contains("delete-task-btn")) {
        const taskId = parseInt(e.target.dataset.taskId);
        this._handleDeleteTask(taskId);
      } else if (e.target.classList.contains("complete-task-btn")) {
        const taskId = parseInt(e.target.dataset.taskId);
        this._handleCompleteTask(taskId);
      } else if (e.target.classList.contains("complete-word-btn")) {
        const wordId = parseInt(e.target.dataset.wordId);
        this._handleCompleteWord(wordId);
      } else if (e.target.classList.contains("complete-test-card-btn")) {
        const cardId = parseInt(e.target.dataset.testCardId);
        this._handleCompleteTestCard(cardId);
      }
    });
  }

  _handleTaskSubmit(form) {
    const formData = new FormData(form);
    const taskData = {
      taskType: formData.get("taskType"),
      title: formData.get("title"),
      time: formData.get("time"),
      language: formData.get("language"),
    };

    if (this._editingTaskId) {
      // Updating the existing task
      const oldTask = this._taskModel.getTaskById(this._editingTaskId);
      this._taskModel.updateTask(this._editingTaskId, taskData);

      // Updating course lessons if language changed
      if (oldTask.language !== taskData.language) {
        this._courseModel.updateCourseLessons(oldTask.language, -1);
        this._courseModel.updateCourseLessons(taskData.language, 1);
        // Recalculate progress for both languages
        this._courseModel.updateCourseProgress(
          oldTask.language,
          this._taskModel
        );
        this._courseModel.updateCourseProgress(
          taskData.language,
          this._taskModel
        );
      } else {
        // Recalculate progress for the same language
        this._courseModel.updateCourseProgress(
          taskData.language,
          this._taskModel
        );
      }
    } else {
      // Addin a new task
      this._taskModel.addTask(taskData);
      this._courseModel.updateCourseLessons(taskData.language, 1);
      // Recalculating progress
      this._courseModel.updateCourseProgress(
        taskData.language,
        this._taskModel
      );
    }

    // Refreshing the whole UI
    this._renderScheduleItems();
    this._renderCourseGrid();

    // Notify stats section to refresh too
    if (window.app && window.app._statsSectionPresenter) {
      window.app._statsSectionPresenter.refresh();
    }

    // Resetting the form
    form.style.display = "none";
    const addTaskBtn = this._container.querySelector(".add-task-btn");
    if (addTaskBtn) {
      addTaskBtn.style.display = "block";
    }
    form.reset();
    this._editingTaskId = null;

    // Updating form button text back to "Add Task"
    const submitBtn = form.querySelector(".submit-btn");
    if (submitBtn) {
      submitBtn.textContent = "Add Task";
    }
  }

  _handleEditTask(taskId) {
    const task = this._taskModel.getTaskById(taskId);
    if (!task) return;

    const taskForm = this._container.querySelector(".task-form");
    const addTaskBtn = this._container.querySelector(".add-task-btn");

    if (taskForm) {
      taskForm.querySelector("#task-type").value = task.taskType;
      taskForm.querySelector("#task-title").value = task.title;
      taskForm.querySelector("#task-time").value = task.time;
      taskForm.querySelector("#task-language").value = task.language;

      // Update the submit button's text
      const submitBtn = taskForm.querySelector(".submit-btn");
      if (submitBtn) {
        submitBtn.textContent = "Update Task";
      }

      taskForm.style.display = "block";
      if (addTaskBtn) {
        addTaskBtn.style.display = "none";
      }

      this._editingTaskId = taskId;
    }
  }

  _handleDeleteTask(taskId) {
    const task = this._taskModel.getTaskById(taskId);
    if (!task) return;

    if (confirm(`Are you sure you want to delete this task?`)) {
      this._taskModel.deleteTask(taskId);
      this._courseModel.updateCourseLessons(task.language, -1);
      this._courseModel.updateCourseProgress(task.language, this._taskModel);

      // Refreshing the UI
      this._renderScheduleItems();
      this._renderCourseGrid();

      // Notify the stats section to refresh
      if (window.app && window.app._statsSectionPresenter) {
        window.app._statsSectionPresenter.refresh();
      }
    }
  }

  _renderDictionarySection() {
    const dictionarySectionContainer = this._container.querySelector(
      ".dictionary-section"
    );
    if (dictionarySectionContainer) {
      const dictionarySection = new DictionarySection();
      const dictionarySectionElement = dictionarySection.getElement();
      dictionarySectionContainer.replaceWith(dictionarySectionElement);

      // Render all dictionary items
      const dictionaryList = this._container.querySelector(".dictionary-list");
      if (dictionaryList) {
        dictionaryList.innerHTML = "";
        const words = this._dictionaryModel.getWords();
        words.forEach((word) => {
          const dictionaryItem = new DictionaryItem(word);
          render(dictionaryItem, dictionaryList, RenderPosition.BEFOREEND);
        });
      }
    }
  }

  _renderTestCardsSection() {
    const testCardsSectionContainer = this._container.querySelector(
      ".test-cards-section"
    );
    if (testCardsSectionContainer) {
      const testCardsSection = new TestCardsSection();
      const testCardsSectionElement = testCardsSection.getElement();
      testCardsSectionContainer.replaceWith(testCardsSectionElement);

      // Render test cards
      const testCardsGrid = this._container.querySelector(".test-cards-grid");
      if (testCardsGrid) {
        testCardsGrid.innerHTML = "";
        const testCards = this._testCardModel.getTestCards();
        testCards.forEach((card) => {
          const testCard = new TestCard(card);
          render(testCard, testCardsGrid, RenderPosition.BEFOREEND);
        });
      }
    }
  }

  _showLoading() {
    const loading = new Loading();
    const body = document.body;
    render(loading, body, RenderPosition.BEFOREEND);
  }

  _hideLoading() {
    const loadingOverlay = document.querySelector(".loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.remove();
    }
  }

  async _handleCompleteTask(taskId) {
    this._showLoading();

    // Simulat async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    const task = this._taskModel.getTaskById(taskId);
    if (!task) {
      this._hideLoading();
      return;
    }

    this._taskModel.toggleTaskCompletion(taskId);
    this._courseModel.updateCourseProgress(task.language, this._taskModel);

    // Refreshing the UI
    this._renderScheduleItems();
    this._renderCourseGrid();

    // Notify stats section to refresh
    if (window.app && window.app._statsSectionPresenter) {
      window.app._statsSectionPresenter.refresh();
    }

    this._hideLoading();
  }

  async _handleCompleteWord(wordId) {
    this._showLoading();

    // Simulating async operation with mock data -- Complete word
    await new Promise((resolve) => setTimeout(resolve, 300));

    this._dictionaryModel.toggleWordCompletion(wordId);

    // Refreshing the dictionary section
    this._renderDictionarySection();

    this._hideLoading();
  }

  async _handleCompleteTestCard(cardId) {
    this._showLoading();

    // Simulating async operation with mock data --Complete test card
    await new Promise((resolve) => setTimeout(resolve, 300));

    this._testCardModel.toggleTestCardCompletion(cardId);

    // Refreshing test cards section
    this._renderTestCardsSection();

    this._hideLoading();
  }
}
