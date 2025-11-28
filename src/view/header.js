import { AbstractComponent } from "../framework/view/abstract-component.js";

export class Header extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `
      <div class="header">
        <div class="welcome">Hello Caleb, welcome back!</div>
        <div class="search-bar">
          <span class="search-icon">
            <img src="assets/icons/search.png" alt="search icon" />
          </span>
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      
    `;
  }
}
