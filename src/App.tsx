import Toolbar from './components/Toolbar'
import TabStrip from './components/TabStrip'
import Document from './components/Document'
import { useTrackerStore } from './store/useTrackerStore'

export default function App() {
  const store = useTrackerStore()
  const customers = Object.values(store.customers)
  const active = store.customers[store.activeCustomerId]

  if (!active) return null

  return (
    <div style={{ minHeight: '100vh', background: '#F3F1F1' }}>
      <Toolbar />
      <TabStrip
        customers={customers}
        customerOrder={store.customerOrder}
        activeId={store.activeCustomerId}
        onSelect={store.setActive}
        onAdd={() => store.addCustomer()}
        onRemove={store.removeCustomer}
        onDuplicate={store.duplicateCustomer}
        onRename={store.renameCustomer}
      />
      <main style={{ paddingTop: '8px', paddingBottom: '40px' }}>
        <Document customer={active} />
      </main>
    </div>
  )
}
