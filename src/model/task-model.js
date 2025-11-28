import { MOCK_TASKS } from "../mock/mock-tasks.js";

export class TaskModel {
  constructor() {
    this._tasks = MOCK_TASKS.map((task) => ({ ...task }));
    this._nextId = Math.max(...MOCK_TASKS.map((t) => t.id), 0) + 1;
  }

  getTasks() {
    return this._tasks;
  }

  getTaskById(id) {
    return this._tasks.find((task) => task.id === id);
  }

  getTasksByLanguage(language) {
    return this._tasks.filter((task) => task.language === language);
  }

  addTask(taskData) {
    const task = {
      id: this._nextId++,
      taskType: taskData.taskType,
      title: taskData.title,
      time: taskData.time,
      language: taskData.language,
      completed: false,
      createdAt: new Date(),
    };
    this._tasks.push(task);
    return task;
  }

  updateTask(id, taskData) {
    const taskIndex = this._tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      this._tasks[taskIndex] = {
        ...this._tasks[taskIndex],
        ...taskData,
      };
      return this._tasks[taskIndex];
    }
    return null;
  }

  deleteTask(id) {
    const taskIndex = this._tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      const deletedTask = this._tasks[taskIndex];
      this._tasks.splice(taskIndex, 1);
      return deletedTask;
    }
    return null;
  }

  toggleTaskCompletion(id) {
    const task = this.getTaskById(id);
    if (task) {
      task.completed = !task.completed;
      return task;
    }
    return null;
  }
}
