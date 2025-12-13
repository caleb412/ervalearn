export class CourseModel {
  constructor(taskModel = null) {
    this._course = {
      name: "English",
      lessonsCount: 0,
      completedLessons: 0,
      color: "blue"
    };

    if (taskModel) {
      this._initializeFromTasks(taskModel);
    }
  }

  _initializeFromTasks(taskModel) {
    const tasks = taskModel.getTasks();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;

    this._course.lessonsCount = totalTasks;
    this._course.completedLessons = completedTasks;
  }

  getCourse() {
    return {
      ...this._course,
      progress: this._calculateProgress(
        this._course.completedLessons,
        this._course.lessonsCount
      ),
    };
  }

  updateCourseLessons(increment = 1) {
    this._course.lessonsCount += increment;
    return this.getCourse();
  }

  updateCourseProgress(taskModel) {
    if (taskModel) {
      const tasks = taskModel.getTasks();
      const completedTasks = tasks.filter((task) => task.completed);
      
      this._course.lessonsCount = tasks.length;
      this._course.completedLessons = completedTasks.length;
    }
    return this.getCourse();
  }

  _calculateProgress(completed, total) {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }
}
