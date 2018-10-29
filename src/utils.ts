import {Q} from "./Types";

export const diff = (a: Q, b: Q): number => {
  return (
    (a.sortOrder - b.sortOrder) ||
    (a.sortIndex - b.sortIndex) ||
    (a.index - b.index)
  );
};
