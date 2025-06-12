import { CSVRecord, SessionPresentationRecord } from "../csv"

/**
 * Removes diacritics from a string (such as é -> e). This can make fuzzy
 * matching of strings (in the context of filtering events) easier.
 *
 * @param   {string}  text  The input text
 *
 * @return  {string}        The normalized output text.
 */
function removeCombiningDiacritics (text: string): string {
  return text
    // This decomposes potentially combined individual characters into their
    // constituent character + diacritic mark ...
    .normalize('NFD')
    // ... whose diacritics are then removed here. The Unicode range is
    // described in this PDF: https://www.unicode.org/charts//PDF/Unicode-4.0/U40-0300.pdf
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Returns true if the provided query occurs anywhere in this event
 *
 * @param   {CSVRecord}  event  The event
 * @param   {string}     query  The query
 *
 * @return  {boolean}           Whether query matches event
 */
export function matchEvent (event: CSVRecord|SessionPresentationRecord, query: string): boolean {
  query = removeCombiningDiacritics(query)
  if (removeCombiningDiacritics(event.title.toLowerCase()).includes(query) || event.id.includes(query)) {
    return true
  }

  for (const prop of ['chair', 'location', 'author', 'abstract']) {
    // @ts-expect-error This is a bit ugly, but efficient. We check if any of
    // the properties exist in the event, that its a string, and only then match.
    if (prop in event && typeof(event[prop]) === 'string' && removeCombiningDiacritics(event[prop]!.toLowerCase()).includes(query)) {
      return true
    }
  }

  if (event.type === 'session') {
    const anyMatch = event.presentations.map(p => matchEvent(p, query))
    if (anyMatch.some(v => v === true)) {
      return true
    }
  }

  return false
}
