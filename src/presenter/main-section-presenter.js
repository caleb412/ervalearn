import { Header } from "../view/header.js";
import { CourseDashboard } from "../view/course-dashboard.js";
import { PlanningSection } from "../view/planning-section.js";
import { TaskForm } from "../view/task-form.js";
import { ScheduleItem } from "../view/schedule-item.js";
import { DictionarySection } from "../view/dictionary-section.js";
import { TestCardsSection } from "../view/test-cards-section.js";
import { TestCard } from "../view/test-card.js";
import { FilterBar } from "../view/filter-bar.js";
import { Loading } from "../view/loading.js";
import { render, RenderPosition } from "../framework/render.js";
import { TaskModel } from "../model/task-model.js";
import { CourseModel } from "../model/course-model.js";
import { TASK_ICON_MAP } from "../model/task-icon-map.js";
import { LearningAPIService } from "../api.js";

export class MainSectionPresenter {
  constructor(container, taskModel, courseModel, testCardModel) {
    this._container = container;
    this._taskModel = taskModel;
    this._courseModel = courseModel;
    this._testCardModel = testCardModel;
    this._editingTaskId = null;
    this._filterTaskType = "all";
    this._apiService = new LearningAPIService();
  }

  init() {
    this._renderHeader();
    this.renderHomeTab();
    // Pre-render Tests tab content
    this.renderTestsTab();

    // Debounce timers to prevent excessive re-renders
    this._taskRenderDebounceTimer = null;
    this._testCardRenderDebounceTimer = null;

    // Subscribe to model changes for auto-refresh
    this._taskModel.subscribe(() => {
      if (!this._taskModel.isLoading()) {
        // Debounce rapid updates (e.g., multiple tasks updated quickly)
        clearTimeout(this._taskRenderDebounceTimer);
        this._taskRenderDebounceTimer = setTimeout(() => {
          this._renderScheduleItems();
          this._renderCourseDashboard();
        }, 50); // Small delay to batch updates
      }
    });

    this._testCardModel.subscribe(() => {
      if (!this._testCardModel.isLoading()) {
        clearTimeout(this._testCardRenderDebounceTimer);
        this._testCardRenderDebounceTimer = setTimeout(() => {
          this._renderTestCardsSection();
        }, 50);
      }
    });
  }

  renderHomeTab() {
    this._renderCourseDashboard();
    this._renderPlanningSection();
  }

  renderTestsTab() {
    this._renderTestCardsSection();
  }

  renderDictionaryTab() {
    this._renderDictionarySection();
  }

  _renderHeader() {
    const headerContainer = this._container.querySelector(".header");
    if (headerContainer) {
      headerContainer.innerHTML = "";
      const header = new Header();
      render(header, headerContainer, RenderPosition.BEFOREEND);
    }
  }

  _renderCourseDashboard() {
    const courseDashContainer = this._container.querySelector(".course-dash");
    if (courseDashContainer) {
      courseDashContainer.innerHTML = "";
      const course = this._courseModel.getCourse();
      const courseDashboard = new CourseDashboard(course);
      render(courseDashboard, courseDashContainer, RenderPosition.BEFOREEND);
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

      // Rendering the filter bar
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
      if (this._filterTaskType !== "all") {
        tasks = tasks.filter((task) => task.taskType === this._filterTaskType);
      }

      if (tasks.length === 0) {
        scheduleGrid.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-message">No tasks yet. Add a task to get started!</div>
          </div>
        `;
        return;
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

    return {
      id: task.id,
      title: `${
        task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)
      } - ${task.title}`,
      time: task.time,
      icon: taskTypeConfig.icon,
      color: taskTypeConfig.color,
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
    const filterTaskType = this._container.querySelector("#filter-task-type");

    if (filterTaskType) {
      filterTaskType.addEventListener("change", (e) => {
        this._filterTaskType = e.target.value;
        this._renderScheduleItems();
      });
    }

    // Edit, delete, and complete buttons for each task
    // Use event delegation on the container to handle dynamically rendered items
    this._container.addEventListener("click", (e) => {
      // Find the closest button or element with data attributes
      const editBtn = e.target.closest(".edit-task-btn");
      const deleteBtn = e.target.closest(".delete-task-btn");
      const completeTaskBtn = e.target.closest(".complete-task-btn");
      const completeTestCardBtn = e.target.closest(".complete-test-card-btn");
      const showAnswerBtn = e.target.closest(".show-answer-btn");

      // Handle task buttons
      if (editBtn) {
        const taskId = editBtn.dataset.taskId;
        if (taskId) {
          e.preventDefault();
          e.stopPropagation();
          this._handleEditTask(taskId);
          return;
        }
      }

      if (deleteBtn) {
        const taskId = deleteBtn.dataset.taskId;
        if (taskId) {
          e.preventDefault();
          e.stopPropagation();
          this._handleDeleteTask(taskId);
          return;
        }
      }

      if (completeTaskBtn) {
        const taskId = completeTaskBtn.dataset.taskId;
        if (taskId) {
          e.preventDefault();
          e.stopPropagation();
          this._handleCompleteTask(taskId);
          return;
        }
      }

      // Handle test card buttons
      if (completeTestCardBtn) {
        // Try multiple ways to get the card ID. Functionality works well.
        const cardId =
          completeTestCardBtn.dataset.testCardId ||
          completeTestCardBtn.getAttribute("data-test-card-id") ||
          completeTestCardBtn.closest("[data-test-card-id]")?.dataset
            .testCardId;
        if (cardId) {
          e.preventDefault();
          e.stopPropagation();
          this._handleCompleteTestCard(cardId);
          return;
        }
      }

      if (showAnswerBtn) {
        const cardId = showAnswerBtn.dataset.testCardId;
        if (cardId) {
          e.preventDefault();
          e.stopPropagation();
          this._handleShowAnswer(cardId);
          return;
        }
      }
    });
  }

  async _handleTaskSubmit(form) {
    const formData = new FormData(form);
    const taskData = {
      taskType: formData.get("taskType"),
      title: formData.get("title"),
      time: formData.get("time"),
    };

    try {
      if (this._editingTaskId) {
        // Updating the existing task
        await this._taskModel.updateTask(this._editingTaskId, taskData);
        // Recalculate progress
        this._courseModel.updateCourseProgress(this._taskModel);
      } else {
        // Adding a new task
        await this._taskModel.addTask(taskData);
        // Recalculating progress
        this._courseModel.updateCourseProgress(this._taskModel);
      }

      // UI auto-update
      this._renderCourseDashboard();

      // Notify stats section to refresh as well
      if (window.app && window.app._statsSectionPresenter) {
        window.app._statsSectionPresenter.refresh();
      }
    } catch (error) {}

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
    // Normalize ID to string for consistent matching
    const normalizedId = String(taskId);
    const task = this._taskModel.getTaskById(normalizedId);
    if (!task) {
      return;
    }

    const taskForm = this._container.querySelector(".task-form");
    const addTaskBtn = this._container.querySelector(".add-task-btn");

    if (taskForm) {
      taskForm.querySelector("#task-type").value = task.taskType || "";
      taskForm.querySelector("#task-title").value = task.title || "";
      taskForm.querySelector("#task-time").value = task.time || "";

      // Update the submit button's text
      const submitBtn = taskForm.querySelector(".submit-btn");
      if (submitBtn) {
        submitBtn.textContent = "Update Task";
      }

      taskForm.style.display = "block";
      if (addTaskBtn) {
        addTaskBtn.style.display = "none";
      }

      this._editingTaskId = normalizedId;
    }
  }

  async _handleDeleteTask(taskId) {
    // Normalize ID to string for consistent matching
    const normalizedId = String(taskId);
    const task = this._taskModel.getTaskById(normalizedId);
    if (!task) {
      return;
    }

    if (confirm(`Are you sure you want to delete this task?`)) {
      try {
        await this._taskModel.deleteTask(normalizedId);
        this._courseModel.updateCourseProgress(this._taskModel);

        // UI auto-update
        this._renderCourseDashboard();

        //Notification for stats section to refresh
        if (window.app && window.app._statsSectionPresenter) {
          window.app._statsSectionPresenter.refresh();
        }
      } catch (error) {}
    }
  }

  _renderDictionarySection() {
    const dictionarySectionContainer = this._container.querySelector(
      ".dictionary-section"
    );
    if (dictionarySectionContainer) {
      dictionarySectionContainer.innerHTML = "";
      const dictionarySection = new DictionarySection();
      const dictionarySectionElement = dictionarySection.getElement();
      dictionarySectionContainer.appendChild(dictionarySectionElement);

      // Attach search functionality
      this._attachDictionarySearchListeners();
    }
  }

  _attachDictionarySearchListeners() {
    const searchInput = this._container.querySelector(
      ".dictionary-search-input"
    );
    const searchBtn = this._container.querySelector(".dictionary-search-btn");
    const resultsContainer = this._container.querySelector(
      ".dictionary-results"
    );

    const performSearch = async () => {
      const searchTerm = searchInput?.value.trim();
      if (!searchTerm || !resultsContainer) return;

      resultsContainer.innerHTML = `
        <div class="dictionary-loading">
          Searching for "${searchTerm}"...
        </div>
      `;

      try {
        const apiResult = await this._apiService.lookupWord(searchTerm);

        if (apiResult && apiResult.length > 0) {
          const wordData = apiResult[0];
          this._displayDictionaryResult(wordData, resultsContainer);
        } else {
          resultsContainer.innerHTML = `
            <div class="dictionary-no-result">
              Word not found. Please check the spelling and try again.
            </div>
          `;
        }
      } catch (error) {
        resultsContainer.innerHTML = `
          <div class="dictionary-no-result">
            Error searching for word. Please try again later.
          </div>
        `;
      }
    };

    if (searchBtn) {
      searchBtn.addEventListener("click", performSearch);
    }

    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          performSearch();
        }
      });
    }
  }

  _displayDictionaryResult(wordData, container) {
    const { word, phonetic, meanings, origin } = wordData;

    let meaningsHTML = "";
    if (meanings && meanings.length > 0) {
      meaningsHTML = meanings
        .map((meaning) => {
          const { partOfSpeech, definitions } = meaning;
          let definitionsHTML = "";

          if (definitions && definitions.length > 0) {
            definitionsHTML = definitions
              .slice(0, 3)
              .map((def) => {
                const example = def.example
                  ? `<div class="result-example"><em>${def.example}</em></div>`
                  : "";
                return `
                <div class="result-definition">
                  <div class="result-definition-text">${def.definition}</div>
                  ${example}
                </div>
              `;
              })
              .join("");
          }

          return `
          <div class="result-meaning-group">
            <div class="result-part-of-speech">${partOfSpeech}</div>
            ${definitionsHTML}
          </div>
        `;
        })
        .join("");
    }

    const phoneticHTML = phonetic
      ? `<div class="result-phonetic">${phonetic}</div>`
      : "";
    const originHTML = origin
      ? `<div class="result-origin"><strong>Origin:</strong> ${origin}</div>`
      : "";

    container.innerHTML = `
      <div class="dictionary-result">
        <div class="result-header">
          <div class="result-word">${word}</div>
          ${phoneticHTML}
        </div>
        ${meaningsHTML}
        ${originHTML}
      </div>
    `;
  }

  _renderTestCardsSection() {
    const testCardsSectionContainer = this._container.querySelector(
      ".test-cards-section"
    );
    if (testCardsSectionContainer) {
      testCardsSectionContainer.innerHTML = "";
      const testCardsSection = new TestCardsSection();
      const testCardsSectionElement = testCardsSection.getElement();
      testCardsSectionContainer.appendChild(testCardsSectionElement);

      // Render test cards
      const testCardsGrid = this._container.querySelector(".test-cards-grid");
      if (testCardsGrid) {
        testCardsGrid.innerHTML = "";
        const testCards = this._testCardModel.getTestCards();

        if (testCards.length === 0) {
          testCardsGrid.innerHTML = `
            <div class="empty-state">
              <div class="empty-state-message">No test cards yet. Test cards will appear here when added.</div>
            </div>
          `;
          return;
        }

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
    // Normalize ID to string for consistent matching
    const normalizedId = String(taskId);

    try {
      const task = this._taskModel.getTaskById(normalizedId);
      if (!task) {
        return;
      }

      //To handle optimistic update
      await this._taskModel.toggleTaskCompletion(normalizedId);
      this._courseModel.updateCourseProgress(this._taskModel);

      // UI auto re-rendering
      this._renderCourseDashboard();

      // Notify stats section to refresh
      if (window.app && window.app._statsSectionPresenter) {
        window.app._statsSectionPresenter.refresh();
      }
    } catch (error) {}
  }

  async _handleCompleteTestCard(cardId) {
    // Normalize ID to string
    const normalizedId = String(cardId);

    try {
      const card = this._testCardModel.getTestCardById(normalizedId);
      if (!card) {
        return;
      }

      const updatedCard = await this._testCardModel.toggleTestCardCompletion(
        normalizedId
      );
      if (updatedCard) {
        //Rerender the testcards section
        this._renderTestCardsSection();
      }
    } catch (error) {
      // Re-render on error to show correct state
      this._renderTestCardsSection();
    }
  }

  _handleShowAnswer(cardId) {
    // Normalize ID to string
    const normalizedId = String(cardId);
    const card = this._testCardModel.getTestCardById(normalizedId);
    if (card) {
      card._showAnswer = true;
      this._renderTestCardsSection();
    } else {
    }
  }
}
