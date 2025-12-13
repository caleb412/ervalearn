const MOCKAPI_BASE = "https://68f9e86bef8b2e621e7df808.mockapi.io/api/v1";
const DICT_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en";

export class LearningAPIService {
  constructor({ mockapiBase = MOCKAPI_BASE, dictBase = DICT_BASE } = {}) {
    this.mockapiBase = mockapiBase;
    this.dictBase = dictBase;
  }
  async getVocabulary() {
    try {
      const res = await fetch(`${this.mockapiBase}/vocabulary`);
      if (!res.ok)
        throw new Error(`getVocabulary ${res.status}: ${await res.text()}`);
      return await res.json();
    } catch (err) {
      return [];
    }
  }

  async saveVocabulary(data) {
    try {
      const res = await fetch(`${this.mockapiBase}/vocabulary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok)
        throw new Error(`saveVocabulary ${res.status}: ${await res.text()}`);
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  async getProgress() {
    try {
      const res = await fetch(`${this.mockapiBase}/progress`);
      if (!res.ok)
        throw new Error(`getProgress ${res.status}: ${await res.text()}`);
      return await res.json();
    } catch (err) {
      return [];
    }
  }

  async updateProgress(data) {
    try {
      const res = await fetch(`${this.mockapiBase}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok)
        throw new Error(`updateProgress ${res.status}: ${await res.text()}`);
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  async lookupWord(word) {
    try {
      const res = await fetch(`${this.dictBase}/${encodeURIComponent(word)}`);
      if (!res.ok)
        throw new Error(`lookupWord ${res.status}: ${await res.text()}`);
      return await res.json();
    } catch (err) {
      return this.getFallbackDefinition(word);
    }
  }

  getFallbackDefinition(word) {
    return [
      {
        word,
        meanings: [
          {
            partOfSpeech: "noun",
            definitions: [
              {
                definition: "Definition unavailable (offline).",
                example: `Use '${word}' in a sentence to practice.`,
              },
            ],
          },
        ],
      },
    ];
  }

  // Tasks endpoints
  async getTasks() {
    try {
      const res = await fetch(`${this.mockapiBase}/tasks`);
      if (!res.ok)
        throw new Error(`getTasks ${res.status}: ${await res.text()}`);
      return await res.json();
    } catch (err) {
      return [];
    }
  }

  async createTask(data) {
    try {
      const payload = {
        ...data,
        createdAt:
          data.createdAt instanceof Date
            ? data.createdAt.toISOString()
            : data.createdAt,
      };
      const res = await fetch(`${this.mockapiBase}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(`createTask ${res.status}: ${await res.text()}`);
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  async updateTask(id, data) {
    try {
      const payload = {
        ...data,
        createdAt:
          data.createdAt instanceof Date
            ? data.createdAt.toISOString()
            : data.createdAt,
      };
      const res = await fetch(`${this.mockapiBase}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(`updateTask ${res.status}: ${await res.text()}`);
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  async deleteTask(id) {
    try {
      const res = await fetch(`${this.mockapiBase}/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok)
        throw new Error(`deleteTask ${res.status}: ${await res.text()}`);
      return true;
    } catch (err) {
      return false;
    }
  }

  // Test Cards endpoints
  async getTestCards() {
    try {
      const res = await fetch(`${this.mockapiBase}/test-cards`);
      if (!res.ok)
        throw new Error(`getTestCards ${res.status}: ${await res.text()}`);
      return await res.json();
    } catch (err) {
      return [];
    }
  }

  async createTestCard(data) {
    try {
      const res = await fetch(`${this.mockapiBase}/test-cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok)
        throw new Error(`createTestCard ${res.status}: ${await res.text()}`);
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  async updateTestCard(id, data) {
    try {
      const payload = {
        ...data,
        lastReviewed:
          data.lastReviewed instanceof Date
            ? data.lastReviewed.toISOString()
            : data.lastReviewed,
      };
      const res = await fetch(`${this.mockapiBase}/test-cards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok)
        throw new Error(`updateTestCard ${res.status}: ${await res.text()}`);
      return await res.json();
    } catch (err) {
      return null;
    }
  }
}
