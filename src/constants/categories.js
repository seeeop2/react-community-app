export const CATEGORY_LIST = [
  {
    value: "NOTICE",
    label: "공지"
  },
  {
    value: "INFO",
    label: "정보"
  },
  {
    value: "CHAT",
    label: "잡담"
  },
];

export const CATEGORY_MAP = CATEGORY_LIST.reduce((map, category) => {
  map[category.value] = category.label;
  return map;
}, {});