import { AbstractComponent } from "../framework/view/abstract-component.js";

export class TestCard extends AbstractComponent {
  constructor(testCardData) {
    super();
    this._testCardData = testCardData;
  }

  getTemplate() {
    const { id, title, progress, question, answer, lastReviewed, completed } = this._testCardData;
    const progressText = `${progress.completed}/${progress.total} completed`;
    const completedClass = completed ? 'completed' : '';
    const completedIcon = completed ? '✓' : '○';
    
    return `
      <div class="test-card ${completedClass}" data-test-card-id="${id}">
        <div class="test-card-header">
          <div class="test-card-title">${title}</div>
          <div class="test-card-progress">${progressText}</div>
        </div>
        <div class="test-card-content">
          <div class="test-question">${question}</div>
          <div class="test-answer">${answer}</div>
        </div>
        <div class="test-card-footer">
          <div class="test-date">Last reviewed: ${lastReviewed}</div>
          <button class="complete-test-card-btn" data-test-card-id="${id}" title="${completed ? 'Mark as incomplete' : 'Mark as complete'}">${completedIcon}</button>
        </div>
      </div>
    `;
  }
}

