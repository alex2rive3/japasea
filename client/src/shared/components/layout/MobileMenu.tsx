import {
  Drawer
} from '@mui/material'
import { Sidebar } from './Sidebar'
import { LayoutUtils } from '../../utils/layoutUtils'
import type { MobileMenuProps } from '../../types/layout.types'

export const MobileMenu = ({
  open,
  onClose,
  menuItems,
  onNavigate,
  currentPath
}: MobileMenuProps) => {
  const drawerWidth = 260

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={LayoutUtils.createDrawerStyle('mobile', drawerWidth)}
    >
      <Sidebar
        menuItems={menuItems}
        onNavigate={onNavigate}
        currentPath={currentPath}
      />
    </Drawer>
  )
}
