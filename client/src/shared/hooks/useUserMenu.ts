import { useState, useCallback } from 'react'

interface UseUserMenuReturn {
  anchorEl: HTMLElement | null
  open: boolean
  handleOpen: (event: React.MouseEvent<HTMLElement>) => void
  handleClose: () => void
}

export const useUserMenu = (): UseUserMenuReturn => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  return {
    anchorEl,
    open,
    handleOpen,
    handleClose
  }
}
