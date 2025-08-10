import {
  Paper,
  InputBase
} from '@mui/material'
import {
  Search as SearchIcon
} from '@mui/icons-material'
import { LayoutUtils } from '../../utils/layoutUtils'
import type { SearchBarProps } from '../../types/layout.types'

export const SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Buscar...",
  maxWidth = 600
}: SearchBarProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <Paper
      component="form"
      onSubmit={onSubmit}
      sx={{
        ...LayoutUtils.createSearchBarStyle(),
        maxWidth
      }}
      elevation={0}
    >
      <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
      <InputBase
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        sx={{
          ml: 1,
          flex: 1,
          fontSize: '0.95rem'
        }}
        inputProps={{ 'aria-label': placeholder }}
      />
    </Paper>
  )
}
