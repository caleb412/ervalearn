import { LearningAPIService } from "../api.js";

export class TaskModel {
  constructor(apiService = null) {
    this._tasks = [];
    this._apiService = apiService || new LearningAPIService();
    this._isLoading = false;
    this._subscribers = [];
  }

  subscribe(callback) {
    this._subscribers.push(callback);
  }

  _notify() {
    this._subscribers.forEach((cb) => cb());
  }

  async initialize() {
    this._isLoading = true;
    this._notify();
    try {
      const tasks = await this._apiService.getTasks();
      if (tasks && tasks.length > 0) {
        this._tasks = tasks.map((task) => ({
          ...task,
          createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
        }));
      } else {
        // No tasks from server - show empty state
        this._tasks = [];
      }
    } catch (error) {
      // API error - show empty state
      this._tasks = [];
    } finally {
      this._isLoading = false;
      this._notify();
    }
  }

  isLoading() {
    return this._isLoading;
  }

  getTasks() {
    return this._tasks;
  }

  getTaskById(id) {
    if (!id) return null;
    // Normalize ID comparison - handle both string and number IDs
    const normalizedId = String(id);
    return this._tasks.find((task) => String(task.id) === normalizedId);
  }

  async addTask(taskData) {
    // Create temporary task for optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempTask = {
      id: tempId,
      taskType: taskData.taskType,
      title: taskData.title,
      time: taskData.time,
      completed: false,
      createdAt: new Date(),
    };
    this._tasks.push(tempTask);
    this._notify();

    try {
      const taskPayload = {
        taskType: taskData.taskType,
        title: taskData.title,
        time: taskData.time,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      const savedTask = await this._apiService.createTask(taskPayload);
      if (savedTask) {
        const task = {
          ...savedTask,
          createdAt: savedTask.createdAt
            ? new Date(savedTask.createdAt)
            : new Date(),
        };
        // Replace temp task with saved task
        const tempIndex = this._tasks.findIndex((t) => t.id === tempId);
        if (tempIndex !== -1) {
          this._tasks[tempIndex] = task;
        }
        this._notify();
        return task;
      } else {
        // Remove temp task if save failed
        const tempIndex = this._tasks.findIndex((t) => t.id === tempId);
        if (tempIndex !== -1) {
          this._tasks.splice(tempIndex, 1);
        }
        this._notify();
      }
    } catch (error) {
      // Remove temp task on error
      const tempIndex = this._tasks.findIndex((t) => t.id === tempId);
      if (tempIndex !== -1) {
        this._tasks.splice(tempIndex, 1);
      }
      this._notify();
    }
    return null;
  }

  async updateTask(id, taskData) {
    const normalizedId = String(id);
    const taskIndex = this._tasks.findIndex(
      (task) => String(task.id) === normalizedId
    );
    if (taskIndex === -1) {
      return null;
    }

    const existingTask = this._tasks[taskIndex];

    // Optimistic update - update local state immediately
    this._tasks[taskIndex] = {
      ...existingTask,
      ...taskData,
    };
    this._notify();

    // Sync with API in background
    try {
      const updatedPayload = {
        id: existingTask.id,
        taskType:
          taskData.taskType !== undefined
            ? taskData.taskType
            : existingTask.taskType,
        title:
          taskData.title !== undefined ? taskData.title : existingTask.title,
        time: taskData.time !== undefined ? taskData.time : existingTask.time,
        completed:
          taskData.completed !== undefined
            ? taskData.completed
            : existingTask.completed,
        createdAt:
          existingTask.createdAt instanceof Date
            ? existingTask.createdAt.toISOString()
            : existingTask.createdAt,
      };

      const savedTask = await this._apiService.updateTask(
        normalizedId,
        updatedPayload
      );
      if (savedTask) {
        // Update with server response to ensure consistency
        this._tasks[taskIndex] = {
          ...savedTask,
          createdAt: savedTask.createdAt
            ? new Date(savedTask.createdAt)
            : existingTask.createdAt,
        };
        this._notify();
      }
    } catch (error) {
      // Revert optimistic update on error
      this._tasks[taskIndex] = {
        ...existingTask,
      };
      this._notify();
      return null;
    }

    return this._tasks[taskIndex];
  }

  async deleteTask(id) {
    const normalizedId = String(id);
    const taskIndex = this._tasks.findIndex(
      (task) => String(task.id) === normalizedId
    );
    if (taskIndex === -1) {
      return null;
    }

    const deletedTask = this._tasks[taskIndex];

    // Optimistic update - remove from local state immediately
    this._tasks.splice(taskIndex, 1);
    this._notify();

    // Sync with API in background
    try {
      const success = await this._apiService.deleteTask(normalizedId);
      if (!success) {
        // Revert if deletion failed
        this._tasks.splice(taskIndex, 0, deletedTask);
        this._notify();
        return null;
      }
    } catch (error) {
      // Revert optimistic update on error
      this._tasks.splice(taskIndex, 0, deletedTask);
      this._notify();
      return null;
    }

    return deletedTask;
  }

  async toggleTaskCompletion(id) {
    const task = this.getTaskById(id);
    if (!task) {
      return null;
    }

    const normalizedId = String(id);
    const taskIndex = this._tasks.findIndex(
      (t) => String(t.id) === normalizedId
    );
    if (taskIndex === -1) {
      return null;
    }

    // Store original state for potential revert
    const originalTask = { ...task };

    // Optimistic update - update local state immediately
    const newCompletedState = !task.completed;
    this._tasks[taskIndex] = {
      ...task,
      completed: newCompletedState,
    };

    // Notify immediately for instant UI update
    this._notify();

    // Sync with API - await to ensure it completes before returning
    try {
      const updatedPayload = {
        id: task.id,
        taskType: task.taskType,
        title: task.title,
        time: task.time,
        completed: newCompletedState,
        createdAt:
          task.createdAt instanceof Date
            ? task.createdAt.toISOString()
            : task.createdAt,
      };

      const savedTask = await this._apiService.updateTask(
        normalizedId,
        updatedPayload
      );

      if (savedTask) {
        // Update with server response to ensure consistency
        this._tasks[taskIndex] = {
          ...savedTask,
          createdAt: savedTask.createdAt
            ? new Date(savedTask.createdAt)
            : task.createdAt,
        };
        this._notify();
        return this._tasks[taskIndex];
      } else {
        // API call failed - revert optimistic update to maintain integrity
        this._tasks[taskIndex] = originalTask;
        this._notify();
        return null;
      }
    } catch (error) {
      // API call failed - revert optimistic update to maintain integrity
      this._tasks[taskIndex] = originalTask;
      this._notify();
      return null;
    }
  }
}
