export const DEFAULT_CATEGORY = 'ALL';

export const CATEGORY_LIST = [
  {
    value: 'NOTICE',
    label: '공지',
  },
  {
    value: 'INFO',
    label: '정보',
  },
  {
    value: 'CHAT',
    label: '잡담',
  },
];

export const FILTER_CATEGORIES = [
  {
    value: DEFAULT_CATEGORY,
    label: '전체',
  },
  ...CATEGORY_LIST,
];

export const CATEGORY_MAP = CATEGORY_LIST.reduce((map, category) => {
  map[category.value] = category.label;
  return map;
}, {});
