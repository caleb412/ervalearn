import { AbstractComponent } from "../framework/view/abstract-component.js";

export class FilterBar extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <div class="filter-bar">
        <div class="filter-group">
          <label for="filter-language">Filter by Language:</label>
          <select id="filter-language" class="filter-select">
            <option value="all">All Languages</option>
            <option value="french">French</option>
            <option value="portuguese">Portuguese</option>
            <option value="italian">Italian</option>
            <option value="german">German</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="filter-task-type">Filter by Type:</label>
          <select id="filter-task-type" class="filter-select">
            <option value="all">All Types</option>
            <option value="reading">Reading</option>
            <option value="writing">Writing</option>
            <option value="listening">Listening</option>
            <option value="speaking">Speaking</option>
          </select>
        </div>
      </div>
    `;
  }
}

