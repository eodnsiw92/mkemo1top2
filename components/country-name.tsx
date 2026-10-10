import { splitCountryFlag } from '@/lib/country'

type CountryNameProps = {
  name: string
  className?: string
}

export function CountryName({ name, className }: CountryNameProps) {
  const { displayName, flag } = splitCountryFlag(name)

  return (
    <span className={className}>
      {displayName}
      {flag && <span className="country-flag" role="img" aria-label="Country flag" title="Country flag">{flag}</span>}
    </span>
  )
}
