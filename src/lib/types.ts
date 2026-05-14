export type PhaseStatus = 'active' | 'pending' | 'completed'

export type Phase = {
  id: string
  title: string
  percent: number
  status: PhaseStatus
  startDate?: string   // ISO "YYYY-MM-DD"
  endDate?: string     // ISO "YYYY-MM-DD"
}

export type Task = {
  id: string
  task: string
  owner: string
  due: string
}

export type OutlookWeek = {
  startDate: string
  endDate: string
  items: string[]
}

export type MilestoneState = 'done' | 'in-progress' | ''

export type Milestone = {
  id: string
  text: string
  state: MilestoneState
}

export type StreamStatus = 'ahead' | 'on-track' | 'behind' | 'pending'

export type WorkStream = {
  id: string
  streamLabel: string
  name: string
  percent: number
  status: StreamStatus
  milestones: Milestone[]
}

export type RiskLevel = 'high' | 'med' | 'low'

export type Blocker = {
  id: string
  level: RiskLevel
  text: string
}

export type Report = {
  id: string
  createdAt: string       // ISO "YYYY-MM-DD" — sort order only
  meta: { site: string; date: string }
  title: {
    eyebrow: string
    main: string
    accent: string
    sub: string
    deck: string
  }
  hero: {
    onboardingPercent: string
    pilotStart: string
    pilotFinish: string
    showFinish?: boolean
    projectedSavingPercent?: string
    showProjectedSaving?: boolean
  }
  phases: Phase[]
  tasks: Task[]
  outlook: {
    previous: OutlookWeek
    next: OutlookWeek
  }
  workStreams: WorkStream[]
  blockers: Blocker[]
}

export type Customer = {
  id: string
  name: string
  reports: Report[]
  activeReportId: string
}
