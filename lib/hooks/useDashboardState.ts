import { useState, useCallback } from 'react'

interface UseDashboardStateReturn {
  activeSection: string
  setActiveSection: (section: string) => void
  expandedSidebar: string | null
  setExpandedSidebar: (sidebar: string | null) => void
  showCreateModal: boolean
  openCreateModal: () => void
  closeCreateModal: () => void
  createLoading: boolean
  setCreateLoading: (loading: boolean) => void
}

export function useDashboardState(): UseDashboardStateReturn {
  const [activeSection, setActiveSection] = useState<string>('home')
  const [expandedSidebar, setExpandedSidebar] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [createLoading, setCreateLoading] = useState<boolean>(false)

  const openCreateModal = useCallback(() => {
    setShowCreateModal(true)
  }, [])

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false)
  }, [])

  const handleSectionChange = useCallback((itemId: string) => {
    setActiveSection(itemId)
    if (itemId === 'home') {
      setExpandedSidebar(null)
    } else {
      setExpandedSidebar(itemId)
    }
  }, [])

  return {
    activeSection,
    setActiveSection: handleSectionChange,
    expandedSidebar,
    setExpandedSidebar,
    showCreateModal,
    openCreateModal,
    closeCreateModal,
    createLoading,
    setCreateLoading
  }
}
