import { ReactNode } from "react";

interface ChildrenProp {
  children: ReactNode
}

export interface BreadcrumbEntry {
  label: string;
  path?: string;
}

interface ActionButtonItemBase {
  label: string;
  icon?: ReactNode;
}

/**
 * A single entry in a `ActionsButton` dropdown menu.
 * `action` and `path` are mutually exclusive: provide exactly one of them.
 */
export type ActionButtonItem = ActionButtonItemBase &
  ({ action: () => void; path?: undefined } | { path: string; action?: undefined });