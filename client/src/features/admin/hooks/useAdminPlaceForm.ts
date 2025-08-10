import { useState } from 'react'
import { adminPlacesService } from '../services/adminPlacesService'
import type { AdminPlace, AdminPlaceForm } from '../types/admin.types'

export function useAdminPlaceForm() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<AdminPlaceForm>(adminPlacesService.createEmptyForm())
  const [submitting, setSubmitting] = useState(false)

  const openCreateForm = () => {
    setForm(adminPlacesService.createEmptyForm())
    setOpen(true)
  }

  const openEditForm = (place: AdminPlace) => {
    setForm(adminPlacesService.mapPlaceToForm(place))
    setOpen(true)
  }

  const closeForm = () => {
    setOpen(false)
    setForm(adminPlacesService.createEmptyForm())
  }

  const updateForm = (updates: Partial<AdminPlaceForm>) => {
    setForm(prev => ({ ...prev, ...updates }))
  }

  const handleSubmit = async (
    onSuccess: (id?: string, data?: AdminPlaceForm) => Promise<void>
  ) => {
    setSubmitting(true)
    try {
      await onSuccess(form.id, form)
      closeForm()
    } catch (err) {
      console.error('Form submission error:', err)
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const isEditing = Boolean(form.id)

  return {
    open,
    form,
    submitting,
    isEditing,
    openCreateForm,
    openEditForm,
    closeForm,
    updateForm,
    handleSubmit
  }
}
