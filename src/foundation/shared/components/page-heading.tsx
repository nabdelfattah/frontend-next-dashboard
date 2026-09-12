import { ReactNode } from 'react'
import H1 from './h1';
import Breadcrumb from './breadcrumb';
import { BreadcrumbEntry, PageActionItem } from '../types/props';
import PageActions from './page-actions';

/**
 * Reusable page heading component combining the page title with an optional breadcrumb trail and page actions.
 *
 * @param children - Page title, rendered inside `H1`.
 * @param breadCrumbItems - Items passed to `Breadcrumb`. When omitted, no breadcrumb is rendered.
 * @param breadCrumbMaxItems - `maxItems` passed to `Breadcrumb`.
 * @param actions - Dropdown menu items passed to `PageActions`. When omitted, no page actions are rendered.
 *
 * @example
 * <PageHeading breadCrumbItems={[{ label: "Home", path: "/" }, { label: "Users" }]} actions={[{ label: "Add", action: addNew }]}>
 *   Users
 * </PageHeading>
 */
export default function PageHeading({
  breadCrumbItems,
  breadCrumbMaxItems,
  actions,
  children,
}: {
  breadCrumbItems?: BreadcrumbEntry[];
  breadCrumbMaxItems?: number;
  actions?: PageActionItem[];
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <H1>{children}</H1>

      <div className="flex items-center gap-4">
        {breadCrumbItems && (
          <Breadcrumb items={breadCrumbItems} maxItems={breadCrumbMaxItems} />
        )}
        {actions && <PageActions actions={actions} />}
      </div>
    </div>
  )
}
