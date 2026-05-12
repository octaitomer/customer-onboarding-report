import type { Customer } from '../lib/types'
import Header from './Header'
import TitleBlock from './TitleBlock'
import HeroBlock from './HeroBlock'
import PhaseGrid from './PhaseGrid'
import TasksTable from './TasksTable'
import OutlookGrid from './OutlookGrid'
import WorkStreams from './WorkStreams'
import BlockersPanel from './BlockersPanel'
import Footer from './Footer'
import { useTrackerStore } from '../store/useTrackerStore'

type Props = { customer: Customer }

const SECTION_TOTAL = 4

export default function Document({ customer }: Props) {
  const store = useTrackerStore()
  const id = customer.id

  return (
    <div>
      {/* ── Page 1 ─── */}
      <div className="page">
        <Header
          partnerName={customer.name}
          site={customer.meta.site}
          date={customer.meta.date}
          onPartnerName={(v) => store.renameCustomer(id, v)}
          onSite={(v) => store.patchMeta(id, { site: v })}
          onDate={(v) => store.patchMeta(id, { date: v })}
        />

        <TitleBlock
          eyebrow={customer.title.eyebrow}
          main={customer.title.main}
          accent={customer.title.accent}
          sub={customer.title.sub}
          deck={customer.title.deck}
          onEyebrow={(v) => store.patchTitle(id, { eyebrow: v })}
          onMain={(v) => store.patchTitle(id, { main: v })}
          onAccent={(v) => store.patchTitle(id, { accent: v })}
          onSub={(v) => store.patchTitle(id, { sub: v })}
          onDeck={(v) => store.patchTitle(id, { deck: v })}
        />

        <HeroBlock
          onboardingPercent={customer.hero.onboardingPercent}
          pilotStart={customer.hero.pilotStart}
          pilotFinish={customer.hero.pilotFinish}
          onPct={(v) => store.patchHero(id, { onboardingPercent: v })}
          onStart={(v) => store.patchHero(id, { pilotStart: v })}
          onFinish={(v) => store.patchHero(id, { pilotFinish: v })}
        />

        <PhaseGrid
          phases={customer.phases}
          sectionIndex={1}
          sectionTotal={SECTION_TOTAL}
          onCycleStatus={(phaseId) => store.cyclePhaseStatus(id, phaseId)}
          onTitle={(phaseId, v) => store.patchPhase(id, phaseId, { title: v })}
          onPercent={(phaseId, v) => store.patchPhase(id, phaseId, { percent: v })}
        />

        <TasksTable
          tasks={customer.tasks}
          sectionIndex={2}
          sectionTotal={SECTION_TOTAL}
          onAdd={() => store.addTask(id)}
          onRemove={(taskId) => store.removeTask(id, taskId)}
          onPatch={(taskId, field, value) => store.patchTask(id, taskId, { [field]: value })}
        />

        <OutlookGrid
          previous={customer.outlook.previous}
          next={customer.outlook.next}
          sectionIndex={3}
          sectionTotal={SECTION_TOTAL}
          onDates={(week, patch) => store.patchOutlookDates(id, week, patch)}
          onAddItem={(week) => store.addOutlookItem(id, week)}
          onRemoveItem={(week, idx) => store.removeOutlookItem(id, week, idx)}
          onPatchItem={(week, idx, text) => store.patchOutlookItem(id, week, idx, text)}
        />

        <Footer page={1} totalPages={2} partnerName={customer.name} />
      </div>

      {/* ── Page 2 ─── */}
      <div className="page">
        <Header
          partnerName={customer.name}
          site={customer.meta.site}
          date={customer.meta.date}
          onPartnerName={(v) => store.renameCustomer(id, v)}
          onSite={(v) => store.patchMeta(id, { site: v })}
          onDate={(v) => store.patchMeta(id, { date: v })}
        />

        <WorkStreams
          workStreams={customer.workStreams}
          sectionIndex={4}
          sectionTotal={SECTION_TOTAL}
          onCycleStatus={(streamId) => store.cycleStreamStatus(id, streamId)}
          onPatchStream={(streamId, patch) => store.patchStream(id, streamId, patch)}
          onAddMilestone={(streamId) => store.addMilestone(id, streamId)}
          onRemoveMilestone={(streamId, msId) => store.removeMilestone(id, streamId, msId)}
          onPatchMilestone={(streamId, msId, text) => store.patchMilestone(id, streamId, msId, text)}
          onCycleMilestone={(streamId, msId) => store.cycleMilestoneState(id, streamId, msId)}
        />

        <BlockersPanel
          blockers={customer.blockers}
          onAdd={() => store.addBlocker(id)}
          onRemove={(blockerId) => store.removeBlocker(id, blockerId)}
          onPatch={(blockerId, text) => store.patchBlocker(id, blockerId, text)}
          onCycleLevel={(blockerId) => store.cycleBlockerLevel(id, blockerId)}
        />

        <Footer page={2} totalPages={2} partnerName={customer.name} />
      </div>
    </div>
  )
}
