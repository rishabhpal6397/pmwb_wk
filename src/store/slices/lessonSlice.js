

const createDefaultLesson = () => ({
  id: '',
  winIssue: '',
  description: '',
  impact: '',
  futureChange: '',
  actionItems: '',
});

export const createLessonSlice = (set, get) => ({
  lessons: [],

  addLesson: (lesson) => {
    const newLesson = {
      ...createDefaultLesson(),
      ...lesson,
      id: Date.now().toString(),
    };
    set((state) => ({
      lessons: [...state.lessons, newLesson],
    }));
  },

  updateLesson: (id, updates) => {
    set((state) => ({
      lessons: state.lessons.map((lesson) =>
        lesson.id === id ? { ...lesson, ...updates } : lesson
      ),
    }));
  },

  removeLesson: (id) => {
    set((state) => ({
      lessons: state.lessons.filter((lesson) => lesson.id !== id),
    }));
  },

  // Helper selectors
  getLessonsByType: (type) => {
    return get().lessons.filter((l) => l.winIssue === type);
  },
  getWinCount: () => {
    return get().lessons.filter((l) => l.winIssue === 'Win').length;
  },
  getIssueCount: () => {
    return get().lessons.filter((l) => l.winIssue === 'Issue').length;
  },
});