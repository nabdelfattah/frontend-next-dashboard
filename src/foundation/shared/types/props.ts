import { ReactNode } from "react";

interface ChildrenProp {
  children: ReactNode
}

export interface BreadcrumbEntry {
  label: string;
  path?: string;
}

export interface TableData {
  label: string;
  path?: string;
}