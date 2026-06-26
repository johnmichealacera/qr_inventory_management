import type { ReactNode } from "react";

export type SelectItemOption = {
  value: string;
  label: ReactNode;
};

export function mapSelectItems<T>(
  items: T[],
  getValue: (item: T) => string,
  getLabel: (item: T) => ReactNode
): SelectItemOption[] {
  return items.map((item) => ({
    value: getValue(item),
    label: getLabel(item),
  }));
}
