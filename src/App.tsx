import { useState } from 'react'
import Toolbar from './components/Toolbar'
import Document from './components/Document'
import Dashboard from './components/Dashboard'
import { useTrackerStore } from './store/useTrackerStore'

export default function App() {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard')
  const store = useTrackerStore()
  const active = store.customers[store.activeCustomerId]

  function openCustomer(id: string) {
    store.setActive(id)
    setView('editor')
  }

  if (view === 'dashboard') {
    return <Dashboard onOpen={openCustomer} />
  }

  if (!active) {
    setView('dashboard')
    return null
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F3F1F1' }}>
      <Toolbar customerName={active.name} onBack={() => setView('dashboard')} />
      <main style={{ paddingTop: '68px', paddingBottom: '40px' }}>
        <Document customer={active} />
      </main>
    </div>
  )
}
