import { AbstractComponent } from "../framework/view/abstract-component.js";

export class TestCard extends AbstractComponent {
  constructor(testCardData) {
    super();
    this._testCardData = testCardData;
  }

  getTemplate() {
    const { id, title, question, answer, lastReviewed, completed } = this._testCardData;
    const completedClass = completed ? 'completed' : '';
    const completedIcon = completed ? '✓' : '○';
    const showAnswer = this._testCardData._showAnswer || false;
    
    return `
      <div class="test-card ${completedClass}" data-test-card-id="${id}">
        <div class="test-card-header">
          <div class="test-card-title">${title}</div>
        </div>
        <div class="test-card-content">
          <div class="test-question">${question}</div>
          ${showAnswer ? `
            <div class="test-answer">
              <strong>Answer:</strong> ${answer}
            </div>
          ` : `
            <button class="show-answer-btn" data-test-card-id="${id}">Show Answer</button>
          `}
        </div>
        <div class="test-card-footer">
          ${lastReviewed ? `<div class="test-date">Last reviewed: ${lastReviewed}</div>` : ''}
          <button class="complete-test-card-btn" data-test-card-id="${id}" title="${completed ? 'Mark as incomplete' : 'Mark as complete'}">${completedIcon}</button>
        </div>
      </div>
    `;
  }
}

