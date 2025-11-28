import { AbstractComponent } from "../framework/view/abstract-component.js";

export class ScheduleItem extends AbstractComponent {
  constructor(scheduleData) {
    super();
    this._scheduleData = scheduleData;
  }

  getTemplate() {
    const { id, title, time, icon, color, language, taskType, completed } = this._scheduleData;
    const completedClass = completed ? 'completed' : '';
    const completedIcon = completed ? '✓' : '○';
    
    return `
      <div class="schedule-item ${completedClass}" data-task-id="${id}">
        <div class="schedule-info">
          <div class="schedule-icon ${color}">
            <img src="${icon}" alt="schedule icon" />
          </div>
          <div class="schedule-details">
            <div class="schedule-title">${title}</div>
            <div class="schedule-time">${time}</div>
            ${language ? `<div class="schedule-language">${language}</div>` : ''}
          </div>
        </div>
        <div class="more-options">
          <button class="complete-task-btn" data-task-id="${id}" title="${completed ? 'Mark as incomplete' : 'Mark as complete'}">${completedIcon}</button>
          <button class="edit-task-btn" data-task-id="${id}" title="Edit">✎</button>
          <button class="delete-task-btn" data-task-id="${id}" title="Delete">×</button>
        </div>
      </div>
    `;
  }
}

