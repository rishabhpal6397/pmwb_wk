export const createUiSlice = (set, get) => ({
  activePage: 'dashboard',
  sidebarCollapsed: false,
  notifications: [],
  isExporting: false,
  setActivePage: (page) => set({ activePage: page }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  addNotification: (message, type = 'info') =>
    set((state) => ({
      notifications: [...state.notifications, { id: Date.now(), message, type }],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  setExporting: () => set({ isExporting: true }),
  resetExporting: () => set({ isExporting: false }),
});