export const extractPhone = (description: string): string | null => {
  if (!description) return null
  
  const phoneRegex = /(?:Teléfono:|Tel:|Telefono:|Phone:)\s*([+]?[\d\s\-()]+)/i
  const match = description.match(phoneRegex)
  
  if (match && match[1]) {
    return match[1].trim()
  }
  
  const directPhoneRegex = /[+]?[\d\s\-()]{8,}/
  const directMatch = description.match(directPhoneRegex)
  
  if (directMatch) {
    return directMatch[0].trim()
  }
  
  return null
}
