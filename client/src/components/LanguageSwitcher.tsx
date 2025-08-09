import React from 'react';
import { 
  FormControl, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Box,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, languageLabels, type SupportedLanguage } from '../i18n';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value as SupportedLanguage;
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl size="small" fullWidth>
        <Select
          value={i18n.language}
          onChange={handleLanguageChange}
          variant="outlined"
          sx={{
            backgroundColor: 'background.paper',
            '& .MuiSelect-select': {
              py: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }
          }}
        >
          {supportedLanguages.map((lang) => (
            <MenuItem key={lang} value={lang}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  {getFlag(lang)}
                </Typography>
                <Typography variant="body2">
                  {languageLabels[lang]}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

// Helper function to get flag emoji for each language
const getFlag = (language: SupportedLanguage): string => {
  const flags: Record<SupportedLanguage, string> = {
    es: '🇪🇸',
    en: '🇺🇸',
    pt: '🇧🇷'
  };
  return flags[language] || '🌐';
};

export default LanguageSwitcher;
