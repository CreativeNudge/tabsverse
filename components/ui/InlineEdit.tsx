'use client'

import { useState, useEffect, useRef } from 'react'
import { Pencil } from 'lucide-react'

interface InlineEditProps {
  value: string
  onSave: (newValue: string) => Promise<void> | void
  type?: 'text' | 'textarea'
  placeholder?: string
  canEdit?: boolean
  className?: string
  editClassName?: string
  buttonClassName?: string
  maxLength?: number
  rows?: number
  emptyText?: string
  showEditButton?: boolean
  triggerOnClick?: boolean
  children?: React.ReactNode
}

export default function InlineEdit({
  value,
  onSave,
  type = 'text',
  placeholder = 'Enter text...',
  canEdit = true,
  className = '',
  editClassName = '',
  buttonClassName = '',
  maxLength,
  rows = 2,
  emptyText = 'Click to add...',
  showEditButton = true,
  triggerOnClick = true,
  children
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  // Sync value when prop changes
  useEffect(() => {
    setTempValue(value)
  }, [value])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (type === 'text') {
        inputRef.current.select()
      }
    }
  }, [isEditing, type])

  const handleStartEdit = () => {
    if (!canEdit) return
    setTempValue(value)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (tempValue.trim() === value.trim()) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    try {
      await onSave(tempValue.trim())
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving:', error)
      // Keep editing mode open on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter') {
      if (type === 'text' || (type === 'textarea' && e.ctrlKey)) {
        e.preventDefault()
        handleSave()
      }
    }
  }

  if (!canEdit) {
    // Read-only display
    return children || (
      <div className={className}>
        {value || <span className="text-gray-500 italic">{emptyText}</span>}
      </div>
    )
  }

  if (isEditing) {
    // Edit mode
    const baseEditClass = `bg-transparent border border-orange-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-300 outline-none transition-all ${
      isLoading ? 'opacity-50 cursor-wait' : ''
    }`

    return type === 'textarea' ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${baseEditClass} resize-none w-full ${editClassName}`}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        disabled={isLoading}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${baseEditClass} ${editClassName}`}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={isLoading}
      />
    )
  }

  // Display mode with edit trigger
  return (
    <div className="group/inline-edit relative">
      <div className="flex items-center gap-2">
        {/* Content area */}
        <div
          onClick={triggerOnClick ? handleStartEdit : undefined}
          className={`flex-1 ${triggerOnClick && canEdit ? 'cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 -my-1' : ''} ${className}`}
          title={triggerOnClick && canEdit ? 'Click to edit' : ''}
        >
          {children || (
            value ? (
              <span>{value}</span>
            ) : (
              <span className="text-gray-500 italic">{emptyText}</span>
            )
          )}
        </div>

        {/* Edit button */}
        {showEditButton && canEdit && (
          <button
            onClick={handleStartEdit}
            className={`p-1 hover:bg-gray-100 rounded-md transition-colors opacity-0 group-hover/inline-edit:opacity-100 ${buttonClassName}`}
            title="Edit"
          >
            <Pencil className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </button>
        )}
      </div>
    </div>
  )
}
