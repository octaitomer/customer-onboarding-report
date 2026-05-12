import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type {
  Customer, Report, PhaseStatus,
  StreamStatus, MilestoneState, RiskLevel,
} from '../lib/types'
import { createDefaultCustomer, cloneReport, SAMPLE_CUSTOMER } from '../lib/defaults'

type Store = {
  customers: Record<string, Customer>
  customerOrder: string[]
  activeCustomerId: string

  // Customer management
  addCustomer: (name?: string, site?: string) => void
  removeCustomer: (id: string) => void
  setActive: (id: string) => void
  renameCustomer: (id: string, name: string) => void
  reorderCustomers: (ids: string[]) => void

  // Report management
  addReport: (customerId: string) => void
  removeReport: (customerId: string, reportId: string) => void
  setActiveReport: (customerId: string, reportId: string) => void
  patchReportDate: (customerId: string, reportId: string, date: string) => void

  // Report content
  patchMeta: (customerId: string, reportId: string, patch: Partial<Report['meta']>) => void
  patchTitle: (customerId: string, reportId: string, patch: Partial<Report['title']>) => void
  patchHero: (customerId: string, reportId: string, patch: Partial<Report['hero']>) => void

  // Phases
  patchPhase: (customerId: string, reportId: string, phaseId: string, patch: { title?: string; percent?: number }) => void
  cyclePhaseStatus: (customerId: string, reportId: string, phaseId: string) => void

  // Tasks
  addTask: (customerId: string, reportId: string) => void
  removeTask: (customerId: string, reportId: string, taskId: string) => void
  patchTask: (customerId: string, reportId: string, taskId: string, patch: Partial<Omit<Report['tasks'][0], 'id'>>) => void

  // Outlook
  patchOutlookDates: (customerId: string, reportId: string, week: 'previous' | 'next', patch: { startDate?: string; endDate?: string }) => void
  addOutlookItem: (customerId: string, reportId: string, week: 'previous' | 'next') => void
  removeOutlookItem: (customerId: string, reportId: string, week: 'previous' | 'next', idx: number) => void
  patchOutlookItem: (customerId: string, reportId: string, week: 'previous' | 'next', idx: number, text: string) => void

  // Work streams
  patchStream: (customerId: string, reportId: string, streamId: string, patch: { name?: string; percent?: number }) => void
  cycleStreamStatus: (customerId: string, reportId: string, streamId: string) => void
  addMilestone: (customerId: string, reportId: string, streamId: string) => void
  removeMilestone: (customerId: string, reportId: string, streamId: string, msId: string) => void
  patchMilestone: (customerId: string, reportId: string, streamId: string, msId: string, text: string) => void
  cycleMilestoneState: (customerId: string, reportId: string, streamId: string, msId: string) => void

  // Blockers
  addBlocker: (customerId: string, reportId: string) => void
  removeBlocker: (customerId: string, reportId: string, blockerId: string) => void
  patchBlocker: (customerId: string, reportId: string, blockerId: string, text: string) => void
  cycleBlockerLevel: (customerId: string, reportId: string, blockerId: string) => void
}

const PHASE_CYCLE: PhaseStatus[] = ['pending', 'active', 'completed']
const STREAM_CYCLE: StreamStatus[] = ['ahead', 'on-track', 'behind', 'pending']
const MS_CYCLE: MilestoneState[] = ['', 'done', 'in-progress']
const RISK_CYCLE: RiskLevel[] = ['high', 'med', 'low']

function nextIn<T>(cycle: T[], val: T): T {
  const idx = cycle.indexOf(val)
  return cycle[(idx + 1) % cycle.length]
}

function updateCustomer(
  state: Pick<Store, 'customers'>,
  id: string,
  updater: (c: Customer) => Customer,
): Partial<Store> {
  const c = state.customers[id]
  if (!c) return {}
  return { customers: { ...state.customers, [id]: updater(c) } }
}

function updateReport(
  state: Pick<Store, 'customers'>,
  customerId: string,
  reportId: string,
  updater: (r: Report) => Report,
): Partial<Store> {
  return updateCustomer(state, customerId, (c) => ({
    ...c,
    reports: c.reports.map((r) => (r.id === reportId ? updater(r) : r)),
  }))
}

export const useTrackerStore = create<Store>()(
  persist(
    (set, get) => ({
      customers: { [SAMPLE_CUSTOMER.id]: SAMPLE_CUSTOMER },
      customerOrder: [SAMPLE_CUSTOMER.id],
      activeCustomerId: SAMPLE_CUSTOMER.id,

      addCustomer: (name = 'New Customer', site = 'ACX01') => {
        const c = createDefaultCustomer(name, site)
        set((s) => ({
          customers: { ...s.customers, [c.id]: c },
          customerOrder: [...s.customerOrder, c.id],
          activeCustomerId: c.id,
        }))
      },

      removeCustomer: (id) => {
        set((s) => {
          const order = s.customerOrder.filter((x) => x !== id)
          const customers = { ...s.customers }
          delete customers[id]
          const activeCustomerId =
            s.activeCustomerId === id ? (order[0] ?? '') : s.activeCustomerId
          return { customers, customerOrder: order, activeCustomerId }
        })
      },

      setActive: (id) => set({ activeCustomerId: id }),

      renameCustomer: (id, name) =>
        set((s) => updateCustomer(s, id, (c) => ({ ...c, name }))),

      reorderCustomers: (ids) => set({ customerOrder: ids }),

      addReport: (customerId) => {
        const c = get().customers[customerId]
        if (!c) return
        const sorted = [...c.reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        const latest = sorted[0]
        const report = cloneReport(latest)
        set((s) =>
          updateCustomer(s, customerId, (cu) => ({
            ...cu,
            reports: [...cu.reports, report],
            activeReportId: report.id,
          })),
        )
      },

      removeReport: (customerId, reportId) => {
        set((s) => {
          const c = s.customers[customerId]
          if (!c || c.reports.length <= 1) return {}
          const reports = c.reports.filter((r) => r.id !== reportId)
          const sorted = [...reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          const activeReportId =
            c.activeReportId === reportId ? sorted[0].id : c.activeReportId
          return {
            customers: {
              ...s.customers,
              [customerId]: { ...c, reports, activeReportId },
            },
          }
        })
      },

      setActiveReport: (customerId, reportId) =>
        set((s) =>
          updateCustomer(s, customerId, (c) => ({ ...c, activeReportId: reportId })),
        ),

      patchReportDate: (customerId, reportId, date) =>
        set((s) => updateReport(s, customerId, reportId, (r) => ({ ...r, meta: { ...r.meta, date } }))),

      patchMeta: (customerId, reportId, patch) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({ ...r, meta: { ...r.meta, ...patch } })),
        ),

      patchTitle: (customerId, reportId, patch) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({ ...r, title: { ...r.title, ...patch } })),
        ),

      patchHero: (customerId, reportId, patch) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({ ...r, hero: { ...r.hero, ...patch } })),
        ),

      patchPhase: (customerId, reportId, phaseId, patch) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            phases: r.phases.map((p) => (p.id === phaseId ? { ...p, ...patch } : p)),
          })),
        ),

      cyclePhaseStatus: (customerId, reportId, phaseId) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            phases: r.phases.map((p) =>
              p.id === phaseId ? { ...p, status: nextIn(PHASE_CYCLE, p.status) } : p,
            ),
          })),
        ),

      addTask: (customerId, reportId) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            tasks: [...r.tasks, { id: uuidv4(), task: '', owner: '', due: '' }],
          })),
        ),

      removeTask: (customerId, reportId, taskId) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            tasks: r.tasks.filter((t) => t.id !== taskId),
          })),
        ),

      patchTask: (customerId, reportId, taskId, patch) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            tasks: r.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
          })),
        ),

      patchOutlookDates: (customerId, reportId, week, patch) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            outlook: { ...r.outlook, [week]: { ...r.outlook[week], ...patch } },
          })),
        ),

      addOutlookItem: (customerId, reportId, week) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            outlook: {
              ...r.outlook,
              [week]: { ...r.outlook[week], items: [...r.outlook[week].items, ''] },
            },
          })),
        ),

      removeOutlookItem: (customerId, reportId, week, idx) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            outlook: {
              ...r.outlook,
              [week]: {
                ...r.outlook[week],
                items: r.outlook[week].items.filter((_, i) => i !== idx),
              },
            },
          })),
        ),

      patchOutlookItem: (customerId, reportId, week, idx, text) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            outlook: {
              ...r.outlook,
              [week]: {
                ...r.outlook[week],
                items: r.outlook[week].items.map((item, i) => (i === idx ? text : item)),
              },
            },
          })),
        ),

      patchStream: (customerId, reportId, streamId, patch) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            workStreams: r.workStreams.map((ws) =>
              ws.id === streamId ? { ...ws, ...patch } : ws,
            ),
          })),
        ),

      cycleStreamStatus: (customerId, reportId, streamId) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            workStreams: r.workStreams.map((ws) =>
              ws.id === streamId ? { ...ws, status: nextIn(STREAM_CYCLE, ws.status) } : ws,
            ),
          })),
        ),

      addMilestone: (customerId, reportId, streamId) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            workStreams: r.workStreams.map((ws) =>
              ws.id === streamId
                ? {
                    ...ws,
                    milestones: [
                      ...ws.milestones,
                      { id: uuidv4(), text: 'New milestone', state: '' as MilestoneState },
                    ],
                  }
                : ws,
            ),
          })),
        ),

      removeMilestone: (customerId, reportId, streamId, msId) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            workStreams: r.workStreams.map((ws) =>
              ws.id === streamId
                ? { ...ws, milestones: ws.milestones.filter((m) => m.id !== msId) }
                : ws,
            ),
          })),
        ),

      patchMilestone: (customerId, reportId, streamId, msId, text) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            workStreams: r.workStreams.map((ws) =>
              ws.id === streamId
                ? {
                    ...ws,
                    milestones: ws.milestones.map((m) =>
                      m.id === msId ? { ...m, text } : m,
                    ),
                  }
                : ws,
            ),
          })),
        ),

      cycleMilestoneState: (customerId, reportId, streamId, msId) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            workStreams: r.workStreams.map((ws) =>
              ws.id === streamId
                ? {
                    ...ws,
                    milestones: ws.milestones.map((m) =>
                      m.id === msId ? { ...m, state: nextIn(MS_CYCLE, m.state) } : m,
                    ),
                  }
                : ws,
            ),
          })),
        ),

      addBlocker: (customerId, reportId) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            blockers: [...r.blockers, { id: uuidv4(), level: 'low' as RiskLevel, text: '' }],
          })),
        ),

      removeBlocker: (customerId, reportId, blockerId) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            blockers: r.blockers.filter((b) => b.id !== blockerId),
          })),
        ),

      patchBlocker: (customerId, reportId, blockerId, text) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            blockers: r.blockers.map((b) => (b.id === blockerId ? { ...b, text } : b)),
          })),
        ),

      cycleBlockerLevel: (customerId, reportId, blockerId) =>
        set((s) =>
          updateReport(s, customerId, reportId, (r) => ({
            ...r,
            blockers: r.blockers.map((b) =>
              b.id === blockerId ? { ...b, level: nextIn(RISK_CYCLE, b.level) } : b,
            ),
          })),
        ),
    }),
    {
      name: 'converge-tracker-v2',
      partialize: (s) => ({
        customers: s.customers,
        customerOrder: s.customerOrder,
        activeCustomerId: s.activeCustomerId,
      }),
    },
  ),
)
