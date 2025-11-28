import { AbstractComponent } from "../framework/view/abstract-component.js";

export class DictionaryItem extends AbstractComponent {
  constructor(wordData) {
    super();
    this._wordData = wordData;
  }

  getTemplate() {
    const { id, word, translation, category, completed } = this._wordData;
    const completedClass = completed ? 'completed' : '';
    const completedIcon = completed ? '✓' : '○';
    
    return `
      <div class="dictionary-item ${completedClass}" data-word-id="${id}">
        <div class="word-info">
          <div class="word">${word}</div>
          <div class="translation">${translation}</div>
          <div class="word-category">${category}</div>
        </div>
        <button class="complete-word-btn" data-word-id="${id}" title="${completed ? 'Mark as incomplete' : 'Mark as complete'}">${completedIcon}</button>
      </div>
    `;
  }
}

