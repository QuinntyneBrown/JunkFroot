export type TagVariant = 'vegan' | 'gf' | 'nf' | 'df' | 'default';

const TAG_LABELS: Record<string, string> = {
  Vegan: 'Vegan',
  GF: 'GF',
  NF: 'NF',
  DF: 'DF',
};

const TAG_VARIANTS: Record<string, TagVariant> = {
  Vegan: 'vegan',
  GF: 'gf',
  NF: 'nf',
  DF: 'df',
};

export function formatTag(tag: string): string {
  return TAG_LABELS[tag] ?? tag;
}

export function getTagVariant(tag: string): TagVariant {
  return TAG_VARIANTS[tag] ?? 'default';
}
