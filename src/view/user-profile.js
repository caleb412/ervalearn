import { AbstractComponent } from "../framework/view/abstract-component.js";

export class UserProfile extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <div class="user-profile">
        <div class="user-avatar">CC</div>
        <div class="user-info">
          <div class="user-name">Caleb Chanda</div>
          <div class="user-plan">Basic Plan</div>
        </div>
        <div class="dropdown-icon">
          <img src="assets/icons/dropdown-select.png" alt="dropdown icon" />
        </div>
      </div>
    `;
  }
}
