const FLAG_SUFFIX = /\s+([\u{1F1E6}-\u{1F1FF}]{2})$/u

export function countryFlagFromAcceptLanguage(acceptLanguage: string | null) {
  if (!acceptLanguage) return ''

  for (const preference of acceptLanguage.split(',')) {
    const languageTag = preference.split(';')[0]?.trim()
    if (!languageTag) continue

    try {
      const region = new Intl.Locale(languageTag).region?.toUpperCase()
      if (!region || !/^[A-Z]{2}$/.test(region)) continue
      const first = String.fromCodePoint(0x1f1e6 + region.charCodeAt(0) - 65)
      const second = String.fromCodePoint(0x1f1e6 + region.charCodeAt(1) - 65)
      return `${first}${second}`
    } catch {
      continue
    }
  }

  return ''
}

export function withCountryFlag(name: string, flag: string) {
  if (!flag) return name
  const normalizedName = name.replace(FLAG_SUFFIX, '').trim()
  return `${normalizedName} ${flag}`
}

export function splitCountryFlag(name: string) {
  const match = name.match(FLAG_SUFFIX)
  return match
    ? { displayName: name.replace(FLAG_SUFFIX, '').trim(), flag: match[1] }
    : { displayName: name, flag: '' }
}

export const COUNTRY_FLAG_SUFFIX_PATTERN = FLAG_SUFFIX
