import { ReactNode } from "react";

interface ChildrenProp {
  children: ReactNode
}

export interface BreadcrumbEntry {
  label: string;
  path?: string;
}

interface PageActionItemBase {
  label: string;
  icon?: ReactNode;
}

/**
 * A single entry in a `PageActions` dropdown menu.
 * `action` and `path` are mutually exclusive: provide exactly one of them.
 */
export type PageActionItem = PageActionItemBase &
  ({ action: () => void; path?: undefined } | { path: string; action?: undefined });