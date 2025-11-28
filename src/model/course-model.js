export class CourseModel {
  constructor(taskModel = null) {
    this._courses = [
      { name: "French", lessonsCount: 0, completedLessons: 0, color: "blue" },
      {
        name: "Portuguese",
        lessonsCount: 0,
        completedLessons: 0,
        color: "orange",
      },
      { name: "Italian", lessonsCount: 0, completedLessons: 0, color: "green" },
      { name: "German", lessonsCount: 0, completedLessons: 0, color: "yellow" },
    ];

    if (taskModel) {
      this._initializeFromTasks(taskModel);
    }
  }

  _initializeFromTasks(taskModel) {
    const tasks = taskModel.getTasks();
    const languageCounts = {};

    tasks.forEach((task) => {
      if (!languageCounts[task.language]) {
        languageCounts[task.language] = { total: 0, completed: 0 };
      }
      languageCounts[task.language].total++;
      if (task.completed) {
        languageCounts[task.language].completed++;
      }
    });

    Object.keys(languageCounts).forEach((language) => {
      const course = this.getCourseByName(language);
      if (course) {
        course.lessonsCount = languageCounts[language].total;
        course.completedLessons = languageCounts[language].completed;
      }
    });
  }

  getCourses() {
    return this._courses.map((course) => ({
      ...course,
      progress: this._calculateProgress(
        course.completedLessons,
        course.lessonsCount
      ),
    }));
  }

  getCourseByName(name) {
    return this._courses.find(
      (course) => course.name.toLowerCase() === name.toLowerCase()
    );
  }

  updateCourseLessons(language, increment = 1) {
    const course = this.getCourseByName(language);
    if (course) {
      course.lessonsCount += increment;
      return {
        ...course,
        progress: this._calculateProgress(
          course.completedLessons,
          course.lessonsCount
        ),
      };
    }
    return null;
  }

  updateCourseProgress(language, taskModel) {
    const course = this.getCourseByName(language);
    if (course && taskModel) {
      const languageTasks = taskModel.getTasksByLanguage(language);
      const completedTasks = languageTasks.filter((task) => task.completed);

      course.completedLessons = completedTasks.length;

      return {
        ...course,
        progress: this._calculateProgress(
          course.completedLessons,
          course.lessonsCount
        ),
      };
    }
    return null;
  }

  _calculateProgress(completed, total) {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }
}
