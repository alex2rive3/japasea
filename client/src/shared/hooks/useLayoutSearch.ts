import { useState, useCallback } from 'react'

interface UseLayoutSearchReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSearchSubmit: (event: React.FormEvent) => void
  clearSearch: () => void
}

interface UseLayoutSearchOptions {
  onSearch?: (query: string) => void
  debounceMs?: number
  minLength?: number
}

export const useLayoutSearch = (options: UseLayoutSearchOptions = {}): UseLayoutSearchReturn => {
  const { onSearch, minLength = 0 } = options
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchQuery(value)
    
    if (onSearch && value.length >= minLength) {
      onSearch(value)
    }
  }, [onSearch, minLength])

  const handleSearchSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }, [onSearch, searchQuery])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    if (onSearch) {
      onSearch('')
    }
  }, [onSearch])

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  return {
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    handleSearchChange,
    handleSearchSubmit,
    clearSearch
  }
}
