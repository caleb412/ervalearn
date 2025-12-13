import { AbstractComponent } from "../framework/view/abstract-component.js";

export class TaskForm extends AbstractComponent {
  constructor(isEditing = false) {
    super();
    this._isEditing = isEditing;
  }

  getTemplate() {
    const submitButtonText = this._isEditing ? "Update Task" : "Add Task";
    
    return `
      <div class="task-form-container">
        <button class="add-task-btn" type="button">+ Add Task</button>
        <form class="task-form" style="display: none;">
          <div class="form-group">
            <label for="task-type">Task Type</label>
            <select id="task-type" name="taskType" required>
              <option value="">Select type</option>
              <option value="reading">Reading</option>
              <option value="writing">Writing</option>
              <option value="listening">Listening</option>
              <option value="speaking">Speaking</option>
            </select>
          </div>
          <div class="form-group">
            <label for="task-title">Task Title</label>
            <input type="text" id="task-title" name="title" placeholder="e.g., Beginner Topic 1" required />
          </div>
          <div class="form-group">
            <label for="task-time">Time</label>
            <input type="text" id="task-time" name="time" placeholder="e.g., 8:00 AM - 10:00 AM" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-btn">${submitButtonText}</button>
            <button type="button" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    `;
  }
}

