# Delete Functionality Usage Examples

Example: How to use the delete functionality in your dashboard and detail pages

## 1. IN YOUR DASHBOARD PAGE (where you list curations)

```tsx

import { useState } from 'react'
import CurationCardWithDelete from '@/components/curations/CurationCardWithDelete'

export default function DashboardPage() {
  const [curations, setCurations] = useState([])
  
  // Handle successful deletion
  const handleCurationDeleted = (deletedId: string) => {
    setCurations(prev => prev.filter(c => c.id !== deletedId))
    // Optionally show a success toast
  }

  const refreshCurations = () => {
    // Refetch curations from API
    fetchCurations()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {curations.map((curation) => (
        <CurationCardWithDelete
          key={curation.id}
          curation={curation}
          onDelete={handleCurationDeleted}
          onUpdate={refreshCurations}
          isOwner={true} // You know user owns all curations on their dashboard
        />
      ))}
    </div>
  )
}
```

```

## 2. IN YOUR CURATION DETAIL PAGE (where you show tabs)

```tsx

import { useState } from 'react'
import TabCardWithDelete from '@/components/curations/TabCardWithDelete'

export default function CurationDetailPage({ curationId }: { curationId: string }) {
  const [tabs, setTabs] = useState([])
  const [curation, setCuration] = useState(null)
  
  // Handle successful tab deletion
  const handleTabDeleted = (deletedTabId: string) => {
    setTabs(prev => prev.filter(t => t.id !== deletedTabId))
    // Update curation tab count
    setCuration(prev => prev ? { ...prev, tab_count: prev.tab_count - 1 } : null)
  }

  const refreshTabs = () => {
    // Refetch tabs from API
    fetchTabs()
  }

  return (
    <div>
      {/* Curation header */}
      <div className="mb-8">
        <h1>{curation?.title}</h1>
        <p>{curation?.tab_count} tabs</p>
      </div>

      {/* Tabs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tabs.map((tab) => (
          <TabCardWithDelete
            key={tab.id}
            tab={tab}
            curationId={curationId}
            onDelete={handleTabDeleted}
            onUpdate={refreshTabs}
            isOwner={true} // You know user owns this curation
          />
        ))}
      </div>
    </div>
  )
}

```

## 3. ALTERNATIVE: SIMPLE HOOK USAGE FOR CUSTOM COMPONENTS

```tsx

import { useDeleteConfirmation } from '@/components/ui/DeleteConfirmationModal'

function MyCustomComponent() {
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation()

  const handleDeleteSomething = () => {
    openDeleteModal({
      type: 'curation', // or 'tab'
      itemName: 'My Cool Collection',
      itemCount: 5, // only for curations
      onConfirm: async () => {
        // Your delete logic here
        const response = await fetch('/api/curations/123', { method: 'DELETE' })
        if (!response.ok) throw new Error('Failed to delete')
        // Handle success
      }
    })
  }

  return (
    <div>
      <button onClick={handleDeleteSomething}>Delete This Thing</button>
      {DeleteModal}
    </div>
  )
}

## 4. CSS ANIMATION (already in your globals.css)

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
```
