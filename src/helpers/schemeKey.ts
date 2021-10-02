export default function schemeKey(e: any): string {
  if (e?.schemeCode && e?.schemeName) {
    return `${e.schemeCode}: ${e.schemeName}`
  } else if (e?.schemeName) {
    return `: ${e.schemeName}`
  } else if (e?.schemeCode) {
    return `${e.schemeCode}:`
  }
  return ""
}
