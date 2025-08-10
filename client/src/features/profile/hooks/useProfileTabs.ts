import { useState } from 'react'

export function useProfileTabs() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return {
    tabValue,
    handleTabChange
  }
}
