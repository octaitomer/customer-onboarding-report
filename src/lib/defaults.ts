import { v4 as uuidv4 } from 'uuid'
import type { Customer, Report } from './types'

function today(): string {
  const d = new Date()
  return [
    String(d.getDate()).padStart(2, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getFullYear()),
  ].join(' ')
}

function isoToday(): string {
  return new Date().toISOString().split('T')[0]
}

export function createDefaultReport(name: string, site = 'ACX01'): Report {
  return {
    id: uuidv4(),
    createdAt: isoToday(),
    meta: { site, date: today() },
    title: {
      eyebrow: 'Pilot Progress Report',
      main: name,
      accent: 'Pilot',
      sub: 'Onboarding Tracker',
      deck:
        "Our shared mission to make the data center smarter and cheaper to run. This status report tracks where we are, what's next, and where we're counting on " +
        name +
        '.',
    },
    hero: {
      onboardingPercent: '',
      pilotStart: 'DD MM YYYY',
      pilotFinish: 'DD MM YYYY',
    },
    phases: [
      { id: uuidv4(), title: 'Phase 01 — Onboarding', percent: 0, status: 'active' },
      { id: uuidv4(), title: 'Phase 02 — Pilot Run', percent: 0, status: 'pending' },
    ],
    tasks: [
      { id: uuidv4(), task: '', owner: '', due: '' },
      { id: uuidv4(), task: '', owner: '', due: '' },
      { id: uuidv4(), task: '', owner: '', due: '' },
    ],
    outlook: {
      previous: { startDate: 'DD MM', endDate: 'DD MM', items: ['', ''] },
      next: { startDate: 'DD MM', endDate: 'DD MM', items: ['', ''] },
    },
    workStreams: [
      {
        id: uuidv4(),
        streamLabel: 'Stream 01',
        name: 'Building & Ops',
        percent: 0,
        status: 'pending',
        milestones: [
          { id: uuidv4(), text: 'BMS / DCIM / CPMS systems identified', state: '' },
          { id: uuidv4(), text: 'High-level walkthrough of system usage', state: '' },
          { id: uuidv4(), text: 'Schneider licence status confirmed', state: '' },
        ],
      },
      {
        id: uuidv4(),
        streamLabel: 'Stream 02',
        name: 'Data & Systems',
        percent: 0,
        status: 'pending',
        milestones: [
          { id: uuidv4(), text: 'Data sources mapped end-to-end', state: '' },
          { id: uuidv4(), text: 'Sample data extract received', state: '' },
          { id: uuidv4(), text: 'Schema & tag list validated', state: '' },
        ],
      },
      {
        id: uuidv4(),
        streamLabel: 'Stream 03',
        name: 'IT & Network',
        percent: 0,
        status: 'pending',
        milestones: [
          { id: uuidv4(), text: 'OctaiPipe overview presented to network team', state: '' },
          { id: uuidv4(), text: 'Infrastructure provisioning plan agreed', state: '' },
          { id: uuidv4(), text: 'VPN access & system permissions set up', state: '' },
        ],
      },
    ],
    blockers: [{ id: uuidv4(), level: 'high', text: '' }],
  }
}

export function cloneReport(src: Report): Report {
  return {
    id: uuidv4(),
    createdAt: isoToday(),
    meta: { ...src.meta, date: today() },
    title: { ...src.title },
    hero: { ...src.hero },
    phases: src.phases.map((p) => ({ ...p, id: uuidv4() })),
    tasks: src.tasks.map((t) => ({ ...t, id: uuidv4() })),
    outlook: {
      previous: { ...src.outlook.previous, items: [...src.outlook.previous.items] },
      next: { ...src.outlook.next, items: [...src.outlook.next.items] },
    },
    workStreams: src.workStreams.map((ws) => ({
      ...ws,
      id: uuidv4(),
      milestones: ws.milestones.map((m) => ({ ...m, id: uuidv4() })),
    })),
    blockers: src.blockers.map((b) => ({ ...b, id: uuidv4() })),
  }
}

export function createDefaultCustomer(name = 'New Customer', site = 'ACX01'): Customer {
  const report = createDefaultReport(name, site)
  return { id: uuidv4(), name, reports: [report], activeReportId: report.id }
}

const sampleReport: Report = {
  id: 'report-converge-01',
  createdAt: '2026-05-12',
  meta: { site: 'ACX01', date: today() },
  title: {
    eyebrow: 'Pilot Progress Report',
    main: 'Converge',
    accent: 'Pilot',
    sub: 'Onboarding Tracker',
    deck: "Our shared mission to make the data center smarter and cheaper to run. This status report tracks where we are, what's next, and where we're counting on Converge.",
  },
  hero: { onboardingPercent: '', pilotStart: 'DD MM YYYY', pilotFinish: 'DD MM YYYY' },
  phases: [
    { id: 'p1', title: 'Phase 01 — Onboarding', percent: 70, status: 'active' },
    { id: 'p2', title: 'Phase 02 — Pilot Run', percent: 0, status: 'pending' },
  ],
  tasks: [
    { id: 't1', task: '', owner: '', due: '' },
    { id: 't2', task: '', owner: '', due: '' },
    { id: 't3', task: '', owner: '', due: '' },
  ],
  outlook: {
    previous: {
      startDate: 'DD MM',
      endDate: 'DD MM',
      items: ['Mon — Building & Ops workshop', 'Wed — IT workshop', 'Fri — Internal sync'],
    },
    next: {
      startDate: 'DD MM',
      endDate: 'DD MM',
      items: [
        'Meeting with Operations Team - Mon 04/05',
        'Meeting with IT & Network Team  - Wed 06/05',
      ],
    },
  },
  workStreams: [
    {
      id: 'ws1',
      streamLabel: 'Stream 01',
      name: 'Building & Ops',
      percent: 50,
      status: 'ahead',
      milestones: [
        { id: 'm1', text: 'BMS / DCIM / CPMS systems identified (versions & models)', state: 'done' },
        { id: 'm2', text: 'High-level walkthrough of system usage', state: 'done' },
        { id: 'm3', text: 'Schneider licence status confirmed', state: 'in-progress' },
        { id: 'm4', text: 'Read/write access methods agreed (DCIM ↔ CBMS)', state: '' },
        { id: 'm5', text: 'Environmental metrics inventory (temp, humidity, sensors)', state: '' },
        { id: 'm6', text: 'SLA section of RFI completed', state: '' },
      ],
    },
    {
      id: 'ws2',
      streamLabel: 'Stream 02',
      name: 'Data & Systems',
      percent: 30,
      status: 'on-track',
      milestones: [
        { id: 'm7', text: 'Data sources mapped end-to-end', state: '' },
        { id: 'm8', text: 'Sample data extract received', state: '' },
        { id: 'm9', text: 'Schema & tag list validated', state: '' },
        { id: 'm10', text: 'Schneider integration scoped against customer setup', state: '' },
        { id: 'm11', text: 'Data refresh cadence agreed', state: '' },
      ],
    },
    {
      id: 'ws3',
      streamLabel: 'Stream 03',
      name: 'IT & Network',
      percent: 15,
      status: 'behind',
      milestones: [
        { id: 'm12', text: 'OctaiPipe overview presented to network team', state: '' },
        { id: 'm13', text: 'Requirements doc walked through', state: '' },
        { id: 'm14', text: 'Infrastructure provisioning plan agreed', state: '' },
        { id: 'm15', text: 'VM allocation confirmed', state: '' },
        { id: 'm16', text: 'VPN access & system permissions set up', state: '' },
        { id: 'm17', text: 'As-built network file for data centre received', state: '' },
        { id: 'm18', text: 'Ownership & responsibility assignments documented', state: '' },
      ],
    },
  ],
  blockers: [
    { id: 'b1', level: 'high', text: 'Schneider licence not yet confirmed — gates integration scoping' },
    { id: 'b2', level: 'med', text: 'Network team only just engaged — VPN setup at risk' },
    { id: 'b3', level: 'low', text: 'Low-impact item' },
  ],
}

export const SAMPLE_CUSTOMER: Customer = {
  id: 'converge-01',
  name: 'Converge',
  reports: [sampleReport],
  activeReportId: sampleReport.id,
}
