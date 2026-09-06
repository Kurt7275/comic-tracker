import api from './api'

const TIMELINE_PROGRESS_KEY = 'comicverse-timeline-progress'

export const timelineService = {
  getLocalProgress() {
    try {
      const raw = localStorage.getItem(TIMELINE_PROGRESS_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  },

  saveLocalProgress(progressMap) {
    localStorage.setItem(TIMELINE_PROGRESS_KEY, JSON.stringify(progressMap))
  },

  async fetchTimelineProgress() {
    try {
      const res = await api.get('/timelines/progress')
      return res.data
    } catch {
      return this.getLocalProgress()
    }
  },

  async toggleIssueProgress(issueId, isCompleted) {
    try {
      const res = await api.post(`/timelines/progress/${issueId}`, { completed: isCompleted })
      return res.data
    } catch {
      const progress = this.getLocalProgress()
      progress[issueId] = isCompleted
      this.saveLocalProgress(progress)
      return progress
    }
  }
}
