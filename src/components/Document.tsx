import type { Report } from '../lib/types'
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

type Props = {
  customerId: string
  customerName: string
  report: Report
}

const SECTION_TOTAL = 4

export default function Document({ customerId, customerName, report }: Props) {
  const store = useTrackerStore()
  const cid = customerId
  const rid = report.id
  const phase2Id = report.phases[1]?.id
  const showFinish = report.hero.showFinish ?? true
  const showProjectedSaving = report.hero.showProjectedSaving ?? false
  const showBlockers = report.showBlockers ?? true

  function setStart(v: string) {
    store.patchHero(cid, rid, { pilotStart: v })
    if (phase2Id) store.patchPhase(cid, rid, phase2Id, { startDate: v })
  }

  function setFinish(v: string) {
    store.patchHero(cid, rid, { pilotFinish: v })
    if (phase2Id) store.patchPhase(cid, rid, phase2Id, { endDate: v })
  }

  return (
    <div>
      {/* ── Page 1 ─── */}
      <div className="page">
        <Header
          partnerName={customerName}
          site={report.meta.site}
          date={report.meta.date}
          onPartnerName={(v) => store.renameCustomer(cid, v)}
          onSite={(v) => store.patchMeta(cid, rid, { site: v })}
          onDate={(v) => store.patchMeta(cid, rid, { date: v })}
        />

        <TitleBlock
          eyebrow={report.title.eyebrow}
          main={report.title.main}
          accent={report.title.accent}
          sub={report.title.sub}
          deck={report.title.deck}
          onEyebrow={(v) => store.patchTitle(cid, rid, { eyebrow: v })}
          onMain={(v) => store.patchTitle(cid, rid, { main: v })}
          onAccent={(v) => store.patchTitle(cid, rid, { accent: v })}
          onSub={(v) => store.patchTitle(cid, rid, { sub: v })}
          onDeck={(v) => store.patchTitle(cid, rid, { deck: v })}
        />

        <HeroBlock
          onboardingPercent={report.hero.onboardingPercent}
          pilotStart={report.hero.pilotStart}
          pilotFinish={report.hero.pilotFinish}
          onPct={(v) => store.patchHero(cid, rid, { onboardingPercent: v })}
          onStart={setStart}
          onFinish={setFinish}
          showFinish={showFinish}
          onToggleFinish={() => store.toggleFinishDate(cid, rid)}
          projectedSavingPercent={report.hero.projectedSavingPercent ?? ''}
          showProjectedSaving={showProjectedSaving}
          onProjectedSaving={(v) => store.patchHero(cid, rid, { projectedSavingPercent: v })}
          onToggleProjectedSaving={() => store.toggleProjectedSaving(cid, rid)}
        />

        <PhaseGrid
          phases={report.phases}
          sectionIndex={1}
          sectionTotal={SECTION_TOTAL}
          onCycleStatus={(phaseId) => store.cyclePhaseStatus(cid, rid, phaseId)}
          onTitle={(phaseId, v) => store.patchPhase(cid, rid, phaseId, { title: v })}
          onPercent={(phaseId, v) => store.patchPhase(cid, rid, phaseId, { percent: v })}
          onStartDate={(phaseId, v) => {
            store.patchPhase(cid, rid, phaseId, { startDate: v })
            if (phaseId === phase2Id) store.patchHero(cid, rid, { pilotStart: v })
          }}
          onEndDate={(phaseId, v) => {
            store.patchPhase(cid, rid, phaseId, { endDate: v })
            if (phaseId === phase2Id) store.patchHero(cid, rid, { pilotFinish: v })
          }}
          hideEndDate={(phaseId) => !showFinish && phaseId === phase2Id}
        />

        <TasksTable
          tasks={report.tasks}
          sectionIndex={2}
          sectionTotal={SECTION_TOTAL}
          onAdd={() => store.addTask(cid, rid)}
          onRemove={(taskId) => store.removeTask(cid, rid, taskId)}
          onPatch={(taskId, field, value) => store.patchTask(cid, rid, taskId, { [field]: value })}
        />

        <OutlookGrid
          previous={report.outlook.previous}
          next={report.outlook.next}
          sectionIndex={3}
          sectionTotal={SECTION_TOTAL}
          onDates={(week, patch) => store.patchOutlookDates(cid, rid, week, patch)}
          onAddItem={(week) => store.addOutlookItem(cid, rid, week)}
          onRemoveItem={(week, idx) => store.removeOutlookItem(cid, rid, week, idx)}
          onPatchItem={(week, idx, text) => store.patchOutlookItem(cid, rid, week, idx, text)}
        />

        <Footer page={1} totalPages={2} partnerName={customerName} />
      </div>

      {/* ── Page 2 ─── */}
      <div className="page">
        <Header
          partnerName={customerName}
          site={report.meta.site}
          date={report.meta.date}
          onPartnerName={(v) => store.renameCustomer(cid, v)}
          onSite={(v) => store.patchMeta(cid, rid, { site: v })}
          onDate={(v) => store.patchMeta(cid, rid, { date: v })}
        />

        <WorkStreams
          workStreams={report.workStreams}
          sectionIndex={4}
          sectionTotal={SECTION_TOTAL}
          onCycleStatus={(streamId) => store.cycleStreamStatus(cid, rid, streamId)}
          onPatchStream={(streamId, patch) => store.patchStream(cid, rid, streamId, patch)}
          onAddMilestone={(streamId) => store.addMilestone(cid, rid, streamId)}
          onRemoveMilestone={(streamId, msId) => store.removeMilestone(cid, rid, streamId, msId)}
          onPatchMilestone={(streamId, msId, text) => store.patchMilestone(cid, rid, streamId, msId, text)}
          onCycleMilestone={(streamId, msId) => store.cycleMilestoneState(cid, rid, streamId, msId)}
        />

        {showBlockers ? (
          <BlockersPanel
            blockers={report.blockers}
            onAdd={() => store.addBlocker(cid, rid)}
            onRemove={(blockerId) => store.removeBlocker(cid, rid, blockerId)}
            onPatch={(blockerId, text) => store.patchBlocker(cid, rid, blockerId, text)}
            onCycleLevel={(blockerId) => store.cycleBlockerLevel(cid, rid, blockerId)}
            onToggle={() => store.toggleBlockers(cid, rid)}
          />
        ) : (
          <button
            type="button"
            className="no-print"
            onClick={() => store.toggleBlockers(cid, rid)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'transparent', border: '1px dashed #CCCBCA',
              color: '#6D6C6C', cursor: 'pointer', padding: '6px 12px',
              fontFamily: '"ABC Favorit Mono","JetBrains Mono",monospace',
              fontSize: '9.5px', letterSpacing: '0.14em', textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            <span>👁</span> Show blockers &amp; risks
          </button>
        )}

        <Footer page={2} totalPages={2} partnerName={customerName} />
      </div>
    </div>
  )
}
