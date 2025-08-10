import { useState, useCallback } from 'react'
import type { SettingsTab } from '../types/adminSettings.types'
import { AdminSettingsUtils } from '../utils/adminSettingsUtils'

interface UseSettingsTabsReturn {
  activeTab: number
  activeTabKey: SettingsTab
  tabsConfig: Array<{
    id: number
    key: SettingsTab
    label: string
    icon: React.ComponentType
  }>
  changeTab: (tabIndex: number) => void
  changeTabByKey: (tabKey: SettingsTab) => void
  getTabIndexByKey: (tabKey: SettingsTab) => number
}

export const useSettingsTabs = (initialTab: number = 0): UseSettingsTabsReturn => {
  const [activeTab, setActiveTab] = useState(initialTab)
  const tabsConfig = AdminSettingsUtils.getTabsConfig()

  const changeTab = useCallback((tabIndex: number) => {
    if (tabIndex >= 0 && tabIndex < tabsConfig.length) {
      setActiveTab(tabIndex)
    }
  }, [tabsConfig.length])

  const changeTabByKey = useCallback((tabKey: SettingsTab) => {
    const tabIndex = tabsConfig.findIndex(tab => tab.key === tabKey)
    if (tabIndex !== -1) {
      setActiveTab(tabIndex)
    }
  }, [tabsConfig])

  const getTabIndexByKey = useCallback((tabKey: SettingsTab) => {
    return tabsConfig.findIndex(tab => tab.key === tabKey)
  }, [tabsConfig])

  const activeTabKey = tabsConfig[activeTab]?.key || 'general'

  return {
    activeTab,
    activeTabKey,
    tabsConfig,
    changeTab,
    changeTabByKey,
    getTabIndexByKey
  }
}
