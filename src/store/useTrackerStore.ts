import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type {
  Customer, Phase, PhaseStatus, Task,
  WorkStream, StreamStatus, Milestone, MilestoneState,
  Blocker, RiskLevel,
} from '../lib/types'
import { createDefaultCustomer, SAMPLE_CUSTOMER } from '../lib/defaults'

type Store = {
  customers: Record<string, Customer>
  customerOrder: string[]
  activeCustomerId: string

  // Tab management
  addCustomer: (name?: string) => void
  removeCustomer: (id: string) => void
  duplicateCustomer: (id: string) => void
  setActive: (id: string) => void
  renameCustomer: (id: string, name: string) => void
  reorderCustomers: (ids: string[]) => void

  // Meta
  patchMeta: (id: string, patch: Partial<Customer['meta']>) => void
  patchTitle: (id: string, patch: Partial<Customer['title']>) => void
  patchHero: (id: string, patch: Partial<Customer['hero']>) => void

  // Phases
  patchPhase: (id: string, phaseId: string, patch: { title?: string; percent?: number }) => void
  cyclePhaseStatus: (id: string, phaseId: string) => void

  // Tasks
  addTask: (id: string) => void
  removeTask: (id: string, taskId: string) => void
  patchTask: (id: string, taskId: string, patch: Partial<Omit<Task, 'id'>>) => void

  // Outlook
  patchOutlookDates: (id: string, week: 'previous' | 'next', patch: { startDate?: string; endDate?: string }) => void
  addOutlookItem: (id: string, week: 'previous' | 'next') => void
  removeOutlookItem: (id: string, week: 'previous' | 'next', idx: number) => void
  patchOutlookItem: (id: string, week: 'previous' | 'next', idx: number, text: string) => void

  // Work streams
  patchStream: (id: string, streamId: string, patch: { name?: string; percent?: number }) => void
  cycleStreamStatus: (id: string, streamId: string) => void
  addMilestone: (id: string, streamId: string) => void
  removeMilestone: (id: string, streamId: string, msId: string) => void
  patchMilestone: (id: string, streamId: string, msId: string, text: string) => void
  cycleMilestoneState: (id: string, streamId: string, msId: string) => void

  // Blockers
  addBlocker: (id: string) => void
  removeBlocker: (id: string, blockerId: string) => void
  patchBlocker: (id: string, blockerId: string, text: string) => void
  cycleBlockerLevel: (id: string, blockerId: string) => void
}

const PHASE_CYCLE: PhaseStatus[] = ['pending', 'active', 'completed']
const STREAM_CYCLE: StreamStatus[] = ['ahead', 'on-track', 'behind', 'pending']
const MS_CYCLE: MilestoneState[] = ['', 'done', 'in-progress']
const RISK_CYCLE: RiskLevel[] = ['high', 'med', 'low']

function updateCustomer(
  state: Pick<Store, 'customers'>,
  id: string,
  updater: (c: Customer) => Customer,
): Partial<Store> {
  const c = state.customers[id]
  if (!c) return {}
  return { customers: { ...state.customers, [id]: updater(c) } }
}

function phaseCycle(status: PhaseStatus): PhaseStatus {
  const idx = PHASE_CYCLE.indexOf(status)
  return PHASE_CYCLE[(idx + 1) % PHASE_CYCLE.length]
}
function streamCycle(status: StreamStatus): StreamStatus {
  const idx = STREAM_CYCLE.indexOf(status)
  return STREAM_CYCLE[(idx + 1) % STREAM_CYCLE.length]
}
function msCycle(state: MilestoneState): MilestoneState {
  const idx = MS_CYCLE.indexOf(state)
  return MS_CYCLE[(idx + 1) % MS_CYCLE.length]
}
function riskCycle(level: RiskLevel): RiskLevel {
  const idx = RISK_CYCLE.indexOf(level)
  return RISK_CYCLE[(idx + 1) % RISK_CYCLE.length]
}

export const useTrackerStore = create<Store>()(
  persist(
    (set, get) => ({
      customers: { [SAMPLE_CUSTOMER.id]: SAMPLE_CUSTOMER },
      customerOrder: [SAMPLE_CUSTOMER.id],
      activeCustomerId: SAMPLE_CUSTOMER.id,

      addCustomer: (name = 'New Customer') => {
        const c = createDefaultCustomer(name)
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

      duplicateCustomer: (id) => {
        const src = get().customers[id]
        if (!src) return
        const c: Customer = JSON.parse(JSON.stringify(src))
        c.id = uuidv4()
        c.name = src.name + ' (copy)'
        set((s) => ({
          customers: { ...s.customers, [c.id]: c },
          customerOrder: [...s.customerOrder, c.id],
          activeCustomerId: c.id,
        }))
      },

      setActive: (id) => set({ activeCustomerId: id }),

      renameCustomer: (id, name) =>
        set((s) => updateCustomer(s, id, (c) => ({ ...c, name }))),

      reorderCustomers: (ids) => set({ customerOrder: ids }),

      patchMeta: (id, patch) =>
        set((s) => updateCustomer(s, id, (c) => ({ ...c, meta: { ...c.meta, ...patch } }))),

      patchTitle: (id, patch) =>
        set((s) => updateCustomer(s, id, (c) => ({ ...c, title: { ...c.title, ...patch } }))),

      patchHero: (id, patch) =>
        set((s) => updateCustomer(s, id, (c) => ({ ...c, hero: { ...c.hero, ...patch } }))),

      patchPhase: (id, phaseId, patch) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            phases: c.phases.map((p) => (p.id === phaseId ? { ...p, ...patch } : p)),
          })),
        ),

      cyclePhaseStatus: (id, phaseId) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            phases: c.phases.map((p) =>
              p.id === phaseId ? { ...p, status: phaseCycle(p.status) } : p,
            ),
          })),
        ),

      addTask: (id) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            tasks: [...c.tasks, { id: uuidv4(), task: '', owner: '', due: '' }],
          })),
        ),

      removeTask: (id, taskId) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            tasks: c.tasks.filter((t) => t.id !== taskId),
          })),
        ),

      patchTask: (id, taskId, patch) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
          })),
        ),

      patchOutlookDates: (id, week, patch) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            outlook: {
              ...c.outlook,
              [week]: { ...c.outlook[week], ...patch },
            },
          })),
        ),

      addOutlookItem: (id, week) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            outlook: {
              ...c.outlook,
              [week]: { ...c.outlook[week], items: [...c.outlook[week].items, ''] },
            },
          })),
        ),

      removeOutlookItem: (id, week, idx) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            outlook: {
              ...c.outlook,
              [week]: {
                ...c.outlook[week],
                items: c.outlook[week].items.filter((_, i) => i !== idx),
              },
            },
          })),
        ),

      patchOutlookItem: (id, week, idx, text) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            outlook: {
              ...c.outlook,
              [week]: {
                ...c.outlook[week],
                items: c.outlook[week].items.map((item, i) => (i === idx ? text : item)),
              },
            },
          })),
        ),

      patchStream: (id, streamId, patch) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            workStreams: c.workStreams.map((ws) =>
              ws.id === streamId ? { ...ws, ...patch } : ws,
            ),
          })),
        ),

      cycleStreamStatus: (id, streamId) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            workStreams: c.workStreams.map((ws) =>
              ws.id === streamId ? { ...ws, status: streamCycle(ws.status) } : ws,
            ),
          })),
        ),

      addMilestone: (id, streamId) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            workStreams: c.workStreams.map((ws) =>
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

      removeMilestone: (id, streamId, msId) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            workStreams: c.workStreams.map((ws) =>
              ws.id === streamId
                ? { ...ws, milestones: ws.milestones.filter((m) => m.id !== msId) }
                : ws,
            ),
          })),
        ),

      patchMilestone: (id, streamId, msId, text) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            workStreams: c.workStreams.map((ws) =>
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

      cycleMilestoneState: (id, streamId, msId) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            workStreams: c.workStreams.map((ws) =>
              ws.id === streamId
                ? {
                    ...ws,
                    milestones: ws.milestones.map((m) =>
                      m.id === msId ? { ...m, state: msCycle(m.state) } : m,
                    ),
                  }
                : ws,
            ),
          })),
        ),

      addBlocker: (id) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            blockers: [...c.blockers, { id: uuidv4(), level: 'low' as RiskLevel, text: '' }],
          })),
        ),

      removeBlocker: (id, blockerId) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            blockers: c.blockers.filter((b) => b.id !== blockerId),
          })),
        ),

      patchBlocker: (id, blockerId, text) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            blockers: c.blockers.map((b) => (b.id === blockerId ? { ...b, text } : b)),
          })),
        ),

      cycleBlockerLevel: (id, blockerId) =>
        set((s) =>
          updateCustomer(s, id, (c) => ({
            ...c,
            blockers: c.blockers.map((b) =>
              b.id === blockerId ? { ...b, level: riskCycle(b.level) } : b,
            ),
          })),
        ),
    }),
    {
      name: 'converge-tracker-v1',
      partialize: (s) => ({
        customers: s.customers,
        customerOrder: s.customerOrder,
        activeCustomerId: s.activeCustomerId,
      }),
    },
  ),
)
