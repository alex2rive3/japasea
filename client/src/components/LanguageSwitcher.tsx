import React from 'react';
import { 
  FormControl, 
  Select, 
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, type SupportedLanguage } from '../i18n';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value as SupportedLanguage;
    i18n.changeLanguage(newLanguage);
  };

  const getCurrentLanguageDisplay = () => {
    const lang = i18n.language as SupportedLanguage;
    return `${getFlag(lang)} ${lang.toUpperCase()}`;
  };

  return (
    <FormControl size="small">
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        variant="outlined"
        displayEmpty
        sx={{
          minWidth: 80,
          '& .MuiSelect-select': {
            py: 0.75,
            px: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: '0.875rem',
            fontWeight: 500
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          }
        }}
        renderValue={() => getCurrentLanguageDisplay()}
      >
        {supportedLanguages.map((lang) => (
          <MenuItem key={lang} value={lang}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '1.1em' }}>
                {getFlag(lang)}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {lang.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getLanguageLabel(lang)}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Helper function to get flag emoji for each language
const getFlag = (language: SupportedLanguage): string => {
  const flags: Record<SupportedLanguage, string> = {
    es: '🇪🇸',
    en: '🇺🇸',
    pt: '🇵🇹'
  };
  return flags[language] || '🌐';
};

// Helper function to get language labels
const getLanguageLabel = (language: SupportedLanguage): string => {
  const labels: Record<SupportedLanguage, string> = {
    es: 'Español',
    en: 'English',
    pt: 'Português'
  };
  return labels[language] || '';
};

export default LanguageSwitcher;