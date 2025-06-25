import { useState } from 'react'
import { Trash2, X, Loader2 } from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  type: 'curation' | 'tab'
  itemName?: string
  itemCount?: number // For curations, shows how many tabs will be deleted
  isLoading?: boolean
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  itemName,
  itemCount,
  isLoading = false
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    try {
      setIsDeleting(true)
      await onConfirm()
      // Auto-close modal after successful deletion
      onClose()
    } catch (error) {
      console.error('Delete failed:', error)
      // Keep modal open on error so user can retry
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  const isCuration = type === 'curation'
  const displayName = itemName || (isCuration ? 'this curation' : 'this tab')
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-fade-in">
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-stone-800">
              Delete {isCuration ? 'Curation' : 'Tab'}?
            </h2>
            <button 
              onClick={onClose}
              disabled={isDeleting}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            
            <h3 className="text-lg font-semibold text-stone-800 mb-4">
              Are you sure you want to delete "{displayName}"?
            </h3>
            
            <p className="text-stone-600 text-sm">
              {isCuration 
                ? `This curation and all its ${itemCount || 0} saved tab${(itemCount || 0) !== 1 ? 's' : ''} will be permanently removed from your account.`
                : 'This tab will be permanently removed from the curation.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-8 py-6 border-t border-stone-200 flex items-center justify-between rounded-b-3xl">
          <button 
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-3 text-stone-600 hover:text-stone-800 font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleConfirm}
            disabled={isDeleting}
            className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-500 flex items-center gap-3 ${
              isDeleting 
                ? 'bg-gradient-to-r from-red-400 to-red-500 text-white scale-105 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:scale-105 active:scale-95'
            } shadow-lg hover:shadow-xl disabled:opacity-75`}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for easy usage throughout the app
export function useDeleteConfirmation() {
  const [isOpen, setIsOpen] = useState(false)
  const [deleteConfig, setDeleteConfig] = useState<{
    type: 'curation' | 'tab'
    itemName?: string
    itemCount?: number
    onConfirm: () => Promise<void>
  } | null>(null)

  const openDeleteModal = (config: {
    type: 'curation' | 'tab'
    itemName?: string
    itemCount?: number
    onConfirm: () => Promise<void>
  }) => {
    setDeleteConfig(config)
    setIsOpen(true)
  }

  const closeDeleteModal = () => {
    setIsOpen(false)
    setDeleteConfig(null)
  }

  const DeleteModal = deleteConfig ? (
    <DeleteConfirmationModal
      isOpen={isOpen}
      onClose={closeDeleteModal}
      onConfirm={deleteConfig.onConfirm}
      type={deleteConfig.type}
      itemName={deleteConfig.itemName}
      itemCount={deleteConfig.itemCount}
    />
  ) : null

  return {
    openDeleteModal,
    closeDeleteModal,
    DeleteModal
  }
}