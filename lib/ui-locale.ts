export type UiLocale = 'ar' | 'en' | 'zh' | 'ru'

const localeOrder: UiLocale[] = ['ar', 'en', 'zh', 'ru']

export function resolveUiLocale(acceptLanguage: string | null | undefined): UiLocale {
  const preferences = (acceptLanguage ?? '')
    .split(',')
    .map((entry) => {
      const [tag, quality] = entry.trim().split(';q=')
      return { tag: tag?.toLowerCase() ?? '', quality: quality ? Number(quality) : 1 }
    })
    .filter((preference) => preference.tag)
    .sort((first, second) => second.quality - first.quality)

  for (const { tag } of preferences) {
    if (tag.startsWith('ar')) return 'ar'
    if (tag.startsWith('zh')) return 'zh'
    if (tag.startsWith('ru')) return 'ru'
    if (tag.startsWith('en')) return 'en'
  }

  return 'en'
}

export function htmlLanguage(locale: UiLocale) {
  if (locale === 'ar') return 'ar-EG'
  if (locale === 'zh') return 'zh-CN'
  if (locale === 'ru') return 'ru-RU'
  return 'en'
}

export function nextUiLocale(locale: UiLocale): UiLocale {
  const index = localeOrder.indexOf(locale)
  return localeOrder[(index + 1) % localeOrder.length]
}

export function textDirection(locale: UiLocale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

export function localeName(locale: UiLocale) {
  return { ar: 'العربية', en: 'English', zh: '中文', ru: 'Русский' }[locale]
}

export function alternateLocaleName(locale: UiLocale) {
  return { ar: 'English', en: 'العربية', zh: 'Русский', ru: '中文' }[locale]
}

export function asTranslationLanguage(locale: UiLocale) {
  return { ar: 'Egyptian Arabic', en: 'English', zh: 'Simplified Chinese', ru: 'Russian' }[locale]
}
