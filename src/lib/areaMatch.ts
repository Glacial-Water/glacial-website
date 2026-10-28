// Area matching (D118 b), the same rules as Home's area check, shared by the How delivery works page.
// Case-insensitive on a name or an alias; plain "DHA" counts as served (parent of the DHA Phase areas); a sub-area alone ("Block R") does not;
// "Johar Town Block R" is the parent Johar Town. "Punjab Society" is served. "Park View Society" = Park View City.
// Bahria Town, Bahria Orchard and Nasheman Iqbal stay distinct: only exact names match, no prefix guessing beyond the Phase rule.
import areaData from '../data/areas.json';
const norm = (t: string) => t.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
const served = new Map<string, string>();
const subOf = new Map<string, string[]>();
for (const a of areaData.areas) {
  served.set(norm(a.name), a.name);
  a.aliases.forEach((x) => served.set(norm(x), a.name));
  const m = /^(.*) phase \d+$/i.exec(a.name);
  if (m && !served.has(norm(m[1]))) served.set(norm(m[1]), m[1]);
  if (a.subAreas.length) subOf.set(norm(a.name), a.subAreas.map(norm));
}
served.set('park view society', 'Park View City'); // D118 b: Register S2 absorbs Park View Society into Park View City
export function lookupArea(typed: string): string | null {
  const q = norm(typed);
  if (!q) return null;
  const hit = served.get(q);
  if (hit) return hit;
  for (const [parent, subs] of subOf) {
    if (q.startsWith(parent + ' ')) {
      const rest = q.slice(parent.length + 1).replace(/^block /, '');
      if (subs.some((x) => x === rest || x === 'block ' + rest)) return served.get(parent) || null;
    }
  }
  return null;
}
