import { SectionMeta } from '@/types/schedule';
import newRoutine from '@/data/new-routine.json';

export const BATCH_DEFINITIONS = [
  { batchNumber: 73, name: 'Batch 73 (1st Year, 1st Sem)', letters: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T'] },
  { batchNumber: 72, name: 'Batch 72 (1st Year, 2nd Sem)', letters: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V'] },
  { batchNumber: 71, name: 'Batch 71 (2nd Year, 1st Sem)', letters: ['A','B','C','D','E','F','G','H','I','J','K','L'] },
  { batchNumber: 70, name: 'Batch 70 (2nd Year, 2nd Sem)', letters: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R'] },
  { batchNumber: 69, name: 'Batch 69 (3rd Year, 1st Sem)', letters: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'] },
  { batchNumber: 68, name: 'Batch 68 (3rd Year, 2nd Sem)', letters: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'] },
  { batchNumber: 67, name: 'Batch 67 (4th Year, 1st Sem)', letters: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'] },
  { batchNumber: 66, name: 'Batch 66 (4th Year, 2nd Sem)', letters: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'] },
  { batchNumber: 65, name: 'Batch 65 (Senior Batch)', letters: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'] },
  { batchNumber: 64, name: 'Batch 64 (Graduating Batch)', letters: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'] },
  { batchNumber: 63, name: 'Batch 63 (Final Term / Thesis)', letters: ['A','B','C','D','E','F','G','H'] },
];

const STANDARD_SECTIONS: SectionMeta[] = BATCH_DEFINITIONS.flatMap((batch) =>
  batch.letters.map((letter) => {
    const id = `${batch.batchNumber}_${letter}`;
    return {
      id,
      batch: `Batch ${batch.batchNumber}`,
      batchNumber: batch.batchNumber,
      sectionLetter: letter,
      displayName: `Batch ${batch.batchNumber} - Section ${letter}`,
      hasSubSections: true,
      subSections: [`${letter}1`, `${letter}2`],
    };
  })
);

// Map to hold all sections
const dynamicSectionsMap = new Map<string, SectionMeta>(
  STANDARD_SECTIONS.map((s) => [s.id.toUpperCase(), s])
);

// Ingest any additional sections from new-routine.json (e.g. Retake sections)
if (newRoutine && typeof newRoutine === 'object' && 'sections' in newRoutine) {
  const sectionsObj = (newRoutine as { sections: Record<string, unknown> }).sections;
  for (const rawSecId of Object.keys(sectionsObj)) {
    const secId = rawSecId.trim().toUpperCase();
    if (!dynamicSectionsMap.has(secId)) {
      const parts = secId.split('_');
      const batchStr = parts[0];
      const letter = parts.slice(1).join('_');
      const batchNum = parseInt(batchStr, 10) || 0;
      dynamicSectionsMap.set(secId, {
        id: secId,
        batch: batchNum > 0 ? `Batch ${batchNum}` : 'Retake',
        batchNumber: batchNum,
        sectionLetter: letter,
        displayName: batchNum > 0 ? `Batch ${batchNum} - Section ${letter}` : `Section ${secId}`,
        hasSubSections: true,
        subSections: [`${letter}1`, `${letter}2`],
      });
    }
  }
}

export const ALL_SECTIONS: SectionMeta[] = Array.from(dynamicSectionsMap.values());

export const SECTION_LOOKUP: Map<string, SectionMeta> = dynamicSectionsMap;

export function getSectionById(id: string): SectionMeta | undefined {
  if (!id) return undefined;
  const normalized = id.replace('-', '_').toUpperCase();
  return SECTION_LOOKUP.get(normalized);
}

