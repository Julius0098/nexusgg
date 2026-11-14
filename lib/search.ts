export const normalize = (value:string) => value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
export function includesTerms(haystack:string,query:string) {
  const text=normalize(haystack);
  return normalize(query).trim().split(/\s+/).every(term=>text.includes(term));
}
