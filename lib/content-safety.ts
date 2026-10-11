const prohibitedPatterns = [
  /\bporn(?:ography|ographic)?\b/i,
  /\bxxx\b/i,
  /\bhentai\b/i,
  /\bonly\s*fans\b/i,
  /\bsex\s*video\b/i,
  /\badult\s*(?:video|film|content|site)s?\b/i,
  /\b(?:xvideos?|xhamster|xnxx|pornhub|youporn|redtube|spankbang|youjizz|rule34)\b/i,
  /\b(?:chaturbate|stripchat|bongacams|livejasmin|cam4|camsoda|myfreecams|brazzers|bangbros|realitykings|naughtyamerica|eporner|tnaflix|motherless|hqporner|porntrex|txxx|hclips|beeg|tube8|thumbzilla|fapello|erome|nhentai|hanime|e-?hentai|gelbooru|fansly|manyvids|clips4sale|literotica|xart|playboy)\b/i,
  /porn|xxx|hentai|xvideo|xnxx|sexcam|camgirl|nudes?\b|milf|onlyfans/i,
  /\bnsfw\b|not\s+safe\s+for\s+work/i,
  /اباحي|إباحي|إباحية|اباحية|جنس\s*صريح|هنتاي|هنتاى|افلام\s*للكبار|أفلام\s*للكبار|محتوى\s*جنسي|عري/i,
]

export function containsProhibitedSearch(value: string) {
  const normalized = value.normalize('NFKC').replace(/[.\-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  return prohibitedPatterns.some((pattern) => pattern.test(normalized))
}

export function isAdultRatingLabel(value: string) {
  return /\b(?:adult|mature|rta-5042|restricted|explicit)\b/i.test(value)
}

export function cleanMessage(value: string) {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
}
