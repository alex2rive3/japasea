import { useState, useCallback } from 'react'

interface UseLayoutDrawerReturn {
  mobileOpen: boolean
  desktopOpen: boolean
  toggleMobileDrawer: () => void
  toggleDesktopDrawer: () => void
  closeMobileDrawer: () => void
  openMobileDrawer: () => void
  setDesktopOpen: (open: boolean) => void
}

export const useLayoutDrawer = (initialDesktopOpen = true): UseLayoutDrawerReturn => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(initialDesktopOpen)

  const toggleMobileDrawer = useCallback(() => {
    setMobileOpen(prev => !prev)
  }, [])

  const toggleDesktopDrawer = useCallback(() => {
    setDesktopOpen(prev => !prev)
  }, [])

  const closeMobileDrawer = useCallback(() => {
    setMobileOpen(false)
  }, [])

  const openMobileDrawer = useCallback(() => {
    setMobileOpen(true)
  }, [])

  const handleSetDesktopOpen = useCallback((open: boolean) => {
    setDesktopOpen(open)
  }, [])

  return {
    mobileOpen,
    desktopOpen,
    toggleMobileDrawer,
    toggleDesktopDrawer,
    closeMobileDrawer,
    openMobileDrawer,
    setDesktopOpen: handleSetDesktopOpen
  }
}
