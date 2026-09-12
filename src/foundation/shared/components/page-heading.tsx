import { ReactNode } from 'react'
import H1 from './h1';
import Breadcrumb from './breadcrumb';
import { BreadcrumbEntry, ActionButtonItem } from '../types/props';
import ActionsButton from './actions-button';

/**
 * Reusable page heading component combining the page title with an optional breadcrumb trail and page actions.
 *
 * @param children - Page title, rendered inside `H1`.
 * @param breadCrumbItems - Items passed to `Breadcrumb`. When omitted, no breadcrumb is rendered.
 * @param breadCrumbMaxItems - `maxItems` passed to `Breadcrumb`.
 * @param actions - Dropdown menu items passed to `ActionsButton`. When omitted, no page actions are rendered.
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
  actions?: ActionButtonItem[];
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <H1>{children}</H1>

      <div className="flex items-center gap-4">
        {breadCrumbItems && (
          <Breadcrumb items={breadCrumbItems} maxItems={breadCrumbMaxItems} />
        )}
        {actions && <ActionsButton actions={actions} />}
      </div>
    </div>
  )
}
